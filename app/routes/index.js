var express = require('express');
var router = express.Router();
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isAuthenticated, function(req, res, next) {
  User.findOne({_id: req.user._id}, function(err, user) {
    if (err) return err;

    res.send(user);
  })
})

module.exports = router;
