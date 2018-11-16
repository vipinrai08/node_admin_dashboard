const express = require('express');
const router = express.Router();


// function ensureAuthenticated(req, res, next){
// 	if (req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect('/dashboard');
// }
// router.get('/', ensureAuthenticated, function(req, res){
//     if (req.isAuthenticated()){
// 	}
// 	res.render('Auth/login',{
//         layout: false
// 	});
// });
router.get('/', function(req, res, next){
    if(req.session){
        req.session.destroy(function(err) {
            if(err) {
              return next(err);
            } else {
              return res.redirect('Auth/login');
            }
          });
    }
  });


  module.exports = router;