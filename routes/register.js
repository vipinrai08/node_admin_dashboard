const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


//Register
router.get('/', (req, res) => {
  res.render('examples/register', {
   title: 'Register',
   layout: false
  });
});


router.post('/', (req,res)=>{
  var user = new User({
    _id: new mongoose.Types.ObjectId(),
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    repassword: req.body.repassword
   });

   // Validation
	req.checkBody('fullname', 'FullName is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('repassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

	if (errors) {
		res.render('examples/register', { layout: false,
			errors: errors
		});
	}
	else {
		//checking for email 
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('examples/login', {
						mail: mail
					});
				}
				else {
					var newUser = new User({
						fullname: fullname,
						email: email,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/login');
				}
			});
	}
});
passport.use(new LocalStrategy(
	function (email, password, done) {
		User.getUserByEmail(email, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.getUserById(id, function (err, user) {
            done(err, user);
        });
    });
    module.exports = router;