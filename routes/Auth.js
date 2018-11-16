var express = require('express');
var router = express.Router();
var app = express();
var passport = require('passport');
var configAuth = require('./configAuth');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte');
const { isEmpty } = require('lodash');
const Validator = require('is_js');




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
 
	let { isValid, errors} = validator(req.body);
    console.log(isValid, errors)
	// Validation
	// req.checkBody('name', 'Name is required').notEmpty();
	// req.checkBody('email', 'Email is required').notEmpty();
	// req.checkBody('email', 'Email does not appear to be valid').isEmail();
	// req.checkBody('username', 'Username is required').notEmpty();
	// req.checkBody('password', 'Password is required').notEmpty();


	// var err = req.validationErrors();
	// console.log(err)
	if (!isValid) {
	// if (err) {
	// 	var newErr = {};
	// 	err && err.length ? err.map(item => {
    //         newErr = {
    //             ...newErr,
    //             [item.param]: item.msg
    //         }
    //     }) : {}

    //     console.log(newErr, 'newErr');
		res.render('Auth/register', {
			layout: false,
			err: errors,
			newUser: {name: req.body.name, username: req.body.username, email: req.body.email,
				password: req.body.password

			}
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

// router.post('/login', function (req, res) {

// 	let { isValid, errors} = validator(req.body);

// 	if (!isValid) {
// 		res.render('Auth/login', {
// 			layout: false,
// 			err: errors,
// 			errors: {username: req.body.username,
// 				password: req.body.password
// 			}
// 		})
		
// 	} else {
// 		return passport.authenticate('local', {
// 			successReturnToOrRedirect: '/dashboard',
// 			failureRedirect: '/Auth/login',
// 			failureFlash: true
// 		})
// 	}
// })

// router.post('/login', passport.authenticate('local', {
// 	successReturnToOrRedirect: '/dashboard',
// 	failureRedirect: '/Auth/login',
// 	failureFlash: true
// }))	

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {

	if (err) {
		console.log(err, 'err')  
		return next(err);
	}
	if (!user) {
		let errors = {};
		console.log(info, 'info')

		if(info && info.message === 'Missing credentials') {
			if(req && req.body && !req.body.username) {
				errors = {
					...errors,
					username: "Username is requried!"
				}	
			}

			if(req && req.body && !req.body.password) {
				errors = {
					...errors,
					password: "Password is required!"
				}	
			}
		}

		if(info && info.message === 'Unknown User') {
			errors = {
				message: "Username doesn't exist try using correct username"
			}
		}

		console.log(user, info, 'info')
		return res.render('Auth/login', {
			layout: false,
			err: errors,
			user: {
				username: req.body.username
			}
		})
	}
	req.logIn(user, function(err) {
		if (err) { return next(err); }
		return res.redirect('/dashboard');
	});
	})(req, res, next);
  });

 router.post('/signout',function(req,res){    
    if (!req.isAuthenticated()){
		res.redirect('/dashboard');
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

	function validator(data) {
	let errors = {};
	
	if (Validator.empty(data.name)) {
		errors.name = "Name is required!"
	}

	if (Validator.empty(data.username)) {
		errors.username = "Username is required!"
	}
	if(Validator.empty(data.email)) {
        errors.email = "Email is required!  "
    }

    if(data.email && !Validator.email(data.email)) {
        errors.email = "Email does not appear valid!"
    }


	if (Validator.empty(data.password)) {
		errors.password = "Password is required!"
	}

	return{
		isValid: isEmpty(errors),
		errors
	}
}
	

module.exports = router;