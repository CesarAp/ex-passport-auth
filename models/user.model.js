const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const FIRST_ADMIN = 'ironhacker';
const ROLE_ADMIN = 'ADMIN';
const ROLE_GUEST = 'GUEST';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'User needs a password']
    },
    social: {
        facebookId: String,
        googleId: String
    },
    role: {
        type: String,
        enum: [ROLE_GUEST, ROLE_ADMIN],
        default: ROLE_GUEST
    }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    if (user.isAdmin()) {
        user.role = 'ADMIN';
    }

    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
            bcrypt.hash(user.password, salt)
                .then(hash => {
                    user.password = hash;
                    next();
                })
        })
        .catch(error => next(error));
});

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.isAdmin = function() {
    return this.username === FIRST_ADMIN || this.role === ROLE_ADMIN;
} 

const User = mongoose.model('User', userSchema);
module.exports = User;