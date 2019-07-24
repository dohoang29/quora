const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Answer = require("../models/answer");
const Topic = require("../models/topic");
const User = require("../models/User");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, (req, res) => {
  var publicQuestion = [];
  var privateQuestion = [];
  var limitedQuestion = [];
  Question.find()
    .sort({ dateCreated: -1 })
    .populate("topic")
    .exec((err, questions) => {
      if (err) {
        console.log(err);
      } else {
        questions.forEach(question => {
          // console.log(question.privacy);
          if (question.privacy == "public") {
            publicQuestion.push(question);
          }
        });
        Answer.find()
          .populate("topic")
          .sort({ dateCreated: -1 })
          .populate("question")
          .exec((err, answers) => {
            if (err) {
              console.log(err);
            } else {
              res.render("feed", {
                questions: publicQuestion,
                answers: answers
              });
            }
          });
      }
    });
});

router.post("/:userId", (req, res) => {
  var userId = req.params.userId;
  var topic = req.body.topic;
  var privacy = req.body.privacy;
  var question = req.body.question;
  var link = req.body.link;
  var newQuestion = {
    topic: topic,
    author: userId,
    title: question,
    privacy: privacy,
    question: question,
    url: link,
    isActive: true
  };
  Question.create(newQuestion, (err, question) => {
    if (err) {
      console.log(err);
    } else {
      Topic.findOne({ _id: topic }).exec((err, topic) => {
        if (err) {
          console.log(err);
        } else {
          topic.questions.push(question._id);
          topic.save();
        }
      });
      User.findOne({ _id: userId }).exec((err, user) => {
        if (err) {
          console.log(err);
        } else {
          user.questions.push(question._id);
          user.save();
        }
      });
      res.redirect("/feed");
    }
  });
});

module.exports = router;
