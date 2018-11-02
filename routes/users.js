const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
 const Joi = require('joi')
 mongoose.connect('mongodb://localhost:27017/adminlte');
var ObjectId = require('mongodb').ObjectId


// router.get('/users', (req, res) => {
//     res.render('users', {title: 'users'});
// });
function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/Auth/login');
}

router.get('/',ensureAuthenticated,(req, res) =>{
   User.find()
    .select("name age email")
    .exec()
    .then(users => { console.log(users) 
        res.render('users/list', { users })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
 })

router.get('/add', (req, res)=>{
    res.render('users/add',{
        title: 'Add'
    })
})

router.post('/add', (req, res)=>{
    
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('age', 'Age is required').isNumeric();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();
    var errors = req.validationErrors();
    console.log(errors)
    if(errors){
       res.redirect('/users/add');
    }
    else{
    var user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    
    });
    
       user
        .save()
        .then(result => {
           console.log(result);
          res.redirect('/users'),
           req.flash('Users Created');
        })
           .catch(err =>{
               console.log(err);
               res.redirect('/users/add')
           });
        
        }
    });

router.get('/edit/:id', async (req, res)=>{
    const users = await getUser(req.params.id);
    res.render('users/edit',{
        title: 'Edit',
        users
    })
});

async function getUser(id) {
    try{
        const user = await User.findOne({ _id: id }).exec();
        return user;
    } catch(err) {
        throw err;
    }
}

router.put('/edit/:id', (req, res)=>{
   User.update({_id: req.params.id},
        { $set:{ 
            name: req.body.name, 
            age:req.body.age, 
            email: req.body.email
        }
    })
    .exec()
    .then(res => {
        res.redirect('/users');
        req.flash('User Updated');
    })
    .catch(err => {
        res.redirect('/users');
    })
})


router.get('/delete/:id', (req,res)=>{
    User.remove({ _id: req.params.id})
    .exec()
    .then(result => {
        res.redirect('/users')
    })
    .catch(err => {
        console.log(err);
        res.redirect('users/list')
    });
})
 
module.exports = router;
