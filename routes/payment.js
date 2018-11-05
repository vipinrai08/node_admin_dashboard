const keyPublishable = 'pk_test_wZkL3wTQYjcKKIirJkLOxaYW';
const keySecret = 'sk_test_BeJH4qTI5MQ52fkt173FfvyJ';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost:27017/adminlte');
const stripe = require("stripe")(keySecret);

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/Auth/login');
}

router.get("/", ensureAuthenticated, ((req, res) => {
    res.render('payment/index', {
        layout: false
    }); 
}));
 

router.post("/charge", function(req, res) {
 
    let amount = 5*100; // 500 cents means $5 
 
    // create a customer 
    stripe.customers.create({
        email: req.body.stripeEmail, // customer email, which user need to enter while making payment
        source: req.body.stripeToken // token for the given card 
    })
    .then(customer =>
        stripe.charges.create({ // charge the customer
        amount,
        description: "Sample Charge",
            currency: "usd",
            customer: customer.id
        }))
    .then(charge => res.render("payment/charge")); 
 
});
module.exports = router;
 