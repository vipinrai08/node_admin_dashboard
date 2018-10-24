var express = require('express');
var router = express.Router();
var app = express();
var passport = require('passport');
const Utils = require('../utils/index');
var randomstring = require('randomstring');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte',{ useNewUrlParser: true });



// Login
router.get('/login', function(req, res) {
	res.render('Auth/login',{
        layout: false
    });
});

// Register view
router.get('/register', function(req, res) {
	res.render('Auth/register',{
        layout: false
    });
});

// Register User
router.post('/register', function(req, res) {
	// user.find({email:req.body.email})`
	// const schema = Joi.object().keys({
	// 	username: Joi.string().alphanum().min(3).max(30).required(),
	// 	email: Joi.string().email({ minDomainAtoms: 2 }),
	// 	password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
	// })
	// Joi.validate({ username: '' }, schema, function (err, value) { 
	// 	if(err){
	// 		res.redirect('Auth/register')
	// 	}
	// });
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

router.post(
	'/login',
	passport.authenticate('local', {
		successReturnToOrRedirect: '/dashboard',
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

// FORGOT PASSWORD
router.get('/forgotpassword', function(req, res) {
	res.render('Auth/forgotpassword',{
        layout: false
    });
});
router.post('/resetpage', (req, res, next) => {
	const token = randomstring.generate(50);
	User.findOneAndUpdate({ email: req.body.email }, { $set: { token: token } })
	.exec()
	.then(result => {
		if(!result) {
			return res.status(400).json({
				message: 'Email doesn\'t exists..'
			});
		}

		Utils.sendMail({
			to: 'reply.vipinrai@gmail.com',//req.body.email,
			subject: 'Reset Password',
			message: { token: token, email: req.body.email },
			template: 'resetpage'
		});
		return res.status(200).json({
			message: 'Verification email has been sent.'
		});
	})
	.catch(err => {
		return res.status(500).json({
			message: 'Email doesn\'t exists..'
		});
	});
});

module.exports = router;