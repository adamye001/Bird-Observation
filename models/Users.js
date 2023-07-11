const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



// create an schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    role: { type: String },
});

userSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}



const SALT_FACTOR = 10

// hash password before saving
userSchema.pre('save', function save(next) {
    const user = this // go to next if password field has not been modified
    if (!user.isModified('password')) {
        return next()
    }

    // auto-generate salt/hash
    bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        //replace password with hash
        user.password = hash
        next()
    })
})

var userModel = mongoose.model('userModel', userSchema, "Users");

module.exports = userModel;