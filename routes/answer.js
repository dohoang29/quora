const express = require("express");
const router = express.Router();
const Answer = require("../models/answer");
const Question = require("../models/question");
const Topic = require("../models/topic");
const User = require("../models/user");
const Noti = require("../models/notifi");
const { ensureAuthenticated } = require("../config/auth");
router.get("/:answerId", ensureAuthenticated, (req, res) => {
    Answer.findOne({
            _id: req.params.answerId
        })
        .populate("topic")
        .populate("question")
        .exec((err, answer) => {
            if (err) {
                console.log(err);
            } else {
                res.render("answer", { answer: answer });
            }
        });
});

router.put("/:answerId", (req, res) => {
    var content = req.body.content;
    var answerId = req.params.answerId;
    Answer.findOne({ "_id": answerId }).exec((err, answer) => {
        if (err) {
            console.log(err);
        } else {
            console.log(content);
            answer.content = content;
            answer.save();
            res.redirect("/answer/" + answer._id);
        }
    })
});

router.put("/:questionId/:answerId/", (req, res) => {
    var answerId = req.params.answerId;
    var questionId = req.params.questionId;
    Answer.findOne({ "_id": answerId }).exec((err, answer) => {
        if (err) {
            console.log(err);
        } else {
            answer.isActive = true;
            answer.save();
            Question.findOne({ "_id": questionId }).exec((err, question) => {
                if (err) {
                    console.log(err);
                } else {
                    question.answers.push(answerId);
                    question.save();
                    res.redirect("/answer/" + answer._id);
                }
            });
        }
    })
});

router.delete("/:questionId/:answerId", (req, res) => {
    var answerId = req.params.answerId;
    var questionId = req.params.questionId;
    Answer.findOne({ "_id": answerId }).exec((err, answer) => {
        if (err) {
            console.log(err);
        } else {
            answer.isActive = false;
            answer.save();
            Question.findOne({ "_id": questionId }).exec((err, question) => {
                if (err) {
                    console.log(err);
                } else {
                    for (var i = 0; i < question.answers.length; i++) {
                        if (question.answers[i] == answerId) {
                            question.answers.splice(i, 1);
                        }
                    }
                    question.save();
                    res.redirect("/answer/" + answer._id);
                }
            });
        }
    })
});

router.post("/:topicId/:questionId/:userId", (req, res) => {
    var topicId = req.params.topicId;
    var questionId = req.params.questionId;
    var userId = req.params.userId;
    var content = req.body.content;
    var isActive = true;
    var time = new Date().getTime();
    var newAnswer = {
        topic: topicId,
        question: questionId,
        content: content,
        author: userId,
        isActive: isActive,
        dateCreated: time,
        dateModified: time
    };
    Answer.create(newAnswer, (err, answer) => {
        if (err) {
            console.log(err);
        } else {
            Question.findById(questionId).exec((err, question) => {
                if (err) {
                    console.log(err);
                } else {
                    question.answers.push(answer._id);
                    question.save();
                    var newNoti = {
                        questionId: question._id,
                        author: userId,
                        title: question.title
                    }
                    Noti.create(newNoti, (err, noti) => {
                        if (err) {
                            console.log(err);
                        } else {
                            question.followers.forEach(follower => {
                                var flag = false;
                                if (follower == userId) {
                                    flag = true;
                                }
                                if (flag == false) {
                                    question.followers.push(userId);
                                }
                                question.save();
                                User.findById(follower, (err, user) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("hi");
                                        user.notifi.push(noti._id);
                                        if (user.notifi.length > 25) {
                                            user.notifi.shift();
                                        }
                                        user.save();
                                    }
                                })
                            });
                        }
                    })


                }
            });
            Topic.findOne({ _id: topicId }).exec((err, topic) => {
                if (err) {
                    console.log(err);
                } else {
                    topic.answers.push(answer._id);
                    topic.save();
                }
            });
            User.findOne({ _id: userId }).exec((err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    user.answer.push(answer._id);
                    user.save();
                }
            });
            res.redirect("/answer/" + answer._id);
        }
    });
});

module.exports = router;