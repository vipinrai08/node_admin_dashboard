const express = require('express');
const router = express.Router();
const Categories = require('../models/categories');
const mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost:27017/adminlte');
var ObjectId = require('mongodb').ObjectId

// router.get('/categories', (req, res) => {
//     res.render('categories', {title: 'categories'});
// });

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/Auth/login');
}
router.get('/',ensureAuthenticated,(req, res) =>{
   Categories.find()
    .select("name")
    .exec()
    .then(categories => { console.log(categories) 
        res.render('categories/list', { categories })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
 })

router.get('/add', (req, res)=>{
    res.render('categories/add',{
        title: 'Add'
    })
})
router.post('/add', (req, res)=>{
    req.checkBody('name', 'Name is required').notEmpty();
    
    var errors = req.validationErrors();
    console.log(errors)
    if(errors){
       res.redirect('/categories/add');
    }
 else
{
    var categories = new Categories({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
    });
       categories
        .save()
        .then(result => {
           console.log(result);
          res.redirect('/categories'),
           req.flash('Categories Created');
        })
           .catch(err =>{
               console.log(err);
               res.redirect('/categories/add')
           });
        }
        
})

router.get('/edit/:id', async (req, res)=>{
    const categories = await getCategories(req.params.id);
    res.render('categories/edit',{
        title: 'Edit',
        categories
    })
});

async function getCategories(id) {
    try{
        const categories = await Categories.findOne({ _id: id }).exec();
        return categories;
    } catch(err) {
        throw err;
    }
}

router.put('/edit/:id', (req, res)=>{
    Categories.update({_id: req.params.id},
        { $set:{ 
            name: req.body.name,
             
        }
    })
    .exec()
    .then(res => {
        res.redirect('/categories');
        req.flash('Categories Updated');
    })
    .catch(err => {
        res.redirect('/categories');
    })
})


router.get('/delete/:id', (req,res)=>{
   Categories.remove({ _id: req.params.id})
    .exec()
    .then(result => {
        res.redirect('/categories')
    })
    .catch(err => {
        console.log(err);
        res.redirect('categories/list')
    });
})
 
module.exports = router;
