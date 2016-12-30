var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Playlist = require('../models/playlist');
const co     = require('co');

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
            Playlist.create({
                name: req.body.playlistName,
                user: req.user.username,
                playlistId: data.body.id
            }, function(err, playlist) {
                if (err) throw err;
                data.accessCode = playlist.accessCode;
                res.send(data);
            })
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
            Playlist.findOne({ playlistId: req.params.id}, function(err, playlist) {
                if (err) throw err;
                for (var i = 0; i < playlist.tracks.length; i++) {
                    data.body.tracks.items[i].votes = playlist.tracks[i].votes;
                }
                res.send(data.body);
            })

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
            // Update db
            Playlist.findOneAndUpdate({ playlistId: req.params.id}, {
                $push: {
                    tracks: {
                        id: req.body.track,
                        name: req.body.title,
                        artist: req.body.artist,
                        votes: 0
                    }
                }
            }, { new: true }, function(err, playlist) {
                if (err) throw err;
                res.send(data);
            })
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
            res.send(data);
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

router.delete('/playlist/:id', isAuthenticated, function(req, res) {
    var spotifyApi = new SpotifyWebApi({
        accessToken: req.user.accessToken
    });

    var snapshot = req.query.snapshot.replace(/ /g, "+");

    // Remove tracks from a playlist at a specific position
    spotifyApi.removeTracksFromPlaylistByPosition(req.user.username, req.params.id, [parseInt(req.query.position)], snapshot)
        .then(function(data) {
            console.log('Track removed from playlist!');

            // Remove track from db
            Playlist.findOneAndUpdate({ playlistId: req.params.id}, {
                $pull: { tracks: { id: req.query.track}}
            }, function(err, playlist) {
                if (err) throw err;
                res.send(data);
            })
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

router.post('/playlist/:id/vote', isAuthenticated, function(req, res) {
    var spotifyApi = new SpotifyWebApi({
        accessToken: req.user.accessToken
    });

    Playlist.findOne({ playlistId: req.params.id}, function(err, playlist) {
        if (err) throw err;

        var count = playlist.tracks.length - 1;
        for (var i = 0; i < 1; i++) {
            if (playlist.tracks[i].id == req.body.track) {
                playlist.tracks[i].votes++;
                playlist.save(function(err) {
                    if (err) throw err;
                    count++;
                })
            }
        }

        var counter = 1;
        for (var i = 1; i < playlist.tracks.length; i++) {
            if (playlist.tracks[i].id == req.body.track) {
                playlist.tracks[i].votes++;
                var selectedTrack = playlist.tracks[i];
                var position = i - 1;

                // If voted-up track has more votes than previous track, move the track up in playlist position
                if (playlist.tracks[i].votes > playlist.tracks[i-1].votes) {

                    var options = { "range_length" : 1 };

                    spotifyApi.reorderTracksInPlaylist(req.user.username, req.params.id, i, (i-1), options)
                        .then(function(data) {
                            console.log('Tracks reordered in playlist!');
                        }, function(err) {
                            console.log('Something went wrong!', err);
                        });

                    // Pull the selected track from array
                    Playlist.findOneAndUpdate({ playlistId: req.params.id}, {
                        $pull: {
                            "tracks": {id: playlist.tracks[i].id}
                        }
                    }, {new: true}, function(err, updatedPlaylist) {
                        console.log('updated!', updatedPlaylist);

                        // Push the selected track to new position in array
                        Playlist.findOneAndUpdate({ playlistId: req.params.id}, {
                            $push: {
                                "tracks": {
                                    $each: [selectedTrack],
                                    $position: position
                                }
                            }
                        }, {new: true}, function(err, finalPlaylist) {
                            console.log('final!', finalPlaylist);
                        })
                    })
                }
            }
            counter++;
        }
        if (counter == playlist.tracks.length || count == playlist.tracks.length) {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
