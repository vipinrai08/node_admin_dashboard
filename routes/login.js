const express = require('express');
const router = express.Router();
var _ = require('lodash');
var passport = require('passport');



// Login
router.get('/', (req, res) => {
    res.render('examples/login', {
     title: 'Login',
     layout: false
    });
});

    router.post('/',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/login');
});
    module.exports = router;