var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');
var methodOverride = require('method-override')
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds135433.mlab.com:35433/adminlte');
var db = mongoose.connection;

// Init App
var app = express();

// view engine setup
app.engine('.hbs', exphbs({
	defaultLayout: 'layout', 
	extname: '.hbs',
	helpers:{
		// Function to do basic mathematical operation in handlebar
		math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
			rvalue = parseFloat(rvalue);
			return {
				"+": lvalue + rvalue,
				"-": lvalue - rvalue,
				"*": lvalue * rvalue,
				"/": lvalue / rvalue,
				"%": lvalue % rvalue
			}[operator];
		}
	}
}));



app.use(  express.static('./public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.use( express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// BodyParser Middleware
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true, parameterLimit: 1000000}))
app.use(expressValidator());
app.use(cookieParser());
app.use(morgan('dev'));

// app.use(multer({
//     dest: './public/img/portfolio/'
// }));

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
		//key: 'user_sid',
        secret: 'somerandonstuffs',
        resave: false,
        saveUninitialized: false,
        //cookie: {
        //expires: 600000
    //}
	})
);
// app.use((req, res, next) => {
//     if (req.cookies.user_sid && !req.session.user) {
//         res.clearCookie('user_username');        
//     }
//     next();
// });


app.use(function(req, res, next) {
	if (!req.session) {
		res.redirect('Auth/login');
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

app.locals.moment = require('moment');
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});



//Website routes
var profile = require('./routes/profile');
var dashboard = require('./routes/dashboard');
var users =require('./routes/users');
var Auth = require('./routes/Auth');
var products = require('./routes/products');
var categories = require('./routes/categories');
var orders = require('./routes/orders');
var contact = require('./routes/contact');
var invoices = require('./routes/invoices');
var payment = require('./routes/payment');
var signout = require('./routes/signout');
var teams = require('./routes/teams');
var blogs = require('./routes/blogs');
var services = require('./routes/services')
var projects = require('./routes/projects');


app.use('/dashboard',dashboard);
app.use('/profile', profile);
app.use('/users', users);
app.use('/Auth', Auth);
app.use('/products', products);
app.use('/categories', categories);
app.use('/orders', orders);
app.use('/contact', contact);
app.use('/invoices', invoices);
app.use('/payment', payment);
app.use('/signout', signout);
app.use('/teams', teams);
app.use('/blogs', blogs);
app.use('/services', services);
app.use('/projects', projects);





app.get('/', function(req, res) {
	if (req.isAuthenticated()){
		res.redirect('/dashboard');
	}
	 else {
	res.render('Auth/login',{
		layout: false
	});
}
});

app.get('/', function(req,res){
  res.render('Auth/login', {
	  layout : false
  });
});

app.get(['/dashboard', '/orders', '/products',
 '/users', '/invoices', '/contact', '/payment', '/signout','services', 'teams', 'projects', 'blogs'],
  function (req, res) {
	res.send('');
  });
  
  app.use(function(req, res) {
	res.status(400);
   res.render('404.hbs', {
	   title: '404: File Not Found',
	   layout: false
	});
});

  
// Set Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
	console.log('Server started on port ' + app.get('port'));
});
