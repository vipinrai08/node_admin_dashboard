const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('examples/profile', {
     title: 'Profile'
    });
});


  module.exports = router;