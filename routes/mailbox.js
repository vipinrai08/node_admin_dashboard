const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('mailbox', {
     title: 'Mailbox'
    });
});


  module.exports = router;