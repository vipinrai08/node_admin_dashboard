var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
	title: {
		type: String
	},
	description: {
		type: String
	},
	projects: [
		{
			image: String,
			title: String,
			description: String 
			
		}
	]
});
var Project = mongoose.model('Project', projectSchema);

module.exports = Project;