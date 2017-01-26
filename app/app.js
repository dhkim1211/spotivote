var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

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

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', auth);
app.use('/', index);

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

// Cron job to check for expiring access tokens
var User = require('./models/user');

var CronJob = require('cron').CronJob;

var job = new CronJob('00 * * * * 0-6', function() {

    var now = new Date();
    var updateBefore = now.setMinutes(now.getMinutes() - 0);
    var updateAfter = now.setMinutes(now.getMinutes() - 200);

    var twentyMinAgo = new Date(updateBefore).toISOString();
    var hourAgo = new Date(updateAfter).toISOString();

    var hour = now.setMinutes(now.getMinutes() - 50);
    var hourOneMin = now.setMinutes(now.getMinutes() - 100);
    var oneHourAgo = new Date(hour).toISOString();
    var hourFiveMin = new Date(hourOneMin).toISOString();

    var encodeThis = 'f0b91b941abc45beb58d907a1dc4517f:dd64d7d93409421484d807c5ffc17678';
    var buffer = new Buffer(encodeThis);
    var toBase64 = buffer.toString('base64');

    User.find({
        updatedAt: {$gt: [hourAgo], $lt: [twentyMinAgo]}
    }, function(err, users) {
        console.log('users!!', users);
        users.forEach(function(user) {
            console.log('user', user);
            console.log('successAt', now);
            request({
                url: 'https://accounts.spotify.com/api/token',
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + toBase64
                },
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: user.refreshToken
                }
            }, function(err, response, body) {
                if (err) throw err;
                console.log('body', body);

                User.findOneAndUpdate({ username: user.username}, {
                    $set: {
                        accessToken: body.access_token,
                        refreshToken: body.refresh_token
                    }
                });
            })
      })
    })

    }, function () {
        console.log('Access tokens updated!');
      /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    'America/Los_Angeles' /* Time zone of this job. */
);

job.start();

console.log('job status', job.running);

module.exports = app;
