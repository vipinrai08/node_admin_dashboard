const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('projects', {
     title: 'projects'
    });
});


  module.exports = router;