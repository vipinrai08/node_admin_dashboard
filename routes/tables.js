const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('tables/simple', {
     title: 'Simple'
    });
});

router.get('/', (req, res) => {
    res.render('tables/data-tables', {
     title: 'Data Tables',
     layout: false
    });
});

  module.exports = router;