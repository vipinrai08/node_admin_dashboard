const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const filefilter = function(req, file, cb){
    //reject a file
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else{
        cb(null, false);
    }    
};

var upload = multer({ storage: storage,
     limits: {
     fileSize: 1024*1024*5
     },
   fileFilter: filefilter
});
    
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
        console.log(users,'users')
        res.render('users/list', { users })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    const photoFolder = __dirname + '/public/uploads/';
    fs.readdir(photoFolder, function(err, files){
        if(err){
            return console.log(err);
        }
        const filesArr = [];
        var i = 1;
        files.forEach(function(file){
            filesArr.push({ name: file});
            i++

        });
        res.json(filesArr);
    })
 })

router.get('/add', (req, res)=>{
    res.render('users/add',{
        title: 'Add'
    })
})

router.post('/add', upload.single('photo'), (req, res)=>{

    let { isValid, errors} = validator(req.body);
    console.log(isValid, errors)
   
	if (!isValid) {
      
		res.render('users/add', {
            err: errors,
            user: { name: req.body.name, age: req.body.age, email: req.body.email}
        });
    } else{
      user = fs.readFileSync(req.file.path)
      user.contentType = "photo/png";
        console.log(req.file, 'files');
        
        var user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            photo: req.file.path
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
    let { isValid, errors} = validator(req.body);
    console.log(isValid, errors)
    
	if (!isValid) {
    
		res.render('users/edit', {
            err: errors,
            user: { name: req.body.name, age: req.body.age, email: req.body.email}
        });
    } else{
   User.update({_id: req.params.id},
        { $set:{ 
            name: req.body.name, 
            age:req.body.age, 
            email: req.body.email,
            
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
