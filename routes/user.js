const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId

router.get('/user', (req, res) => {
    res.render('user', {title: 'user'});
});

router.get('/list',(req, res) =>{
    User
    .find()
    .select("name age email")
    .then(user => {
        res.render('user/list')
    })
//     .exec()
//     .then(user => {
//         var response = {
//             count: user.lenght,
//            user: user.map(doc =>{
//                 return{
//                     name: user.name,
//                     age: user.age,
//                     email: user.email,
//                 }
 
//             })
//         }
//         res.render('user/list')
//     })
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
          res.redirect('/user/list')
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
    var o_id = new ObjectId(req.params.id)
   User.update( {"_id": o_id},{ $set:{ name: req.body.newName, age:req.body.newAge, email: req.body}})
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
           res.redirect('/user/list')
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
