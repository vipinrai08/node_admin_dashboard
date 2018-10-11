const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

router.get('/New', (req, res) => {
    res.render('usercrud/New', {
     title: 'New'
    });
});
 router.post('/New', function(req,res,next){
     var user = new User({
        _id: new mongoose.Types.ObjectId(),
        displayname: req.body.displayname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    user.save()
        .then((user) => {
            console.log(user);
            res.status(200).redirect('/list');
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect('/usercrud/New');
        });
   
     }); 

router.get('/show', (req, res) => {
    res.render('usercrud/show', {
     title: 'Show'
    });
});

router.get('/list', (req, res) => {
    res.render('usercrud/list', {
     title: 'List'
    });
});
router.get('/list', function(req,res,next){
    user.find()
    .select("_id username displayname emails")
    .exec()
    .then(docs => {
        var response = {
            count: docs.lenght,
            users: docs.map(doc =>{
                return{
                   _id: doc._id,
                   username: doc.username,
                   displayname: doc.username,
                   emails: doc.emails
                }
            })
        }
        console.log(response);
        res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    });

router.get('/edit', (req, res) => {
    res.render('usercrud/edit', {
     title: 'Edit'
    });
});
 router.put('/edit', function(req,res,next){
     var username = req.body.params.username;
     user.update({username: username}, { $set:{ displayname: req.body.newdisplayName}})
     .exec()
     .then(result => {
         console.log(result);
         res.status(200).json({
             message: 'Usercreated'
         })
         .catch(err => {
             res.status(500).json({
                 error: err
             });
         });
     });
 });

  module.exports = router;