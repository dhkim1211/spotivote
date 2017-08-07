var SpotifyStrategy = require('passport-spotify').Strategy;
var User = require('../models/user');

module.exports = function(passport) {

    passport.use(new SpotifyStrategy({
            clientID: process.env.SPOTIFY_CLIENTID,
            clientSecret: process.env.SPOTIFY_CLIENTSECRET,
            callbackURL: process.env.SPOTIFY_CALLBACK_URL
        },
        function(accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            profile.accessToken = accessToken;

            User.findOne({username: profile.id}, function(err, user) {

                if (err) return done(err);

                if (user) {
                    user.accessToken = accessToken;
                    user.refreshToken = refreshToken;
                    user.save();

                    return done(null, user);
                }
                else {
                    User.create({
                        username: profile.id,
                        spotifyId: profile.id,
                        email: profile.email,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }, function(err, newUser) {
                        if (err) return done(err);

                        if (!newUser) return done(null, {message: 'New user could not be created'});

                        return done(null, newUser);
                    })
                }

            })
        }));

}