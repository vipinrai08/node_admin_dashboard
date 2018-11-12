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
     req.checkBody('contactnumber', 'Contactnumber is required').isNumeric();

    var err = req.validationErrors();
	console.log(err)
	if (err) {
        let newErr = {};
        err && err.length ? err.map(item => {
            newErr = {
                ...newErr,
                [item.param]: item.msg
            }
        }) : {}

        console.log(newErr, 'newErr');
		res.render('contact', {
			err: newErr
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