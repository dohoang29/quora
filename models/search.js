var mongoose = require("mongoose");

var searchSchema = new mongoose.Schema({
    idPost:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
    }],
    title: String
});

module.exports = mongoose.model("Search", searchSchema);