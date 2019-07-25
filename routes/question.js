const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Answer = require("../models/answer");
const { ensureAuthenticated } = require("../config/auth");
router.get("/:questionId", ensureAuthenticated, (req, res) => {
  var questionId = req.params.questionId;
  Question.findOne({ _id: questionId })
    .populate("topic", "title")
    .exec((err, question) => {
      if (err) {
        console.log(err);
      } else {
        Answer.find({ question: questionId })
          .populate("author")
          .sort({ dateCreated: -1 })
          .exec((err, answers) => {
            if (err) {
              console.log(err);
            } else {
              res.render("question", { question: question, answers: answers });
            }
          });
      }
    });
});

router.put("/:questionId", (req, res) => {
  var questionId = req.params.questionId;
  var privacy = req.body.privacy;
  var title = req.body.question;
  var link = req.body.link;
  console.log(link);
  Question.findOne({ _id: questionId }, (err, question) => {
    if (err) {
      console.log(err);
    } else {
      if (privacy !== "") {
        question.privacy = privacy;
      }
      if (title !== "") {
        question.title = title;
      }
      if (link !== "") {
        question.url = link;
      }
      question.save();
      res.redirect("/feed");
    }
  });
});

router.delete("/:questionId", (req, res) => {
  var questionId = req.params.questionId;
  Question.findOne({ _id: questionId }, (err, question) => {
    if (err) {
      console.log(err);
    } else {
      question.isActive = false;
      question.save();
      res.redirect("/feed");
    }
  });
});
module.exports = router;
