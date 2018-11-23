const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = require('../models/blog');
mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte');

const { isEmpty } = require('lodash');
const Validator = require('is_js');
// router.get('/blogs', (req, res) => {
//     res.render('blogs', {title: 'blogs'});
// });

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/Auth/login');
}
router.get('/', ensureAuthenticated,(req, res) =>{
    Blog.find()
     .select("title description")
     .exec()
     .then(blogs=> {
         console.log(blogs, 'blogs')
         res.render('blogs/list', { blogs})
     })
     .catch(blogs=> {
         console.log(err);
         res.status(500).json({
             error: err
         });
     });
})

router.get('/add', (req, res)=> {
    res.render('blogs/add',{
        title:'Add'
    })
})

router.post('/add', (req, res)=>{
    let {isValid, errors} = validator(req.body);
    console.log(isValid, errors)

    if(!isValid) {
        res.render('blogs/add', {
            err: errors,
            blog: { title: req.body.title, description: req.body.description}
        });
    } else {
           var blog = new Blog({
               _id: new mongoose.Types.ObjectId(),
               title: req.body.title,
               description: req.body.description
           });
            blog
             .save()
              .then(result =>{
                console.log(result);
                res.redirect('/blogs'),
                 req.flash('message', 'Blog posted');
           })
              .catch(err=> {
                  console.log(err)
                  res.redirect('/blogs/add')
              });
    }
});
       router.get('/edit/:id' , async (req, res)=>{
           const blogs = await getBlog(req.params.id);
           res.render('blogs/edit', {
               title:'Edit',
               blogs
           })
       });

       async function getBlog(id) {
           try{
               const blog = await Blog.findOne({ _id: id}).exec();
               return blog;
           } catch(err) {
               throw err;
           }
       }
       
    
       router.put('/edit/:id', (req, res)=>{
        let { isValid, errors} = validator(req.body);
        console.log(isValid, errors)
        
        if (!isValid) {
        
            res.render('blogs/edit', {
                err: errors,
                blog: {title: req.body.title, description: req.body.description}
            });
        } else{
       Blog.update({_id: req.params.id},
            { $set:{ 
                title: req.body.title,
                description: req.body.description
                
            }
        })
        .exec()
        .then(res => {
            res.redirect('/blogs');
            req.flash('User Updated');
        })
        .catch(err => {
            res.redirect('/blogs');
        })
    }
    })
    

router.get('/delete/:id', (req, res)=> {
    Blog.remove({ _id: req.params.id})
    .exec()
    .then(result => {
        res.redirect('/blogs');
    })
    .catch(err=> {
        console.log(err);
        res.redirect('blogs/list')
    });
});


function validator(data) {
    let errors = {};

    if(Validator.empty(data.title)) {
        errors.title = "Title is required!"
    }
    if(Validator.empty(data.description)) {
        errors.description = "Description is required!"
    }

    return {
        isValid: isEmpty(errors),
        errors
    }
}


module.exports = router;