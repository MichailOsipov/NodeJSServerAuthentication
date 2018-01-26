const express = require('express');
const {User} = require('./user-storage');

const registerRouter = express.Router();

registerRouter.post('/', (req, res) => {
    const {login, password} = req.body;
    const user = new User({login, password});
    user.save();
    res.json({message: 'user is added successfully'});
});

module.exports.registerRouter = registerRouter;
