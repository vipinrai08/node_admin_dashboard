const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('widgets/index', {title: 'Widgets'});
});

module.exports = router;