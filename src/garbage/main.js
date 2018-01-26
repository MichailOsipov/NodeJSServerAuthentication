const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongodbStore = require('connect-mongo')(session);

const {connectToDB} = require('./connect-to-db');
const {registerRouter} = require('./register-router');
const {passportjsRouter} = require('./passportjs-router');
const {oauthRouter} = require('./oauth-router');

const hostname = '127.0.0.1';
const port = 8088;

connectToDB();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    name: 'authSession',
    store: new MongodbStore({
        mongooseConnection: mongoose.connection,
        touchAfter: 24 * 3600
    }),
    secret: 'some important secret',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 15}
}));

app.use('/register', registerRouter);
app.use('/passportjs', passportjsRouter);
app.use('/oauth', oauthRouter);

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Something broke!');
    next();
});

app.listen(port, hostname, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    return console.log(`Server running at http://${hostname}:${port}/`);
});
