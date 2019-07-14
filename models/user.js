var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    level:{
        type: String,
        enum:['admin','user']
    },
    dateCreated: Date,
    isActive: Boolean
});

module.exports = mongoose.model("User", userSchema);