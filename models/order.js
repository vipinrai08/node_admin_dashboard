var mongoose = require('mongoose');
orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

 categories: {
     type: String,
     Electronics: [
         {mobile: String,
        Tv: String,
    WashingMachine: String}
     ],
     Men:[
         {shirt: String,
            jeans: String
        }
     ],
      
  }
});
module.exports = mongoose.model('Order', orderSchema);