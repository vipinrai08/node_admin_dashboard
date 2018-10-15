var mongoose = require('mongoose');
userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullname: {
		type: String,
	},
    displayname:{
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])+/
    },
    username: {
        type: String
    },
    password:{
        type: String,
        required: true
    },
});
module.exports = mongoose.model('User', userSchema);
