var mongoose = require('mongoose');
usercrudSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

 name: {
      type: String
  },
  email: {
      type: String
  },
  age:{
      type: String
  },
  photo: {
      type: String
  }
  
});
module.exports = mongoose.model('UserCrud', usercrudSchema);