var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte');

var Service = require('../models/service');
var Project= require('../models/project');
var Team = require('../models/team');
var Blog = require('../models/blog');


var about = new About({
    title: 'About Us',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.',
    image: 'about-part.jpg'
});
about.save(function (err){
    if (err) throw err;
    console.log('Data inserted.');
});

var service = new Service({
	title: 'Our Services',
	description: 'Pallamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
	services: [
		{
			title: 'Busisness Planning',
			description:
				'Lorem ipsum dolo dolor in in voluptate velit esse cillum dolore. epteur sint oat cupidatat',
			icon: 'service1.png'
		},
		{
			title: 'Busisness Consultency',
			description:
				'Lorem ipsum dolo dolor in in voluptate velit esse cillum dolore. epteur sint oat cupidatat.',
			icon: 'service2.png'
		},
		{
			title: 'Financial Services',
			description:
				'Lorem ipsum dolo dolor in in voluptate velit esse cillum dolore. epteur sint oat cupidatat.',
			icon: 'service3.png'
        },
        {
            title: 'Risk Management',
			description:
				'Lorem ipsum dolo dolor in in voluptate velit esse cillum dolore. epteur sint oat cupidatat.',
			icon: 'service4.png' 
        },
        {
            title: 'Expert Advisers',
			description:
				'Lorem ipsum dolo dolor in in voluptate velit esse cillum dolore. epteur sint oat cupidatat.',
			icon: 'service5.png'
        },
        {
            title: '24/7 Customer Support',
			description:
				'Lorem ipsum dolo dolor in in voluptate velit esse cillum dolore. epteur sint oat cupidatat.',
			icon: 'service6.png'
        }
	]
});

service.save(function(err) {
	if (err) throw err;
	console.log('Data inserted.');
});

var project = new Project({
    title: 'Our Finished Projects',
    description: 'Pallamco laboris nisi ut aliquip ex ea commodo consequat.',
    projects: [
		{
			image: 'project1.jpg',
            title: 'Aquisition Plan',
            description: 'Busisness Planning'
        },
        {
			image: 'project2.jpg',
            title: 'Aquisition Plan',
            description: 'Busisness Planning'
        },
        {
			image: 'project3.jpg',
            title: 'Aquisition Plan',
            description: 'Busisness Planning'
        },
        {
			image: 'project4.jpg',
            title: 'Aquisition Plan',
            description: 'Busisness Planning'
        },
        {
			image: 'project5.jpg',
            title: 'Aquisition Plan',
            description: 'Busisness Planning'
        },
    ]
});
project.save(function(err){
    if(err) throw err;
    console.log('Data inserted');
});

var team = new Team({
    title: 'Our Expert Team',
    description: 'Pallamco laboris nisi ut aliquip ex ea commodo consequat.',
    teams: [
		{
			image: 'team3.jpg',
			name: 'Alex Browne',
			designation: 'Directo, Management & Research',
        },
        {
			image: 'team2.jpg',
			name: 'Darren J.Stevens',
			designation:'Director, Finance Solution',
        },
        {
			image: 'team3.jpg',
			name:'Kevin Thomson',
			designation:'Head, Legal Advising'
        },
        {
			image: 'team.jpg',
			name:'Tom Hanks',
			designation:'Founder & CEO'
        }
    ],
    pricingtable:{
        title: 'Our Pricing Table',
        description: 'Pallamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    demo: [
		{
			title: 'Basic',
            price: '$99',
            Plan: 'Monthly',
			features: [
                '01 User',
				'01 Project',
				'01 Advisor Team',
                'Complete Statistics',
                'E-Mail Support '	
			]
        },
        {
            title: 'Standard',
            Plan: 'Monthly',
			price: '$299',
			features: [
                '05 User',
                '05 Project',
                '05 Advisor Team',
                'Complete Statistics',
                'Full Support'
				
			]
        },
        {
			title: 'Advanced',
            price: '$499',
            Plan: 'Monthly',
			features: [
                '10 User',
                '10 Project',
                '10 Advisor Team',
                'Complete Statistics',
                'Full Support'
				
			]
        },
        {
			title: 'Unlimited',
            price: '$1099',
            Plan: 'Monthly',
			features: [
                'Unlimited User',
                'Unlimited Project',
                'Unlimited Advisor Team',
                 'Complete Statistics',
                   'Full Support'	
			]
        },
    ],
    clients:[ 
        {
           title: 'What Our Client Say About Us',
           image: 'testimonial1.jpg',
           name: 'Kevin Watson',
           description: 'Lorem ipsum dolo dolor in in voluptate velit esse cillum dolore. epteur sint oat cupidatat',
           designation: 'CEO',
           company: 'Kingston'
        },
    ]
});
team.save(function(err){
    if(err) throw err;
    console.log('Data inserted.')
});

var blog = new Blog({
    title: 'Our Latest News',
    description: 'Pallamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    news: [
        {
            image:'bl1.jpg',
            description: 'The Pros And Cons Of Starting An Online Consulting Business',
            postedby:'Mick Steven',
            date:'On 12th June, 2017'

        },
        {
            image:'bl2.jpg',
            description: '8 Secrets For Your Busnisess Mentor Wont Tell You',
            postedby:'Mick Steven',
            date:'On 12th June, 2017'

        },
        {
            image:'bl3.jpg',
            description: 'Hire A Branding Consultant With Similar Aesthetic To Your Own',
            postedby:'Mick Steven',
            date:'On 12th June, 2017'

        }
    ]
});
blog.save(function(err){
    if(err) throw err;
    console.log('Data inserted');
});

var contact = new Contact({
    title: 'Contact Us',
    description: 'Pallamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    contactinfo:{
        address: '125, Park street avenue, Brocklyn, Newyork.',
        contactno: '+11253678958',
        icon: 'phone',
        email: 'info@mail.com',
        icon: 'envelope'
    }
});
contact.save(function(err){
    if(err) throw err;
    console.log('Data inserted');
    mongoose.disconnect();
});
