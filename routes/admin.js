const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Search = require("../models/search");
var Question = require("../models/question");
var Answer = require("../models/answer");
router.get("/", isLoggedInAdmin, (req, res) => {
    User.find((err, users) => {
        if (!err) {
            res.render("admin/list", { users: users });
        } else {
            console.log("Error in retrieving user list :" + err);
        }
    });
});
//posts manage
router.get("/posts", isLoggedInAdmin, (req, res) => {
    Question.find().populate("author").exec((err, questions) => {
        if (err) {
            console.log(err);
        } else {
            res.render("admin/posts", { questions: questions });
        }
    })
});
//ban questions
router.get("/ban/questions/:id", (req, res) => {
    Question.findById(req.params.id, (err, question) => {
        if (!err) {
            if (question.isActive === true) {
                question.isActive = false;
                console.log(question.isActive);
                question.save();
                console.log(question.isActive);
                req.flash("success_msg", "You are ban an question success");
                res.redirect("/admin/posts");
            } else {
                question.isActive = true;
                question.save();
                req.flash("success_msg", "You are unban an question success");
                res.redirect("/admin/posts");
            }
        } else {
            console.log("Error in question ban :" + err);
        }
    });
});
//show answer
router.get("/answers", isLoggedInAdmin, (req, res) => {
    Answer.find().populate("author").populate("topic").populate("question").exec((err, answers) => {
        if (!err) {
            res.render("admin/answer", { answers: answers });

        } else {
            console.log(err);
        }
    })
});
router.get("/ban/answers/:id", (req, res) => {
    Answer.findById(req.params.id, (err, answer) => {
        if (!err) {
            if (answer.isActive === true) {
                answer.isActive = false; 
                answer.save();
                req.flash("success_msg", "You are ban an answer success");
                res.redirect("/admin/answers");
            } else {
                answer.isActive = true;
                answer.save();
                req.flash("success_msg", "You are unban an answers success");
                res.redirect("/admin/answers");
            }
        } else {
            console.log("Error in answer ban :" + err);
        }
    });
});
router.get("/add", (req, res) => {
    res.render("list");
});
// find id
router.get("/edit/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (!err) {
            res.render("admin/edit", { user: user });
        }
    });
});
//delete
router.get("/delete/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (user.email == "1611134@hcmut.edu.vn") {
            req.flash("success_msg", "Not delete admin Hoan");
            res.redirect("/admin");
        } else {
            User.findByIdAndRemove(req.params.id, (err, user) => {
                if (!err) {
                    req.flash("success_msg", "You are deleted an user");
                    res.redirect("/admin");
                } else {
                    console.log("Error in user delete :" + err);
                }
            });
        }
    });
});
//ban
router.get("/ban/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (user.email == "1611134@hcmut.edu.vn") {
            req.flash("success_msg", "Not ban Admin Hoan");
            res.redirect("/admin");
        } else {
            if (!err) {
                if (user.isBan == false) {
                    user.isBan = true;
                    user.save();
                    console.log(user.isBan);
                    req.flash("success_msg", "You are ban an user success");
                    res.redirect("/admin");
                } else {
                    user.isBan = false;
                    user.save();
                    console.log(user.isBan);
                    console.log("test hoang");
                    req.flash("success_msg", "You are unban an user success");
                    res.redirect("/admin");
                }
            } else {
                console.log("Error in user ban :" + err);
            }
        }
    });
});

//reset pass
router.get("/resetPassword/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (!err) {
            res.render("admin/resetPassword", { user: user });
        }
    });
});
//add user new
router.post("/add", (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    let errors = [];
    if (!firstname || !lastname || !email || !password) {
        req.flash("error", "Please enter full feild.");
        console.log("test full field");
        res.redirect("/admin");
    }
    if (password.length < 6) {
        req.flash("error", "Password must be at least 6 characters");
        res.redirect("/admin");
    } else {
        User.findOne({
            email: email
        }).then(user => {
            if (user) {
                errors.push({
                    msg: "Email already exists"
                });
                res.render("list", {
                    errors,
                    firstname,
                    lastname,
                    email,
                    password
                });
            } else {
                var user = new User();
                user.firstname = req.body.firstname;
                user.lastname = req.body.lastname;
                user.email = req.body.email;
                user.password = bcrypt.hashSync(req.body.password, 10);

                user.save((err, user) => {
                    if (!err) {
                        var newUser = {
                            name: user.firstname + " " + user.lastname,
                            user: user._id
                        };
                        Search.create(newUser, (err, user) => {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash("success_msg", "You are created an User");
                                res.redirect("/admin");
                            }
                        });
                    } else {
                        if (err.name == "ValidationError") {
                            handleValidationError(err, req.body);
                            res.render("/admin/list", {});
                        } else console.log("Error during record insertion : " + err);
                    }
                });
            }
        });
    }
});
// edit user
router.post("/edit/:id", (req, res) => {
    User.findOneAndUpdate({ _id: req.body._id },
        req.body, { new: true },
        (err, user) => {
            if (!err) {
                req.flash("success_msg", "You are edited user success");
                res.redirect("/admin");
            } else {
                if (err.name == "ValidationError") {
                    Search.findOne({ user: user._id }, (err, search) => {
                        if (err) {
                            console.log(err);
                        } else {
                            search.name = user.firstname + " " + user.lastname;
                            search.save();
                            handleValidationError(err, req.body);
                            res.render("/admin/list", {});
                        }
                    });
                    handleValidationError(err, req.body);
                    res.render("/admin/list", {});
                } else console.log("Error during record update : " + err);
            }
        }
    );
});
//reset password
router.post("/resetPassword/:id", (req, res) => {
    const { password, password2 } = req.body;
    let errors = [];
    if (password.length < 6) {
        req.flash("error", "Password must be at least 6 characters");
        return res.redirect("/admin");
    }
    if (req.body.password === req.body.password2) {
        User.findOne({ _id: req.params.id }, (err, user) => {
            user.password = bcrypt.hashSync(password, 10);
            user.save();
            // console.log(user.password);
            res.redirect("/admin");
            req.flash("success_msg", "You are now reseted password");
        });
    } else {
        req.flash("error", "Passwords do not match.");
        return res.redirect("back");
    }
});
//vetify email
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case "email":
                body["emailError"] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}
// function test login admin
function isLoggedInAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.session.passport.user, (err, user) => {
            if (user.role == "admin") {
                return next();
            } else {
                console.log("not admin");
                res.send("Acess Denied");
            }
        });
    } else {
        console.log("not login");
        res.send("Acess Denied");
    }
}
module.exports = router;