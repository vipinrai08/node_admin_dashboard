
const express = require('express');
const router = express.Router();

// Get Dashboard
function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/Auth/login');
}
router.get('/', ensureAuthenticated, function(erq, res){
	res.render('dashboard',{
		title: 'Dashboard page'
	});
});

// router.post('/',(req, res) =>{
//     res.render('dashboard', {
//          title: 'Dashboard'
//     });
// });


module.exports = router;