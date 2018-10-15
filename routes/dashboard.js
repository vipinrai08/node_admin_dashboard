
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('dashboard', {title: 'Dashboard'});
});
router.post('/',(req, res) =>{
    res.render('dashboard', {
         title: 'Dashboard',
    });
});

// router.get('/', (req, res) => {
//     res.render('dashboard/v1', {title: 'V1'});
// });

// router.get('/', (req, res) => {
//     res.render('dashboard/v2', {title:'V2'});
// });

module.exports = router;