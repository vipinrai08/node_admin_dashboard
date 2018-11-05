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
    .select("name email contactnumber city address zipcode cardname cardnumber expmonth expyear cvv")
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
    req.checkBody('cardname', 'Cardname is required').notEmpty();
    req.checkBody('cardnumber', 'Cardnumber is required').notEmpty();
    req.checkBody('expmonth', 'Expmonth is required').notEmpty();
    req.checkBody('expyear', 'Expyear is required').notEmpty();
    req.checkBody('cvv', 'Cvv is required').notEmpty();

    var errors = req.validationErrors();
    console.log(errors)
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
            zipcode: req.body.zipcode,
            cardname: req.body.cardname,
            cardnumber: req.body.cardnumber,
            expmonth: req.body.expmonth,
            expyear: req.body.expyear,
            cvv: req.body.cvv
        });
    
        invoice
        .save()
        .then(result => {
            console.log(result);
            res.redirect('/invoices'),
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
            zipcode: req.body.zipcode,
            cardname: req.body.cardname,
            cardnumber: req.body.cardnumber,
            expmonth: req.body.expmonth,
            expyear: req.body.expyear,
            cvv: req.body.cvv
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
