const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('ui-elements/general', {
     title: 'General'
    });
});

router.get('/', (req, res) => {
    res.render('ui-elements/icons', {
     title: 'Icons',
     layout: false
    });
});

router.get('/', (req, res) => {
    res.render('ui-elements/buttons', {
     title: 'Buttons',
     layout: false
    });
});

router.get('/', (req, res) => {
    res.render('ui-elements/sliders', {
     title: 'Sliders',
     layout: false
    });
});

router.get('/', (req, res) => {
    res.render('ui-elements/timeline', {
     title: 'Timeline',
     layout: false
    });
});

router.get('/', (req, res) => {
    res.render('ui-elements/modals.hbs', {
     title: 'Modals',
     layout: false
    });
});

  module.exports = router;