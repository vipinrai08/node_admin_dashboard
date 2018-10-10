const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('usercrud/edit', {
     title: 'Edit'
    });
});




  module.exports = router;