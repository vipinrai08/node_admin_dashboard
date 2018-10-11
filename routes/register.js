const express = require('express');
const router = express.Router();



//Register
router.get('/', (req, res) => {
  res.render('examples/register', {
   title: 'Register',
   layout: false
  });
});


module.exports = router;