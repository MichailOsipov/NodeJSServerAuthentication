const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    id: String,
    login: String,
    password: String,
    passportOrOAth: Boolean
});

userSchema.pre('save', function callback(next) {
    if (this.password) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();
});

userSchema.methods.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports.User = mongoose.model('User', userSchema);
