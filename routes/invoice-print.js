const express = require('express');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.render('examples/invoice', {
//      title: 'Invoice'
//     });
// });

router.get('/', (req, res) => {
    res.render('examples/invoice-print', {
     title: 'Invoice Print',
     layout: false
    });
});


  module.exports = router;