const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })



const User = require('../models/user');
const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte');// const ObjectId = require('mongodb').ObjectId
const { isEmpty } = require('lodash');
const Validator = require('is_js');


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
    .select("name age email photo")
    .exec()
    .then(users => {
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

router.post('/add',upload.single('photo'), (req, res)=>{
    if (req.file) {
        console.log("hello")
        console.log('Uploaded: ', req.file)
    }
   

    let { isValid, errors} = validator(req.body);
    console.log(isValid, errors)
   
	if (!isValid) {
      
		res.render('users/add', {
            err: errors,
            user: { name: req.body.name, age: req.body.age, email: req.body.email}
        });
    } else{
        console.log(req.files, 'files');
        var user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
        
           
        });
    
       user
        .save()
        .then(result => {
           console.log(result);
          res.redirect('/users'),
           req.flash('message','Users Created');
        })
           .catch(err =>{
               console.log(err);
               res.redirect('/users/add')
           });
        
        }
    
    });

    router.post('/upload', function(req, res) {
            if(error){
               res.redirect('/?msg=3');
            }else{
              if(req.file == undefined){
                
                res.redirect('/?msg=2');
      
              }else{
                   
                  /**
                   * Create new record in mongoDB
                   */
                  var fullPath = "files/"+req.file.filename;
      
                  var document = {
                    path:     fullPath, 
                    caption:   req.body.caption
                  };
        
                var photo = new Photo(document); 
                photo.save(function(error){
                  if(error){ 
                    throw error;
                  } 
                  res.redirect('/?msg=1');
               });
            }
          }
        });    
      
        router.get('/edit/:id', async (req, res)=>{
            const users = await getUser(req.params.id);
            res.render('products/edit',{
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
    let { isValid, errors} = validator(req.body);
    console.log(isValid, errors)
    
	if (!isValid) {
    
		res.render('users/edit', {
            err: errors,
            user: { name: req.body.name, age: req.body.age, email: req.body.email, userImage: req.file.path}
        });
    } else{
   User.update({_id: req.params.id},
        { $set:{ 
            name: req.body.name, 
            age:req.body.age, 
            email: req.body.email,
            userImage: req.body.userImage
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
}
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

function validator(data) {
    let errors = {};

    if(Validator.empty(data.name)) {
        errors.name = "Name is required!"
    }
    if(Validator.empty(data.age)) {
        errors.age = "Age is required!"
    }

    if(Validator.not.empty(data.age) && !parseInt(data.age)) {
        errors.age = "Age should be in numeric form!"
    }



    if(Validator.empty(data.email)) {
        errors.email = "Email is required!  "
    }

    if(data.email && !Validator.email(data.email)) {
        errors.email = "Email does not appear valid!"
    }

    return {
        isValid: isEmpty(errors),
        errors
    }
}
 
module.exports = router;
