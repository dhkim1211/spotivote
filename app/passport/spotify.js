var SpotifyStrategy = require('passport-spotify').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    // Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and spotify
//   profile), and invoke a callback with a user object.
    passport.use(new SpotifyStrategy({
            clientID: '23affdd1353d40b181322db6bbca406c',
            clientSecret: 'b917af777ab946488da74aa1111d9d86',
            callbackURL: 'http://localhost:3000/auth/spotify/callback/'
        },
        function(accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            profile.accessToken = accessToken;

            console.log('profile', profile);

            User.findOne({username: profile.id}, function(err, user) {
                if (err) {return done(err);}
                console.log('user', user);
                if (user) {
                    return done(null, user);
                }
                else {
                    console.log('findONe');
                    User.create({
                        username: profile.id,
                        spotifyId: profile.id,
                        email: profile.email
                    }, function(err, newUser) {
                        console.log('newUser');
                        if (err) return done(err);
                        if (!newUser) return done(null, {message: 'New user could not be created'});
                        return done(null, newUser);
                    })
                }

            })
            // process.nextTick(function () {
            //     // To keep the example simple, the user's spotify profile is returned to
            //     // represent the logged-in user. In a typical application, you would want
            //     // to associate the spotify account with a user record in your database,
            //     // and return that user instead.
            //     return done(null, newUser);
            // });
        }));

}