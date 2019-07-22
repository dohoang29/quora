const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Answer = require("../models/answer");
const { ensureAuthenticated } = require('../config/auth');

router.get("/",ensureAuthenticated, (req, res) => {
  var publicQuestion = [];
  var privateQuestion = [];
  var limitedQuestion = [];
  Question.find().populate('topic').exec((err,questions)=>{
    if(err){
      console.log(err);
    }
    else{
      questions.forEach((question)=>{
        // console.log(question.privacy);
        if(question.privacy == "public"){
          publicQuestion.push(question);
        }
      });
      Answer.find().populate('topic').populate('question').exec((err,answers)=>{
        if(err){
          console.log(err);
        }
        else{
          res.render("feed", {questions : publicQuestion , answers : answers});
        }
      });
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
