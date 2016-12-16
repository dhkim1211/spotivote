var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use('register', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            findOrCreateUser = function() {
                // find a user in Mongo with provided username
                User.findOne({'username': username}, function(err, user) {
                    //in any case of error return
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    //user already exists
                    if (user) {
                        console.log('User Already Exists');
                        return done(null, false,
                            req.flash('message', 'User Already Exists'));
                    }
                    else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');

                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                console.log('Error in Saving User: ' +err);
                                throw err;
                            }
                            console.log('User Registration Successful');
                            return done(null, newUser);
                        });
                    }
                });
            };

            // Delay the execution of findOrCreateUser and execute
            // the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}
