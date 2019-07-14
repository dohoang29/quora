var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  postType: {
    type: String,
    enum: ["answer", "question"]
  },
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
    ref: "Topic"
  },
  dateCreated: Date,
  dateModified: Date,
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  upVoted: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  isActive: Boolean
});

module.exports = mongoose.model("Post", postSchema);
