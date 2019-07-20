const express = require("express");
const router = express.Router();
const Answer = require("../models/answer");
const Question = require("../models/question");
const topic = require("../models/topic");

router.get("/:topicId/:questionId", (req, res) => {
  Answer.findOne({
    topic: req.params.topicId,
    question: req.params.questionId
  }).populate('topic').populate('question').exec((err,answer)=>{
      if(err){
          console.log(err);
      }
      else {
          console.log(answer);
          res.render("answer", {answer : answer});
      }
  });
});

router.post("/:topicId/:questionId", (req, res) => {
  var topicId = req.params.topicId;
  var questionId = req.params.questionId;
  var content = req.body.content;
  var isActive = true;
  var newAnswer = {
    topic: topicId,
    question: questionId,
    content: content,
    isActive: isActive
  };
  Answer.create(newAnswer, (err, answers) => {
    if (err) {
      console.log(err);
    } else {
      Question.findOneAndUpdate
      res.redirect("/answer/"+topicId+"/"+questionId);
    }
  });
});

module.exports = router;
