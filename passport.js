const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User');
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email })
            .then(user => {
                if(!user) {
                    console.log('user not found');
                    return done(null, false, { message: 'User with that email did not exist' });
                }
                if (user.password != password) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                return done(null, user, { message: 'Dashboard' });
          
            })
            .catch(err => console.log(err));
        }) 
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
}

