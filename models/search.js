var mongoose = require("mongoose");

var searchSchema = new mongoose.Schema({
  name: String,
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer"
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic"
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
searchSchema.index({ name: "text" });
module.exports = mongoose.model("Search", searchSchema);
