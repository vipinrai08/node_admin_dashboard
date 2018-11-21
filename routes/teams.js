const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('teams', {
     title: 'teams'
    });
});


  module.exports = router;