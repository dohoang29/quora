const ip = require("ip");
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
// const cookieSession = require('cookie-session');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const multer = require('multer');
const moment = require("moment");
const key = require('./config/key');
require('./config/passport')(passport); // Passport Config

const answer = require("./models/answer");
const Question = require("./models/question");
const Topic = require("./models/topic");
const User = require("./models/user");
const Search = require("./models/search");
const port = process.env.port || 80;

const indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/users"),
    questionRoutes = require("./routes/question"),
    feedRoutes = require("./routes/newFeed"),
    answerRoutes = require("./routes/answer"),
    topicRoutes = require("./routes/topics"),
    searchRoutes = require("./routes/search"),
    adminRoutes = require("./routes/admin"),
    notiRoutes = require("./routes/notification");
    
mongoose.connect("mongodb+srv://hoang:uANMPpiOnhRKAGi6@cluster0-7nvfn.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
app.use(cookieParser('secret'));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(methodOverride("_method"));
// app.use(cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     key: [key.session.cookieKey]
// }));

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
    Topic.find().limit(10).populate("followers").populate("answers").populate("questions").exec((err, topics) => {
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
app.use("/search", searchRoutes);
app.use("/noti",notiRoutes);
app.get('*',function(req,res){
    res.render("404.ejs");
});
app.listen(port,ip.address, () => {
    console.log("Server is listening at:" + port);
});
