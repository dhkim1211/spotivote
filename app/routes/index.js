var express = require('express');
var router = express.Router();
var User = require('../models/user');

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId : 'f0b91b941abc45beb58d907a1dc4517f',
    clientSecret : 'dd64d7d93409421484d807c5ffc17678',
    redirectUri : 'http://localhost:3000/callback'
});

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

router.get('/profile', isAuthenticated, function(req, res, next) {
    // User.findOne({_id: req.user._id}, function(err, user) {
    //     if (err) return err;
    //     res.send(user);
    // });
    var spotifyApi = new SpotifyWebApi({
        accessToken: req.user.accessToken
    });

    spotifyApi.getUser(req.user.username)
        .then(function(data) {
            // Get playlists
            spotifyApi.getUserPlaylists(req.params.id)
                .then(function(playlists) {
                    var profile = {'user': data.body, 'playlists': playlists.body};
                    console.log('profile', profile)
                    console.log('playlists', profile.playlists.items[0].images)
                    res.send(profile);
                },function(err) {
                    console.log('Something went wrong!', err);
                });
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

router.post('/search', isAuthenticated, function(req, res) {
    var spotifyApi = new SpotifyWebApi({
        accessToken: req.user.accessToken
    });

    var query = '';

    if (req.body.artist)
        query = query + 'artist:' + req.body.artist + ' ';
    if (req.body.album)
        query = query + 'album:' + req.body.album + ' ';
    if (req.body.track)
        query = query + 'track:' + req.body.track;

    // Search tracks whose artist's name contains 'Kendrick Lamar', and track name contains 'Alright'
    spotifyApi.searchTracks(query)
        .then(function(data) {
            res.send(data);
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

module.exports = router;
