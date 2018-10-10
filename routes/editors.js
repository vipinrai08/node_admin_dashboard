const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('forms/editors', {
     title: 'Editors',
     layout: false
    });
});

  module.exports = router;