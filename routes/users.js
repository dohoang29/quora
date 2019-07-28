const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var multer = require('multer');
const path = require("path");
// Load User model
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile','email']
}));
// hand control to passport to use code to grab profile info
router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/feed');
});
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
//favorite
router.get('/favorite', function(req, res) {
    res.render('favorite.ejs')
});
//profile user
router.get('/profile/:id', isLoggedIn, function(req, res) {
    res.render('profile.ejs',{});
});
// Register
router.post("/register", (req, res) => {
    const { firstname, lastname, email, password, password2 } = req.body;
    let errors = [];

    if (!firstname || !lastname || !email || !password || !password2) {
        errors.push({
            msg: "Please enter all fields"
        });
    }
    if (password.length < 6) {
        req.flash('error', 'Password must be at least 6 characters');
        return res.redirect('/register');
    }
    if (password != password2) {
        errors.push({
            msg: "Passwords do not match"
        });
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            firstname,
            lastname,
            email,
            password,
            password2
        });
    } else {
        User.findOne({
            email: email
        }).then(user => {
            if (user) {
                errors.push({
                    msg: "Email already exists"
                });
                res.render("register", {
                    errors,
                    firstname,
                    lastname,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    firstname,
                    lastname,
                    email,
                    password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    "success_msg",
                                    "Please choose favorite topic to Feed."
                                );
                                res.redirect("/favorite");
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/feed",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
});
//forgot password page
router.get("/forgot", (req, res) => res.render("forgot"));

//forgot password
router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                if (user.isBan == true) {
                    req.flash('error', 'Accout is ban, please contact admin for support.');
                    return res.redirect('/login');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: config.email.MAIL_USER,
                    pass: config.email.MAIL_PASS
                }
            });
            var mailOptions = {
                to: user.email,
                from: config.email.MAIL_USER,
                subject: 'Quora Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

// reset password
router.get("/reset/:token", function(req, res) {
    User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        },
        function(err, user) {
            if (!user) {
                req.flash("error", "Password reset token is invalid or has expired.");
                return res.redirect("/forgot");
            }
            res.render("reset", { token: req.params.token });
        }
    );
});

router.post('/reset/:token', function(req, res) {
    const {
        password
    } = req.body;
    async.waterfall([
            function(done) {
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }
                    if (req.body.password === req.body.confirm) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.password = bcrypt.hashSync(req.body.password, 10);
                        // console.log('password' + user.password + 'and the user is' + user)
                        user.save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now reseted password and can log in'
                                );
                                res.redirect('/login');
                            })

                    } else {
                        req.flash("error", "Passwords do not match.");
                        return res.redirect('back');
                    }
                });
            },
        ],
        function(err) {
            res.redirect('/feed');
        });
});
//profile edit
router.post('/profile/information/:id', (req, res) => {
    updateRecord(req, res);
});

// find id
router.get('/profile/information/:id', (req, res) => {
    res.render("profile")
});
//edit
function updateRecord(req, res) {

    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, user) => {
        if (!err) {
            req.flash('success_msg', 'You are updated infor success');
            res.redirect('/profile/:id');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("profile", {});
            } else
                console.log('Error during update : ' + err);
        }
    });
}
//
//profile edit
router.post('/profile/reset/:id', (req, res) => {
    resetPassRecord(req, res);
});

router.get('/profile/reset/:id', (req, res) => {
    res.render("profile")
});
//edit
function resetPassRecord(req, res) {

    User.findOne({ _id: req.params.id }).then(user => {
        // Match password
        bcrypt.compare(req.body.password, user.password, (err, isMatch, done) => {
            if (err) throw err;
            if (isMatch) {
                let errors = [];
                if (req.body.newPassword.length < 6) {
                    req.flash("error", "Password must be at least 6 characters");
                    return res.redirect('back');
                }
                if (req.body.newPassword === req.body.newPassword2) {
                    user.password = bcrypt.hashSync(req.body.newPassword, 10);
                    user.save().then(user => {
                        req.flash("success_msg", "You are updated password success.");
                        return res.redirect('back');
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            } else {
                req.flash("error", "Passwords current incorrect.");
                return res.redirect('back');
            }
        });
    });
}
//function check email
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}
//function check login
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/upload/avatar')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'file/png' ||
        file.mimetype === 'file/jpg' ||
        file.mimetype === 'file/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

var upLoad = multer({ storage: storage }, { fileFilter: fileFilter });

router.get('/upload/:id',
    function(req, res) {
        res.render('profile.ejs');
    });
router.post('/upload/:id', upLoad.single("file"), function(req, res) {
    console.log(req.file);
    const image = req.file;
    User.findById(req.session.passport.user, (err, user) => {
            if (image) {
                user.imageUrl = "/upload/avatar/" + path.basename(image.path);
            } else {
                user.imageUrl = "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png";
            }
            user.save()
                .then(user => {
                    req.flash(
                        "success_msg",
                        "You are reset avatar success.")
                    return res.redirect('/profile/:id');
                })
        })
        .catch(err => console.log(err))
});
module.exports = router;