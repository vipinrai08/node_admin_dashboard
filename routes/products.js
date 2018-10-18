const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
 mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte');
var ObjectId = require('mongodb').ObjectId

router.get('/products', (req, res) => {
    res.render('products', {title: 'products'});
});

router.get('/',(req, res) =>{
   Product.find()
    .select("name categories price date")
    .exec()
    .then(products => { console.log(products) 
        res.render('products/list', { products })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
 })

router.get('/add', (req, res)=>{
    res.render('products/add',{
        title: 'Add'
    })
})
router.post('/add', (req, res)=>{
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        categories: req.body.categories,
        price: req.body.price,
        date: req.body.date
    });
       product
        .save()
        .then(result => {
           console.log(result);
          res.redirect('/products'),
           req.flash('Products Created');
        })
           .catch(err =>{
               console.log(err);
               res.redirect('/products/add')
           });
        
})

router.get('/edit/:id', async (req, res)=>{
    const products = await getProduct(req.params.id);
    res.render('products/edit',{
        title: 'Edit',
        products
    })
});

async function getProduct(id) {
    try{
        const product = await Product.findOne({ _id: id }).exec();
        return product;
    } catch(err) {
        throw err;
    }
}

router.put('/edit/:id', (req, res)=>{
   Product.update({_id: req.params.id},
        { $set:{ 
            name: req.body.name,
            categories: req.body.categories,
            price: req.body.price,
            date: req.body.date 
            
        }
    })
    .exec()
    .then(res => {
        res.redirect('/products');
        req.flash('Product Updated');
    })
    .catch(err => {
        res.redirect('/products');
    })
})


router.get('/delete/:id', (req,res)=>{
    Product.remove({ _id: req.params.id})
    .exec()
    .then(result => {
        res.redirect('/products')
    })
    .catch(err => {
        console.log(err);
        res.redirect('products/list')
    });
})
 
module.exports = router;
