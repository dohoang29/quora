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
        required: false
    },
    googleId: String,
    imageUrl: {
        type: String,
        default: "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isBan: { type: Boolean, default: false },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    answer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
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
    isLoginFirst:{
        type: Boolean,
        required: true,
        default: true
    },
    notifi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notifi"
    }],
    notifiRead:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notifi"
    }]
});

module.exports = mongoose.model("User", userSchema);