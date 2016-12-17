var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var mongoose = require('mongoose');
//connect to db
mongoose.connect('mongodb://localhost:27017/spotivote');

var session = require('express-session');
var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy;

app.use(session({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// init passport
var initPassport = require('./passport/init');
initPassport(passport);

var index = require('./routes/index');
var auth = require('./routes/auth');

//TODO delete
// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', auth);
app.use('/', index);

app.get('/auth/*', function(req, res) {
    res.render('index');
})
// send angular page for * to enable html5mode (routing through angular)
app.get('/*', function(req, res) {
  console.log('hit get /*/')
  res.sendfile('./public/index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
