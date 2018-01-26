const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const {
    UserModel,
    ClientModel,
    AccessTokenModel
} = require('./model');

const passportInitialize = () => {
    passport.use(new BasicStrategy((username, password, done) => {
        ClientModel.findOne({clientId: username}, (err, client) => {
            if (err) {
                return done(err);
            }
            if (!client) {
                return done(null, false);
            }
            if (client.clientSecret !== password) {
                return done(null, false);
            }
            return done(null, client);
        });
    }));

    passport.use(new ClientPasswordStrategy((clientId, clientSecret, done) => {
        ClientModel.findOne({clientId}, (err, client) => {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.clientSecret !== clientSecret) { return done(null, false); }

            return done(null, client);
        });
    }));

    passport.use(new BearerStrategy((accessToken, done) => {
        AccessTokenModel.findOne({token: accessToken}, (err, token) => {
            if (err) { return done(err); }
            if (!token) { return done(null, false); }

            if (Math.round((Date.now() - token.created) / 1000) > 3600) {
                AccessTokenModel.remove({token: accessToken}, (err2) => {
                    if (err2) {
                        return done(err2);
                    }
                });
                return done(null, false, {message: 'Token expired'});
            }

            UserModel.findById(token.userId, (err2, user) => {
                if (err2) { return done(err); }
                if (!user) { return done(null, false, {message: 'Unknown user'}); }

                const info = {scope: '*'};
                return done(null, user, info);
            });
        });
    }));
};

module.exports.passportInitialize = passportInitialize;
