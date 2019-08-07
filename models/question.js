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
  dateCreated: { type: Number },
  dateModified: { type: Number  },
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
  upVoted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  isActive: Boolean
});

module.exports = mongoose.model("Question", questionSchema);
