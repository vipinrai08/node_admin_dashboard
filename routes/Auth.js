var express = require('express');
var router = express.Router();
var app = express();
var passport = require('passport');
var configAuth = require('./configAuth');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/adminlte');



// Login
router.get('/login', function(req, res) {
		if (req.isAuthenticated()){
			res.redirect('/dashboard');
		}
		 else {
		res.render('Auth/login',{
			layout: false
		});
	}
});

// Register view
router.get('/register', function(req, res) {
	res.render('Auth/register',{
        layout: false
    });
});

// Register User
router.post('/register', function(req, res) {

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
 
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email does not appear to be valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();


	var err = req.validationErrors();
	console.log(err)
	if (err) {
		res.render('Auth/register', {
			layout: false,
			err: err
		});
	} else {
		
				var newUser = new User({
					name: name,
					email: email,
					username: username,
					password: password,
				}); 
				User.createUser(newUser, function(err, user) {
					if (err) throw err;
					console.log(user);
				});
				req.flash('success_msg', 'You are registered and can now login');
				res.redirect('/Auth/login');
			}
		});

passport.use(
	new LocalStrategy(function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function(err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	})
);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post('/login',
            passport.authenticate('local', {
			successReturnToOrRedirect: '/dashboard',
			failureRedirect: '/Auth/login',
			failureFlash: true
		}),
	function(req, res) {
		res.redirect('/');
	}
 );

 router.get('/signout',function(req,res){    
    if (!req.isAuthenticated()){
		res.redirect('Auth/login');
	}
	 else {
	res.render('/dashboard',{
		layout: false
	});
}
});

// Signing using Facebook
passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
   Process.nextTick(function(){
	   User.findOne({'facebook.id':profile.id}, function (err, user) {
		   if(err)
		   return done(err);
		   if (user)
		   return done(null, user);
		   else{
			   var newUser = new User();
				   newUser.facebook.id = profile.id,
				   newUser.facebook.token = accessToken,
				   newUser.facebook.name = profile.name.givenName +' '+ profile.name.familyName,
				   newUser.facebook.email = profile.emails[0].value;

				   newUser.save(function(err){
					   if(err)
					   throw err;
					   return done(null, newUser);
				   });

		   }
	   });
	});
  }
));

router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email']}));
router.get('/auth/facebook/callback',
 passport.authenticate('facebook', { successRedirect: '/profile',
									  failureRedirect: '/auth/login' }));
									  

module.exports = router;