var mongoose = require('mongoose');

var serviceSchema = new mongoose.Schema({
	title: {
		type: String
	},
	description: {
		type: String
	},
	services: [
		{
			title: String,
			description: String,
			icon: String
		}
	]
});
var Service = mongoose.model('Service', serviceSchema);

module.exports = Service;