const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('forms/general', {
     title: 'General'
    });
});


  module.exports = router;