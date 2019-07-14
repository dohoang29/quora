var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  dateCreated: Date,
  message: String,
  reply: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }
  ],
  upVoted: Number,
  isActive: Boolean
});

module.exports = mongoose.model("Comment", commentSchema);
