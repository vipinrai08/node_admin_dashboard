const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('lockscreen', {
     title: 'lockscreen',
     layout: false
    });
});

  module.exports = router;