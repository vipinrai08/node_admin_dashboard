
const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    if (req.session && req.session.user) { // Check if session exists
		// lookup the user in the DB by pulling their email from the session
	   
		User.findOne({ username: req.session.user.username }, function (err, user) {
		   
		  if (!user) {
			// if the user isn't found in the DB, reset the session info and
			// redirect the user to the login page
			req.session.reset();
			res.redirect('Auth/login');
		  } else {
			// expose the user to the template
			res.locals.user = user;
	 
			//render the dashboard page
			res.render('dashboard',{title: 'Dashboard'});
		  }
		});
	  } else {
		 
		res.redirect('dashboard');
	  }
});

router.post('/',(req, res) =>{
    res.render('dashboard', {
         title: 'Dashboard'
    });
});


module.exports = router;