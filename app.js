var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/AdminLTE');

// Init App
var app = express();

// view engine setup
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use( express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/*
    Bodyparser Middleware + Express session
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// session -> keep the user loggin after he login in on the website
//         -> creates an object req.session, where you can add properties
//         -> (ex: req.session.page_views, to count how many times he entered on the page)
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: true
}));
app.use(function(req, res, next) {
	if (!req.session) {
		res.redirect('/login');
	}
	next();
});
// Passport init
app.use(passport.initialize());
app.use(passport.session());


/*
     Validator to validate data incoming with the re object to the server
*/
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


/*
    Flash to pop-up mesages in the browser
*/
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


/*
    Website routes
*/
var login = require('./routes/login');
var profile = require('./routes/profile');
var lockscreen = require('./routes/lockscreen');
var register = require('./routes/register');
var dashboard = require('./routes/dashboard');
var calendar = require('./routes/calendar');
var charts = require('./routes/charts');
var invoice = require('./routes/invoice');
var invoiceprint = require('./routes/invoice-print')
var general = require('./routes/general');
var advanced = require('./routes/advanced');
var editors = require('./routes/editors');
var tables = require('./routes/tables');
var uielements = require('./routes/ui-elements');
var widgets = require('./routes/widgets');
var mailbox = require('./routes/mailbox');
var show  =require('./routes/show');
var list =require('./routes/list');
var edit =require('./routes/edit');
var New  =require('./routes/New');


app.use('/login', login);
app.use('/register', register);
app.use('/dashboard',dashboard);
app.use('/calendar', calendar);
app.use('/charts', charts);
app.use('/invoice', invoice);
app.use('/invoicePrint', invoiceprint);
app.use('/profile', profile);
app.use('/lockscreen', lockscreen);
app.use('/general', general);
app.use('/advanced',advanced);
app.use('/editors', editors);
app.use('/tables', tables);
app.use('/ui-elements', uielements);
app.use('/widgets', widgets);
app.use('/mailbox', mailbox);
app.use('/New', New);
app.use('/edit', edit);
app.use('/show', show);
app.use('/list', list);

app.get('/', function(req,res){
  res.render('dashboard');
});

// Set Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
	console.log('Server started on port ' + app.get('port'));
});
