const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {connectToDB} = require('./connect-to-db');
const {passportInitialize} = require('./passport-initialize');
const oauth2 = require('./oauth2');
const {UserModel, ClientModel} = require('./model');

const hostname = '127.0.0.1';
const port = 8088;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

connectToDB();
passportInitialize();

app.post('/oauth/token', oauth2.token);

app.get('/userInfo', passport.authenticate('bearer', {session: false}), (req, res) => {
    res.json({message: 'some important message'});
});

app.post('/user', (req, res) => {
    const {username, password, userId} = req.body;
    const user = new UserModel({username, password, userId});
    user.save();
    res.json({message: 'Done!'});
});

app.post('/client', (req, res) => {
    const {name, clientId, clientSecret} = req.body;
    const client = new ClientModel({name, clientId, clientSecret});
    client.save();
    res.json({message: 'Done!'});
});

app.listen(port, hostname, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    return console.log(`Server running at http://${hostname}:${port}/`);
});
