const mongoose = require('mongoose');

const DB_USER = 'NodeJsServer';
const DB_PASSWORD = 123;
const DB_NAME = 'sharing_system';
const DB_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@ds137054.mlab.com:37054/${DB_NAME}`;

module.exports.connectToDB = () => {
    mongoose.connect(DB_URL);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        // we're connected!
    });
};
