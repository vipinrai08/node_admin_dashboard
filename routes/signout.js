const express = require('express');
const router = express.Router();


function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/Auth/login');
}
router.get('/', ensureAuthenticated, function(erq, res){
	res.render('Auth/login',{
        layout: false
	});
});

  module.exports = router;