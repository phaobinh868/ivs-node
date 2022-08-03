var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var schema = new Schema({
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
    bcrypt.hash(user.password,null, null, function(err,hash){
      if(err) return next(err);
        user.password = hash;
        next();
    });
});
schema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
};
const User = mongoose.model(
  "User",
  schema
);
module.exports = User;