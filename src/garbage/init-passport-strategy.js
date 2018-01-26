const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../user-storage');

const initPassportStrategy = () => {
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallBack: true
    }, (req, login, password, done) => {
        User.findOne({login}, (err, user) => {
            if (err) {
                return new Error(err);
            }

            if (!user) {
                return done(null, false, {message: 'User doesnt exists'});
            }

            if (user.validPassword(password)) {
                return done(null, user);
            }

            return done(null, false, {message: 'Invalid password'});
        });
    }));
};

module.exports.initPassportStrategy = initPassportStrategy;
