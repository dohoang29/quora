const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Answer = require("../models/answer");
const Topic = require("../models/topic");
var Notifi = require('../models/notifi');
const User = require("../models/user");
const Search = require("../models/search");
const moment = require("moment");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, (req, res) => {
    var publicQuestion = [];
    var privateQuestion = [];
    var limitedQuestion = [];
    var endValue = null;
    Question.find()
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
                            res.render("feed", {
                                questions: publicQuestion,
                                answers: answers,
                                endValue: endValue
                            });
                        }
                    });
            }
        });
});
router.get("/:endques", ensureAuthenticated, (req, res) => {
    var publicQuestion = [];
    var privateQuestion = [];
    var limitedQuestion = [];
    var time = req.params.endques * 1;
    var endValue = null;
    console.log(time);
    Question.find({dateCreated: { $lt: time }})
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
                                questions: publicQuestion,
                                answers: answers,
                                endValue: endValue
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
    var time = new Date().getTime();
    var newQuestion = {
        topic: topic,
        author: userId,
        title: question,
        privacy: privacy,
        url: link,
        isActive: true,
        dateCreated: time,
        dateModified: time
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
                    user.following.push(question._id);
                    user.save();
                }
            });
            question.followers.push(userId);
            question.save();
            var searchQuestion = {
                name: question.title,
                question: question._id
            };
            Search.create(searchQuestion);
            res.redirect("/question/" + question._id);
        }
    });
});


router.get("/:questionId/:userId/:status", (req, res) => {
    var questionId = req.params.questionId;
    var userId = req.params.userId;
    var status = req.params.status;
    var number;
    Question.findOne({ _id: questionId }).exec((err, question) => {
        if (err) {
            console.log(err);
        } else {
            console.log(status);
            if (status === "Upvote") {
                question.upVoted.push(userId);
                question.save();
                number = question.upVoted.length.toString();
                status = "Downvote";
            } else {
                if (status === "Downvote") {
                    for (var i = 0; i < question.upVoted.length; i++) {
                        if (question.upVoted[i] == userId) {
                            question.upVoted.splice(i, 1);
                        }
                    }
                    question.save();
                    number = question.upVoted.length.toString();
                    status = "Upvote";
                }
            }
            if (status === "Follow") {
                question.followers.push(userId);
                question.save();
                User.findById(userId, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        user.following.push(questionId);
                        user.save();
                    }
                });
                number = question.followers.length.toString();
                status = "Unfollow";
                console.log(question.followers.length);
            } else {
                if (status === "Unfollow") {
                    for (var i = 0; i < question.followers.length; i++) {
                        if (question.followers[i] == userId) {
                            question.followers.splice(i, 1);
                        }
                    }
                    console.log(question.followers.length);
                    question.save();
                    User.findById(userId, (err, user) => {
                        if (err) {
                            console.log(err);
                        } else {
                            for (var i = 0; i < user.following.length; i++) {
                                if (user.following[i] == questionId) {
                                    user.following.splice(i, 1);
                                }
                            }
                            user.save();
                        }
                    });
                    number = question.followers.length.toString();
                    status = "Follow";
                }
            }
            count = { voteCount: number, status: status };

            return res.send(count);
        }
    });
});

router.post("/:id/act", (req, res, next) => {
    var action = req.body.action;
    Question.findOne({ _id: req.params.id }).exec((err, question) => {
        if (err) {
            console.log(err);
        } else {
            if (action === "Upvote") {
                question.upVoted += 1;
            } else {
                question.upVoted -= 1;
            }
            res.send(question.upVoted);
        }
    });
});


module.exports = router;