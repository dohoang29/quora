var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
  topic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic"
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  url: String,
  title: String,
  privacy: String,
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer"
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  upVoted: { type: Number, default: 0 },
  isActive: Boolean
});

module.exports = mongoose.model("Question", questionSchema);
