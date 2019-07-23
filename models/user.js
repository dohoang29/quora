const mongoose = require('mongoose');
var crypto = require("crypto");
var options = {};

const userSchema = new mongoose.Schema({
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
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isBan: { type: Boolean, default: false },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    topic: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
    }],
    dateCreated: { type: Date, default: Date.now },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },

});

module.exports = mongoose.model("User", userSchema);