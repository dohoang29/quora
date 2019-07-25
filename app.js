const ip = require("ip");
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const moment = require("moment");

require('./config/passport')(passport); // Passport Config

const answer = require("./models/answer");
const Question = require("./models/question");
const Topic = require("./models/topic");
const app = express();
const ipAdress = process.env.ip || ip.address();
const port = process.env.port || 3000;

const indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/users"),
    questionRoutes = require("./routes/question"),
    feedRoutes = require("./routes/newFeed"),
    answerRoutes = require("./routes/answer"),
    topicRoutes = require("./routes/topics");
adminRoutes = require("./routes/admin")

mongoose.connect("mongodb+srv://hoang:uANMPpiOnhRKAGi6@cluster0-7nvfn.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
app.use(cookieParser('secret'));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    Topic.find().populate("followers").populate("answers").populate("questions").exec((err, topics) => {
        if (err) {
            console.log(err);
        } else {
            res.locals.topics = topics;
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error');
            res.locals.moment = moment;
            res.locals.currentUser = req.user;
            next();
        }
    });
});


app.use('/', userRoutes);
app.use('/', indexRoutes);
app.use("/feed", feedRoutes);
app.use("/topic", topicRoutes);
app.use("/answer", answerRoutes);
app.use("/admin", adminRoutes);
app.use("/question", questionRoutes);

app.listen(port, ipAdress, () => {
    console.log("Server is listening at " + ipAdress + ":" + port);
});