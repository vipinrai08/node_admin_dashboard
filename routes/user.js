const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

router.get('/user', (req, res) => {
    res.render('user', {title: 'user'});
});

router.get('/list',(req, res) =>{
    User.find()
    .exec()
    .then(docs => {
        var response = {
            count: docs.lenght,
           user: docs.map(doc =>{
                return{
                    name: doc.name,
                    age: doc.age,
                    email: doc.email,
                }
 
            })
        }
        res.render('user/list')
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.get('/add', (req, res)=>{
    res.render('user/add',{
        title: 'Add'
    })
})
router.post('/add', (req, res)=>{
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
           res.status(201).json({
            message: "Created user successfully",
            createduser: {
                name: result.nmae,
                age: result.age,
                email: result.email,
                _id: result._id,
            }
           });
        })
           .catch(err =>{
               console.log(err);
               res.status(500).json({
               error: err
               });
           });
})

router.get('/edit', (req, res)=>{
    res.render('user/edit',{
        title: 'Edit'
    })
})

router.put('/edit', (req, res)=>{
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
           res.status(201).json({
            message: "Updated user successfully",
            createduser: {
                name: result.nmae,
                age: result.age,
                email: result.email,
                _id: result._id,
            }
           });
        })
           .catch(err =>{
               console.log(err);
               res.status(500).json({
               error: err
               });
           });
})

router.post('/delete', (req,res)=>{
    User.remove({ _id: req.params.id})
    .exec()
    .then(result => {
        res.render('user/list')
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})
 

module.exports = router;
