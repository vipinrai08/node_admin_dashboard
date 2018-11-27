const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte');
var ObjectId = require('mongodb').ObjectId
const { isEmpty } = require('lodash');
const Validator = require('is_js');

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/Auth/login');
}

router.get('/',ensureAuthenticated,(req, res) =>{
   Invoice.find()
    .select("name email contactnumber city address zipcode")
    .exec()
    .then(invoices => {
        console.log(invoices,'invoices')
        res.render('invoices/list', { invoices })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});



router.get('/add', (req, res) => {
    res.render('invoices/add', {
        title: 'Add'
    })
})

router.post('/add', (req, res) => {
    let { isValid, errors} = validator(req.body);
    console.log(isValid, errors)
	   if (!isValid) {s
		res.render('invoices/add', {
            err: errors,
            invoice: { name: req.body.name, email: req.body.email, contactnumber: req.body.contactnumber,
                 city: req.body.city, address: req.body.address, zipcode: req.body.zipcode}
        });
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

// Validation function//
function validator(data) {
    let errors = {};
    
    if (Validator.empty(data.name)) {
        errors.name = "Name is required!"
    }

    if(Validator.empty(data.email)) {
        errors.email = "Email is required!  "
    }

    if(data.email && !Validator.email(data.email)) {
        errors.email = "Email does not appear valid!"
    }

    if(Validator.empty(data.contactnumber)){
        errors.contactnumber = "Contact number is required!"
    }
    
    if(data.contactnumber && !parseInt(data.contactnumber)) {
        errors.contactnumber = "Contact number should be in numeric form!"
    }

    if (Validator.empty(data.city)) {
        errors.city = "City is required!"
    }

    if (Validator.empty(data.address)) {
        errors.address = "Address is required!"
    }

    if(Validator.empty(data.zipcode) && !parseInt(data.zipcode)) {
        errors.zipcode = "Zipcode number should be in numeric form!"
    }

    return{
        isValid: isEmpty(errors),
        errors
    }
}
 
module.exports = router;
