const oauth2orize = require('oauth2orize');
const passport = require('passport');
const crypto = require('crypto');
const {
    UserModel,
    AccessTokenModel,
    RefreshTokenModel
} = require('./model');

const server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
    UserModel.findOne({username}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (!user.validPassword(password)) {
            return done(null, false);
        }

        RefreshTokenModel.remove({userId: user.id, clientId: client.clientId}, (err2) => {
            if (err2) {
                return done(err2);
            }
        });
        AccessTokenModel.remove({userId: user.id, clientId: client.clientId}, (err2) => {
            if (err2) {
                return done(err2);
            }
        });

        const tokenValue = crypto.randomBytes(32).toString('base64');
        const refreshTokenValue = crypto.randomBytes(32).toString('base64');
        const token = new AccessTokenModel({token: tokenValue, clientId: client.clientId, userId: user.id});
        const refreshToken = new RefreshTokenModel({
            token: refreshTokenValue,
            clientId: client.clientId,
            userId: user.id
        });
        refreshToken.save((err2) => {
            if (err2) {
                return done(err2);
            }
        });

        token.save((err2) => {
            if (err) {
                return done(err);
            }
            return done(null, tokenValue, refreshTokenValue, {expires_in: 3600});
        });
    });
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
    RefreshTokenModel.findOne({token: refreshToken}, (err, token) => {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }
        if (!token) { return done(null, false); }

        UserModel.findById(token.userId, (err2, user) => {
            if (err2) { return done(err2); }
            if (!user) { return done(null, false); }

            RefreshTokenModel.remove({userId: user.id, clientId: client.clientId}, (err3) => {
                if (err3) return done(err3);
            });
            AccessTokenModel.remove({userId: user.id, clientId: client.clientId}, (err3) => {
                if (err3) return done(err3);
            });

            const tokenValue = crypto.randomBytes(32).toString('base64');
            const refreshTokenValue = crypto.randomBytes(32).toString('base64');
            const tokenNew = new AccessTokenModel({token: tokenValue, clientId: client.clientId, userId: user.id});
            const refreshTokenNew = new RefreshTokenModel({
                token: refreshTokenValue,
                clientId: client.clientId,
                userId: user.id
            });
            refreshToken.save((err3) => {
                if (err3) { return done(err3); }
            });
            tokenNew.save((err3) => {
                if (err3) { return done(err3); }
                return done(null, tokenValue, refreshTokenNew, {expires_in: 3600});
            });
        });
    });
}));


// token endpoint
exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
    server.token(),
    server.errorHandler()
];
