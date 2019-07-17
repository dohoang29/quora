const mongoose = require('mongoose');

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
    roles: [{ type: 'String' }],
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

const User = mongoose.model('User', UserSchema);

module.exports = User;