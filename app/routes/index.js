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

    // Search tracks
    spotifyApi.searchTracks(query)
        .then(function(data) {
            res.send(data);
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

router.post('/playlist/create', isAuthenticated, function(req, res) {
    var spotifyApi = new SpotifyWebApi({
        accessToken: req.user.accessToken
    });

    // Create a private playlist
    spotifyApi.createPlaylist(req.user.username, req.body.playlistName, { 'public' : false })
        .then(function(data) {
            console.log('Created playlist!');
            res.send(data);
        }, function(err) {
            console.log('Something went wrong!', err);
        });

});

router.get('/playlist/:id', isAuthenticated, function(req, res) {
    var spotifyApi  = new SpotifyWebApi({
        accessToken: req.user.accessToken
    });

    // Get a playlist
    spotifyApi.getPlaylist(req.user.username, req.params.id)
        .then(function(data) {
            data.username = req.user.username;
            console.log('Some information about this playlist', data.body);
            res.send(data.body);
        }, function(err) {
            console.log('Something went wrong!', err);
        });
})

router.post('/playlist/:id', isAuthenticated, function(req, res) {
    var spotifyApi = new SpotifyWebApi({
        accessToken: req.user.accessToken
    });

    var trackToAdd = ['spotify:track:' + req.body.track];

    // Add tracks to a playlist
    spotifyApi.addTracksToPlaylist(req.user.username, req.params.id, trackToAdd)
        .then(function(data) {
            console.log('Added tracks to playlist!');
            res.send(data);
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

router.put('/playlist/:id', isAuthenticated, function(req, res) {
    var spotifyApi = new SpotifyWebApi({
        accessToken: req.user.accessToken
    });

    // Reorder the first two tracks in a playlist to the place before the track at the 10th position
    var options = { "range_length" : 1 };
    spotifyApi.reorderTracksInPlaylist(req.user.username, req.params.id, req.body.initialPosition, req.body.destinationPosition, options)
        .then(function(data) {
            console.log('Tracks reordered in playlist!');
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

router.delete('/playlist/:id', isAuthenticated, function(req, res) {
    var spotifyApi = new SpotifyWebApi({
        accessToken: req.user.accessToken
    });

    console.log('req.body', req.body);
    console.log('req.params', req.params);
    console.log('req.query', req.query);
    // // Remove all occurrence of a track
    // var tracks = { tracks : [{ uri : 'spotify:track:' + req.params.trackId }] };
    // var options = { snapshot_id : req.query.snapshot };
    // spotifyApi.removeTracksFromPlaylist(req.user.username, req.params.id, tracks, options)
    //     .then(function(data) {
    //         console.log('Tracks removed from playlist!');
    //         res.send(data);
    //     }, function(err) {
    //         console.log('Something went wrong!', err);
    //     });

    // Remove tracks from a playlist at a specific position
    spotifyApi.removeTracksFromPlaylistByPosition(req.user.username, req.params.id, [parseInt(req.query.position)], req.query.snapshot)
        .then(function(data) {
            console.log('Tracks removed from playlist!');
            res.send(data);
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

module.exports = router;
