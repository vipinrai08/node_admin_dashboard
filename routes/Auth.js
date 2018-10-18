var express = require('express');
var router = express.Router();
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');


// Login
router.get('/login', function(req, res) {
	res.render('login',{
        layout: false
    });
});

// Register view
router.get('/register', function(req, res) {
	res.render('register',{
        layout: false
    });
});

// Register User
router.post('/register', function(req, res) {
	// user.find({email:req.body.email})`
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	var err = req.validationErrors();
	if (err) {
		res.render('register', {
			layout: false,
			err: err
		});
	} else {
		//checking for email and username are already taken
		User.findOne(
			{
				username: {
					$regex: '^' + username + '\\b',
					$options: 'i'
				}
			},
			function(err, user) {
				User.findOne(
					{
						email: {
							$regex: '^' + email + '\\b',
							$options: 'i'
						}
					},
					function(err, mail) {
						if (user || mail) {
							res.render('register', {
								layout: false,
								user: user,
								mail: mail
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
					}
				);
			}
		);
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

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/Auth/login',
		failureFlash: true
	}),
	function(req, res) {
		res.redirect('/');
	}
);

router.get('/logout', function(req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/Auth/login');
});

module.exports = router;