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
  photo:
    { 
        type: String 
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
  
});
module.exports = mongoose.model('UserCrud', usercrudSchema);