var mongoose = require("mongoose");

var answerSchema = new mongoose.Schema({
  topic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic"
    }
  ],
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  url: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
  upVoted: { type: Number, default: 0 },
  view: Number,
  isActive: Boolean
});

module.exports = mongoose.model("Answer", answerSchema);
