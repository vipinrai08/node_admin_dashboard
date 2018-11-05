const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/adminlte');
var ObjectId = require('mongodb').ObjectId



function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/Auth/login');
}
router.get('/', ensureAuthenticated, (req, res) => {
    Invoice.find()
    .select("name email contactnumber city address zipcode")
    .exec()
    .then(invoices => {console.log(invoices)
    res.render('invoices/list', {invoices})
})
.catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
  });
})

router.get('/add', (req, res) => {
    res.render('invoices/add', {
        title: 'Add'
    })
})

router.post('/add', (req, res) => {
     
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();
    req.checkBody('contactnumber', 'Contactnumber is required').isNumeric();
    req.checkBody('city', 'City is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('zipcode','Zipcode is required').notEmpty();

    var errors = req.validationErrors();
    if(errors) {
        res.redirect('/invoices/add');
    }
    else{
        var invoice = new Invoice({
            _id: new mongoose.Types.ObjectId(),
            name : req.body.name,
            email: req.body.email,
            contactnumber: req.body.contactnumber,
            city: req.body.city,
            address: req.body.address,
            zipcode: req.body.zipcode
        });
    
        invoice
        .save()
        .then(result => {
            console.log(result);
            res.redirect('/payment'),
            req.flash('Invoice created');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/invoices/add')
        });
    }
});



router.get('/edit/:id', async (req, res)=>{
    const invoices = await getInvoice(req.params.id);
    res.render('invoices/edit',{
        title: 'Edit',
        invoices
    })
});

async function getInvoice(id) {
    try{
        const invoice = await Invoice.findOne({ _id: id }).exec();
        return invoice;
    } catch(err) {
        throw err;
    }
}

router.put('/edit/:id', (req, res)=>{
   Invoice.update({_id: req.params.id},
        { $set:{ 
            name : req.body.name,
            email: req.body.email,
            contactnumber: req.body.contactnumber,
            city: req.body.city,
            address: req.body.address,
            zipcode: req.body.zipcode
        }
    })
    .exec()
    .then(res => {
        res.redirect('/invoices');
        req.flash('Invoice Updated');
    })
    .catch(err => {
        res.redirect('/invoices');
    })
})


router.get('/delete/:id', (req,res)=>{
    Invoice.remove({ _id: req.params.id})
    .exec()
    .then(result => {
        res.redirect('/invoices')
    })
    .catch(err => {
        console.log(err);
        res.redirect('invoices/list')
    });
})
 
module.exports = router;
