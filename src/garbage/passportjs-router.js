const express = require('express');
const {initPassportStrategy} = require('./init-passport-strategy');
const {User} = require('./user-storage');

initPassportStrategy();

const passportjsRouter = express.Router();

passportjsRouter.get('/login', (req, res) => {
    const user = new User({id: 0, login: 'michail', password: 12345});
    user.save();
    res.json({message: 'hello from passportJs'});
});

module.exports.passportjsRouter = passportjsRouter;
