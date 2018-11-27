var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
graph = require('fbgraph');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte');
const { isEmpty } = require('lodash');
const Validator = require('is_js');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


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
	User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) {
            alert(err)
            if (user) {
                alert('this username is already taken. Please choose another.')
                console.log('there was a user');
                return false;

            }
        }
    });

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
 
	let { isValid, errors} = validator(req.body);
    console.log(isValid, errors)
	if (!isValid) {
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



	//Login//

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {


	if (err) {
		console.log(err, 'err')  
		return next(err);
	}
	if (!user) {
		let errors = {};

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
					password: "Password is required!",
				}
			}
		}

		if(info && info.message === 'Unknown User') {
			errors = {
				message: "Username doesn't exist try using correct username"
			}
		}

		if(info && info.message === "Invalid password") {
			errors = {
				password: info.message
			}
		}

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
	
//signing with facebook//
	passport.use(new FacebookStrategy({
    clientID: '245686906110731',
    clientSecret: 'bf2d82f373f3005cff3a9dbfbb3d6154',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		if(profile && profile.id) {
			User.findOne({ facebook: profile.id }, function(err, existingUser) {
				let user = {
					'id': profile.id,
					'name': profile.displayName,
					'gender': profile.gender ? profile.gender : ''
				}
				user
				.save(function(err) {
			  req.flash('info', { msg: 'Facebook account has been linked.' });
			  done(err, user);
		

				})
		   })
		}
	}
));
 router.get('/facebook',passport.authenticate('facebook'), function(req, res){
	var token = _.find(req.user.tokens, { kind: 'facebook' });
	graph.setAccessToken(token.accessToken);
	async.parallel({
	  getMe: function(done) {
		graph.get(req.user.facebook + "?fields=id,name,email,first_name,last_name,gender,link,locale,timezone", function(err, me) {
		  done(err, me);
		});
	  },
	  getMyFriends: function(done) {
		graph.get(req.user.facebook + '/friends', function(err, friends) {
		  done(err, friends.data);
		});
	  }
	},
	function(err, results) {
	  if (err) {
		return next(err);
	  }
	  res.render('/facebook', {
		title: 'Facebook API',
		me: results.getMe,
		friends: results.getMyFriends
	  });
	});
 });
 
 router.get('/facebook/callback', passport.authenticate('facebook', 
 { successRedirect: '/profile', failureRedirect: '/Auth/login' }));


// signing with google
// passport.use(new GoogleStrategy({

// 	clientID        : configAuth.googleAuth.clientID,
// 	clientSecret    : configAuth.googleAuth.clientSecret,
// 	callbackURL     : configAuth.googleAuth.callbackURL,

// },
// function(token, refreshToken, profile, done) {

// 	// make the code asynchronous
// 	// User.findOne won't fire until we have all our data back from Google
// 	process.nextTick(function() {

// 		// try to find the user based on their google id
// 		User.findOne({ 'google.id' : profile.id }, function(err, user) {
// 			if (err)
// 				return done(err);

// 			if (user) {

// 				// if a user is found, log them in
// 				return done(null, user);
// 			} else {
// 				// if the user isnt in our database, create a new user
// 				var newUser          = new User();

// 				// set all of the relevant information
// 				newUser.google.id    = profile.id;
// 				newUser.google.token = token;
// 				newUser.google.name  = profile.displayName;
// 				newUser.google.email = profile.emails[0].value; // pull the first email

// 				// save the user
// 				newUser.save(function(err) {
// 					if (err)
// 						throw err;
// 					return done(null, newUser);
// 				});
// 			}
// 		});
// 	});

// }));
// router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

//     // the callback after google has authenticated the user
//     router.get('/auth/google/callback',
//             passport.authenticate('google', {
//                     successRedirect : '/profile',
//                     failureRedirect : '/'
//             }));

//     // if user is authenticated in the session, carry on
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the home page
//     res.redirect('/');




// Validation function//

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
	 
	if (Validator.empty(data.password)) {
		errors.password = "Password is Invalid!"
	}
	return{
		isValid: isEmpty(errors),
		errors
	}
}
function findUserByEmail(email){

	if(email){
		return new Promise((resolve, reject) => {
		  User.findOne({ email: email })
			.exec((err, doc) => {
			  if (err) return reject(err)
			  if (doc) return reject(new Error('This email already exists. Please enter another email.'))
			  else return resolve(email)
			})
		})
	  }
   }

module.exports = router;