const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('invoice', {
     title: 'Invoice'
    });
});

  module.exports = router;