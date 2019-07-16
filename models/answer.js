var mongoose = require("mongoose");

var answerSchema = new mongoose.Schema({
  topic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic"
    }
  ],
  url: String,
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
  upVoted: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  isActive: Boolean
});

module.exports = mongoose.model("Answer", answerSchema);
