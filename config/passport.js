// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'account[]username',
        passwordField: 'account[]password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'account.username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that username
            if (user) {
                return done(null, false);
            } 
            else {

                // if there is no user with that username
                // create the user
                var newUser = new User();

                // set the user's account credentials
                newUser.account.username = username;
                newUser.account.password = newUser.generateHash(password);

                // set the user's account and blog info
                newUser.about.firstname = req.body.about.firstname;
                newUser.about.lastname = req.body.about.lastname;
                newUser.about.email = req.body.about.email;
                newUser.about.description = req.body.about.description;
                newUser.about.picture = req.body.about.picture;
                newUser.blog.name = req.body.blog.name;
                newUser.blog.catchphrase = req.body.blog.catchphrase
                newUser.blog.categories = req.body.blog.categories;

                // to add
                //newUser.blog.url = req.body.blog.url;
                //newUser.blog.logo = req.body.blog.logo;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    // =========================================================================
    // LOCAL LOGIN ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'account.username' :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that username
                if (!user) {
                    return done(null, false);
                } 
                if (!user.validPassword(password)) {
                    return done(null, false);
                }

                return done(null, user);

            });    

        });

    }));

};