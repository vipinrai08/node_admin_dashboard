var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
	title: {
		type: String
	},
	description: {
		type: String
	},
	teams: [
		{
			image: String,
			name: String,
			designation: String,
		}
    ],
   pricingtable: {
    title: {
		type: String
	},
	description: {
		type: String
	},
	demo: [
		{
			title: String,
			price: String,
			plan: String,
			features: Array
		},
    ]

   },
   clients:[ 
    {
		title: {
			type: String
		},
        image: {
            type: String
        },
        description: {
            type: String
        },
        name: {
            type: String
        },
        designation: {
            type: String,
            company: String
        }
    }
]
});

var Team = mongoose.model('Team', teamSchema);

module.exports = Team;
