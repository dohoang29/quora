const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Topic = require("../models/topic");

router.get("/feed", (req, res) => {
  Topic.find({}, (err, topics) => {
    if (err) {
      console.log(err);
    } else {
      res.render("feed", { topics: topics });
    }
  });
});
router.post("/feed", (req, res) => {
  var topic = req.body.topic;
  var privacy = req.body.privacy;
  var question = req.body.question;
  var link = req.body.link;
  var newQuestion = {
    topic: topic,
    privacy: privacy,
    question: question,
    url: link
  };
  Question.create(newQuestion, (err, questions) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/feed");
    }
  });
});

module.exports = router;
