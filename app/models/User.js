const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt   = require('bcryptjs');

const schema = new Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
},
{
    timestamps: true
});
schema.pre('save', function (next) {
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)
            user.password = hash
            next();
        })
    })
});
schema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compare(password, user.password);
};
const User = mongoose.model(
  "User",
  schema
);
module.exports = User;