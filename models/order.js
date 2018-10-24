var mongoose = require('mongoose');
orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    products: {
        type: String
    },
    categories:{
        type: String
    },
    price: {
        type: Number
    },
    date:{
        type: String
    },
     name:{
         type: String
     },
     email: {
         type: String
     },
     contactnumber:{
        type: Number
    },
     address: {
         type: String
     } 

});
module.exports = mongoose.model('Order', orderSchema);