const mongoose = require('mongoose');
blogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

 title: {
      type: String
  },
  description: {
      type: String
  }
  
});
module.exports = mongoose.model('Blog', blogSchema);
