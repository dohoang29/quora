var mongoose = require("mongoose");

var topicSchema = new mongoose.Schema({
    title: String,
    url: String,
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    isActive: Boolean
});

module.exports = mongoose.model("Topic", userSchema);