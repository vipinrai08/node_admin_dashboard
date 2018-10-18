var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');
var methodOverride = require('method-override')
var User = require('./models/users');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://1vipin:Vipin1234@ds135433.mlab.com:35433/adminlte',{ useNewUrlParser: true });
var db = mongoose.connection;
// Init App
var app = express();

// view engine setup
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use( express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());


app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

//express session
app.use(
	expressSession({
		secret: 'secret',
		saveUninitialized: false,
		resave: true
	})
);
app.use(function(req, res, next) {
	if (!req.session) {
		res.redirect('/login');
	}
	next();
});

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(
	expressValidator({
		errorFormatter: function(param, msg, value) {
			var namespace = param.split('.'),
				root = namespace.shift(),
				formParam = root;

			while (namespace.length) {
				formParam += '[' + namespace.shift() + ']';
			}
			return {
				param: formParam,
				msg: msg,
				value: value
			};
		}
	})
);

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});


app.post('/register', function(req, res) {
	console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();

	var newUser = {
		name: name,
		email: email,
		username: username,
		password: password,
	};
	User.create(newUser, function(err, user) {
		if (err) throw err;
		console.log(user);
	});
	req.flash('success_msg', 'You are registered and can now login');
	res.redirect('/users/login');
});

/*
    Website routes
*/
// var login = require('./routes/login');
var profile = require('./routes/profile');
var lockscreen = require('./routes/lockscreen');
// var register = require('./routes/register');
var dashboard = require('./routes/dashboard');
var users =require('./routes/users');
var Auth = require('./routes/Auth');
var products = require('./routes/products');
var categories = require('./routes/categories');

// app.use('/login', login);
// app.use('/register', register);
app.use('/dashboard',dashboard);
app.use('/profile', profile);
app.use('/lockscreen', lockscreen);
app.use('/users', users);
app.use('/Auth', Auth);
app.use('/products', products);
app.use('/categories', categories);


app.get('/', function(req,res){
  res.render('Auth/login', {
	  layout : false
  });
});


// Set Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
	console.log('Server started on port ' + app.get('port'));
});
