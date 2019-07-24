const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
// Load User model
const User = require("../models/User");
const config = require("../config/mailler");
const { forwardAuthenticated } = require("../config/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));
// Register Page
<<<<<<< HEAD
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
//profile
router.get('/profile', function(req, res) {
    res.render('profile.ejs');
});
=======
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("register")
);

>>>>>>> 551ef2c0107a1788c6ef1033e0f4d9808a98e516
// Register
router.post("/register", (req, res) => {
  const { firstname, lastname, email, password, password2 } = req.body;
  let errors = [];

  if (!firstname || !lastname || !email || !password || !password2) {
    errors.push({
      msg: "Please enter all fields"
    });
  }

  if (password != password2) {
    errors.push({
      msg: "Passwords do not match"
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: "Password must be at least 6 characters"
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
                  "You are now registered and can log in"
                );
                res.redirect("/login");
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
                    // return done(null, false, { message: 'This user is ban' });
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
                    user: config.MAIL_USER,
                    pass: config.MAIL_PASS
                }
            });
            var mailOptions = {
                to: user.email,
                from: config.MAIL_USER,
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
  User.findOne(
    {
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
                        console.log('password' + user.password + 'and the user is' + user)
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

module.exports = router;
