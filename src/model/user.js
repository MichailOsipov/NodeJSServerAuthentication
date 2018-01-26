const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
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

module.exports.UserModel = mongoose.model('User', userSchema);
