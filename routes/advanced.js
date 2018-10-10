const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('forms/advanced', {
     title: 'Advanced',
     layout: false
    });
});

  module.exports = router;