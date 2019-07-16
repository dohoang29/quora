var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  level: {
    type: String,
    enum: ["admin", "user"]
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }
  ],
  dateCreated: { type: Date, default: Date.now },
  isActive: Boolean
});

module.exports = mongoose.model("User", userSchema);
