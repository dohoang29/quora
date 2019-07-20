var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
  topic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic"
    }
  ],
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
  upVoted: Number,
  isActive: Boolean
});

module.exports = mongoose.model("Question", questionSchema);
