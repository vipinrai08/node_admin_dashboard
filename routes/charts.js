const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('charts/chart-js', {title:'chartjs'});
});

router.get('/', (req, res) => {
     res.render('charts/morris', {title:'Morris'});
});

router.get('/', (req, res) => {
    res.render('charts/flot', {title:'Flot'});
});

router.get('/', (req, res) => {
    res.render('charts/inline-charts', {title:'Inline Charts'});
});

module.exports = router;