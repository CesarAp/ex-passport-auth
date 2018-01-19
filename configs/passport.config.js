const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const FBStrategy = require('passport-facebook').Strategy;

const DEFAULT_USERNAME = 'Anonymous Coward';
const FB_CLIENT_ID = process.env.FB_CLIENT_ID || '';
const FB_CLIENT_SECRET = process.env.FB_CLIENT_SECRET || '';
const FB_CB_URL = '/auth/fb/cb';

module.exports.setup = (passport) => {

    passport.serializeUser((user, next) => {
        next(null, user._id);
    });

    passport.deserializeUser((id, next) => {
        User.findById(id)
            .then(user => {
                next(null, user);
            })
            .catch(error => next(error));
    });

    passport.use('local-auth', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, next) => {
        User.findOne({ username: username})
            .then(user => {
                if (!user) {
                    next(null, user, { password: 'Invalid username or password' });
                } else {
                    user.checkPassword(password)
                        .then(match => {
                            if (match) {
                                next(null, user);
                            } else {
                                next(null, null, { password: 'Invalid username or password' });
                            }
                        })
                        .catch(error => next(error));
                }
            })
            .catch(error => next(error));
    }));

    passport.use('fb-auth', new FBStrategy({
        clientID: FB_CLIENT_ID,
        clientSecret: FB_CLIENT_SECRET,
        callbackURL: FB_CB_URL
    }, (accessToken, refreshToken, profile, next) => {
        User.findOne({ 'social.facebookId': profile.id })
            .then(user => {
                if (user) {
                    next(null, user);
                } else {
                    user = new User({
                        username: profile.displayName || DEFAULT_USERNAME,
                        password: Math.random().toString(36).slice(-8),
                        social: {
                            facebookId: profile.id
                        }
                    });
                    user.save()
                        .then(() => {
                            next(null, user);
                        })
                        .catch(error => next(error));
                }
            })
            .catch(error => next(error));
    }));
 }

 module.exports.isAuthenticated = (req, res, next) => {
     if (req.isAuthenticated()) {
         next()
     } else {
         res.redirect('/login');
     }
 }