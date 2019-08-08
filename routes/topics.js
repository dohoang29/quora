const express = require("express");
const router = express.Router();
const Topic = require("../models/topic");
const User = require("../models/user");
const Question = require("../models/question");
const Answer = require("../models/answer");
const { ensureAuthenticated } = require("../config/auth");

router.get("/:id", ensureAuthenticated, (req, res) => {
  Topic.findById(req.params.id, (err, topic) => {
    if (err) {
      console.log(err);
    } else {
      var publicQuestion = [];
      var endValue = null;
      Question.find({ topic: topic._id })
        .sort({ dateCreated: -1 })
        .populate("topic")
        .populate("author")
        .limit(5)
        .exec((err, questions) => {
          if (err) {
            console.log(err);
          } else {
            questions.forEach(question => {
              // console.log(question.privacy);
              if (question.privacy == "public") {
                publicQuestion.push(question);
                endValue = question.dateCreated;
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
                  res.render("topicPage", {
                    topic: topic,
                    questions: publicQuestion,
                    answers: answers,
                    endValue: endValue
                  });
                }
              });
          }
        });
    }
  });
});
router.get("/:id/:endques", (req, res) => {
  var publicQuestion = [];
      var endValue = null;
      var time = req.params.endques * 1;
  Topic.findById(req.params.id, (err, topic) => {
    if (err) {
      console.log(err);
    } else {
      
      Question.find({
        $and: [{ dateCreated: { $lt: time } }, { topic: topic._id }]
      })
        .sort({ dateCreated: -1 })
        .populate("topic")
        .populate("author")
        .limit(5)
        .exec((err, questions) => {
          if (err) {
            console.log(err);
          } else {
            questions.forEach(question => {
              // console.log(question.privacy);
              if (question.privacy == "public") {
                publicQuestion.push(question);
                endValue = question.dateCreated;
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
                  res.send({
                    topic: topic,
                    questions: publicQuestion,
                    answers: answers,
                    endValue: endValue
                  });
                }
              });
          }
        });
    }
  });
});
router.get("/:topicId/:userId/:action", (req, res) => {
  var topicId = req.params.topicId;
  var userId = req.params.userId;
  var action = req.params.action;
  var count;
  Topic.findById(topicId, (err, topic) => {
    if (err) {
      console.log(err);
    } else {
      if (action === "Follow") {
        topic.followers.push(userId);
        topic.save();
        User.findById(userId, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            user.topic.push(topicId);
            user.save();
          }
        });
        count = topic.followers.length.toString();
        action = "Unfollow";
      } else {
        for (var i = 0; i < topic.followers.length; i++) {
          if (topic.followers[i] == userId) {
            topic.followers.splice(i, 1);
          }
        }
        topic.save();
        User.findById(userId, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            for (var i = 0; i < user.topic.length; i++) {
              if (user.topic[i] == topicId) {
                user.topic.splice(i, 1);
              }
            }
            user.save();
          }
        });
        count = topic.followers.length.toString();
        action = "Follow";
      }
      var follow = { count: count, status: action };
      return res.send(follow);
    }
  });
});
module.exports = router;
