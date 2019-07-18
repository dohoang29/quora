const mongoose = require('mongoose');
var crypto = require("crypto");
var options = {};

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: { type: Boolean, default: false },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    dateCreated: { type: Date, default: Date.now },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },

});
// UserSchema.methods.setPassword = function(password, cb) {

//     var self = this;

//     crypto.randomBytes(options.saltlen, function(err, buf) {
//         if (err) {
//             return cb(err);
//         }

//         var salt = buf.toString('hex');

//         crypto.pbkdf2(password, salt, options.iterations, options.keylen, function(err, hashRaw) {
//             if (err) {
//                 return cb(err);
//             }

//             self.set(options.hashField, new Buffer(hashRaw, 'binary').toString('hex'));
//             self.set(options.saltField, salt);

//             cb(null, self);
//         });
//     });
// };
const User = mongoose.model('User', UserSchema);

module.exports = User;