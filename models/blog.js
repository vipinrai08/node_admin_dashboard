const mongoose = require('mongoose');
BlogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

 title: {
      type: String
  },
  description: {
      type: String
  }
  
});
module.exports = mongoose.model('Blog', BlogSchema);
