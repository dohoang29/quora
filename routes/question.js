const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Answer = require("../models/answer");

router.get("/:questionId", (req, res) => {
  var questionId = req.params.questionId;
  Question.findOne({ _id: questionId })
    .populate("topic", "title")
    .exec((err, question) => {
      if (err) {
        console.log(err);
      } else {
        Answer.find({ question: questionId })
          .populate("author")
          .exec((err,answers) => {
            if (err) {
                console.log(err);
            } else {
              console.log(question);
              res.render("question", { question: question, answers : answers });
            }
          });
      }
    });
});

module.exports = router;
