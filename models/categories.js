var mongoose = require('mongoose');
categoriesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

 name: {
      type: String,
      required: true
  },
});
module.exports = mongoose.model('Categories', categoriesSchema);