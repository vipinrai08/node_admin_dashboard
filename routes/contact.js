const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
    res.redirect('/Auth/login');
}
    
router.get('/', ensureAuthenticated, (req, res, next) => {
    res.render('contact', {
     title: 'Contact'
    });
});

router.post('/', function(req, res, next) {

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();
    // req.checkBody('contact number', 'Contact number is required').isNumeric();

    var err = req.validationErrors();
	console.log(err)
	if (err) {
		res.render('contact', {
			err: err
        });
    }
    else{
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vipin.techindustan@gmail.com',
            pass: 'Vipin@123'
        }
    });
  
  var mailOptions = {
    from: 'vipin <vipin.techindustan@gmail.com>',
    to: req.body.email, 
    subject: 'Hello Thank You for Contact us.✔', // Subject line
      text: 'Learn to enjoy every minute of your life. Be happy now', // plain text body
      html: '<b>Learn to enjoy every minute of your life. Be happy now</b>' // html body
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.redirect('/');
    } else {
        console.log('message Sent: ' + info.response);
        res.redirect('/contact');
    }
  });
}
});
  
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         console.log(error);
//         res.redirect('/');
//     } else {
//         console.log('message Sent: ' + info.response);
//         res.redirect('/contact');
//     }
//   });
//   });
  
  module.exports = router;