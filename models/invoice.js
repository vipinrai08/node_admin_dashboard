var mongoose = require('mongoose');
invoiceSchema = mongoose.Schema({
    billingadresss : {
        name: {
            type : String
        },
        email: {
            type: String
        },
        contactnumber: {
            type: Number
        },
        city: {
            type: String
        },
        address : {
            type: String
        },
        zipcode: {
            type: Number
        }
    },

});
module.exports = mongoose.model('Invoice', invoiceSchema);