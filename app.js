var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost:27017/jsonwebtoken';

var routes = require('./routes/index');
var users = require('./routes/users');

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
// logging connections depending on the status of the connections
mongoose.connection.on('connected', function(){
  console.log('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error', function(err){ // err gives you access to parameters made available by the on method
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function(){
  console.log('Mongoose default connection disconnected');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/secret/*', expressJwt({secret: 'supersecret'})); // supersecret is added on to our key

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') { // if there is an error named UnauthorizedError, then it will send a 401 error (invalid token)
    res.send(401, 'invalid token...');
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
