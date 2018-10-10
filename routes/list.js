const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('usercrud/list', {
     title: 'List'
    });
});




  module.exports = router;