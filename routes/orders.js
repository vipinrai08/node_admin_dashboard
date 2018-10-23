const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mongoose = require('mongoose');
 mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte');
var ObjectId = require('mongodb').ObjectId

// router.get('/orders', (req, res) => {
//     res.render('orders', {title: 'orders'});
// });
function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/Auth/login');
}
router.get('/',ensureAuthenticated,(req, res) =>{
   Order.find()
    .select(" categories name price date")
    .exec()
    .then(orders => { console.log(orders) 
        res.render('orders/list', { orders })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
 })

router.get('/add', (req, res)=>{
    res.render('orders/add',{
        title: 'Add'
    })
})
module.exports = router;