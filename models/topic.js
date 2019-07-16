var mongoose = require("mongoose");

var topicSchema = new mongoose.Schema({
    title: String,
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    answers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
    }],
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    isActive: Boolean
});

module.exports = mongoose.model("Topic", topicSchema);