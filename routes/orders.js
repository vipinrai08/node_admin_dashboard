const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/adminlte');
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
    .select(" products categories price name email contactnumber address date")
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

router.post('/add', (req, res)=>{
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('categories', 'Categories is required').notEmpty();
    req.checkBody('price', 'Price is required').isNumeric();
    req.checkBody('date', 'Date is required').notEmpty();
 
    var errors = req.validationErrors();
    if(errors){
       res.redirect('/order/add');
    } else
    {
    var order = new Order({
        _id: new mongoose.Types.ObjectId(),
        products: req.body.products,
        categories: req.body.categories,
        price: req.body.price,
        name: req.body.name,
        email: req.body.email,
        contactnumber: req.body.contactnumber,
        address: req.body.address, 
        date: req.body.date
    });
       order
        .save()
        .then(result => {
           console.log(result);
          res.redirect('/orders'),
           req.flash('Orders Created');
        })
           .catch(err =>{
               console.log(err);
               res.redirect('/orders/add')
           });
        }  
})

router.get('/edit/:id', async (req, res)=>{
    const orders = await getOrder(req.params.id);
    res.render('orders/edit',{
        title: 'Edit',
        orders
    })
});

async function getOrder(id) {
    try{
        const order = await Order.findOne({ _id: id }).exec();
        return order;
    } catch(err) {
        throw err;
    }
}

router.put('/edit/:id', (req, res)=>{
   Order.update({_id: req.params.id},
        { $set:{ 
            products: req.body.products,
            categories: req.body.categories,
            price: req.body.price,
            name: req.body.name,
            email: req.body.email,
            contactnumber: req.body.contactnumber,
            address: req.body.address, 
            date: req.body.date
            
        }
    })
    .exec()
    .then(res => {
        res.redirect('/orders');
        req.flash('Order Updated');
    })
    .catch(err => {
        res.redirect('/orders');
    })
})


router.get('/delete/:id', (req,res)=>{
    Order.remove({ _id: req.params.id})
    .exec()
    .then(result => {
        res.redirect('/orders')
    })
    .catch(err => {
        console.log(err);
        res.redirect('order/list')
    });
})
module.exports = router;