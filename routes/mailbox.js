const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('mailbox/index', {
     title: 'Index'
    });
});
router.get('/', (req, res) => {
    res.render('mailbox/compose', {
     title: 'Compose'
    });
});
router.get('/', (req, res) => {
    res.render('mailbox/read-mail', {
     title: 'ReadMail'
    });
});

  module.exports = router;