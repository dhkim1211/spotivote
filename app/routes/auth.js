var express = require('express');
var router = express.Router();
var passport = require('passport');

// module.exports = function(passport) {
//
//     router.get('/spotify', passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-modify-private', 'user-top-read', 'playlist-read-private'], showDialog: true}),
//         function(req, res){
//         });
//
//     router.get('/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/login' , successRedirect: '/'}),
//         function(req, res) {
//             // res.redirect('/profile/' + req.user.id);
//             // res.redirect('/');
//         });
//     return router;
// }

router.get('/spotify', passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-modify-private', 'user-top-read', 'playlist-read-private'], showDialog: true}),
    function(req, res){
    });

router.get('/spotify/callback/', passport.authenticate('spotify', { failureRedirect: '/login' , successRedirect: '/me'}),
    function(req, res) {
        // res.redirect('/profile/' + req.user.id);
        // res.redirect('/');
    });

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;