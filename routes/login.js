const express = require('express');
const router = express.Router();


//Login
router.get('/', (req, res) => {
  res.render('examples/login', {
   title: 'Login',
   layout: false
  });
});


module.exports = router;