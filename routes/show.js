const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('usercrud/show', {
     title: 'Show'
    });
});




  module.exports = router;