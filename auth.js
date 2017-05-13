var util = require('util');
var googleConfig = require('./google.config');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var useSession = false;


var users = [];
var auth = {};

auth.addAuth = function (app) {

    addBearerStrategie();
    addGoogleStrategie();
    

    app.use(passport.initialize());

    if (useSession) {
        app.use(passport.session());


        // used to serialize the user for the session
        passport.serializeUser(function (user, done) {
            console.log('serialize User:' + util.inspect(user));
            done(null, user);
        });

        // used to deserialize the user
        passport.deserializeUser(function (user, done) {
            console.log('deserialize User:' + util.inspect(user));
            //User.findById(id, function (err, user) {
            //  done(err, user);
            //});
            done(null, user);
        });

    }


    if (useSession) {

        app.use(session({
            secret: 'keyboard cat',
            resave: true,
            saveUninitialized: true,
            //cookie: { secure: true }
        }));
    }
}


auth.secure = passport.authenticate('bearer', { session: useSession });

auth.authenticateGoogle = passport
    .authenticate('google', { 
        session: useSession, 
        scope: ['https://www.googleapis.com/auth/plus.login']
    });

auth.authenticateGoogleCallback = passport
    .authenticate('google', { 
        session: useSession, 
        failureRedirect: '/loginError'
    });

function addGoogleStrategie(){
    passport.use(new GoogleStrategy({
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    },
        function (accessToken, refreshToken, profile, done) {

            console.log(util.inspect(profile));
            var user = { googleid: profile.id, name: "nico", access_token: accessToken };
            users.push(user);
            return done(null, user);

        }
    ));
}

function addBearerStrategie(){
    
    var BearerStrategy = require('passport-http-bearer').Strategy;


    passport.use(new BearerStrategy(function (token, done) {

        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (user.access_token == token) {
                console.log('Found users for token: ' + token);
                done(null, user, { scope: 'all' });
                return;
            }
        }

        done(null, false);

    }));
}

module.exports = auth;