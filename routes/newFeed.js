const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const topic = require("../models/topic");

router.get("/", (req, res) => {
  var publicQuestion = [];
  var privateQuestion = [];
  var limitedQuestion = [];
  Question.find().populate('topic').exec((err,questions)=>{
    if(err){
      console.log(err);
    }
    else{
      questions.forEach((question)=>{
        console.log(question.privacy);
        if(question.privacy == "public"){
          publicQuestion.push(question);
        }
      });
      console.log(publicQuestion);
      res.render("feed", {questions : publicQuestion});
    }
  });
  
  
});
router.post("/", (req, res) => {
  var topic = req.body.topic;
  var privacy = req.body.privacy;
  var question = req.body.question;
  var link = req.body.link;
  var newQuestion = {
    topic: topic,
    title: question,
    privacy: privacy,
    question: question,
    url: link,
    isAcetive: true
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
