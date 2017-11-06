const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const routes = require('./routes/index');
const session = require('express-session');
// stores login info on mongo
const MongoStore = require('connect-mongo')(session);



//mongoDB connection
mongoose.connect("mongodb://localhost:27017/KevBooks");
const db = mongoose.connection;
//mongo error
db.on('error',console.error.bind(console, 'connection error:'))

//use sessions for tracking logins
app.use(session({
		secret: 'whatever you want to say',
		resave: true,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection:db
		})
	}));
// make userId available in templates
app.use(function (req, res, next){
	// response object has a locals variable allowing you to store data
	// in Express all Views have access to the res.locals object
	//currentUser is a property / var created to store userId
	res.locals.currentUser = req.session.userId;
	next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
