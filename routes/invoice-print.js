const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('examples/invoice-print', {
     title: 'InvoicePrint'
    });
});

  module.exports = router;
