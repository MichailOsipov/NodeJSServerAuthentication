const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
    res.json({message: 'hello from OAuth'});
});

module.exports.oauthRouter = router;
