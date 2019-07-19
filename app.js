const express = require("express");
const ip = require("ip");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

//const LocalStrategy = require("passport-local");

// const comment = require("./models/comment");
const answer = require("./models/answer");
const Question = require("./models/question");
// const search = require("./models/search");
const Topic = require("./models/topic");
// const user = require("./models/user");

const app = express();
const ipAdress = process.env.ip || ip.address();
const port = process.env.port || 3000;

const indexRoutes = require("./routes/index"),
  //accountsRoutes = require("./routes/accounts"),
  //commentsRoutes = require("./routes/comments"),
  feedRoutes = require("./routes/newFeed"),
  answerRoutes = require("./routes/answer"),
  topicRoutes = require("./routes/topics");

mongoose.connect('mongodb://localhost:27017/quora', {useNewUrlParser: true});
//mongoose.connect("mongodb+srv://hoang:Uxgyr9RspAYQkUtD@cluster0-7nvfn.mongodb.net/test");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next)=>{
  Topic.find({}, (err, topics) => {
    if (err) {
      console.log(err);
    } else {
      res.locals.topics = topics;
      next();
    }
  });
});

app.use("/",indexRoutes);
app.use("/feed",feedRoutes);
app.use("/topic", topicRoutes);
app.use("/answer",answerRoutes);
// app.use("/search/",searchRoutes);



app.listen(port, ipAdress, () => {
  console.log("Server is listening at " + ipAdress + ":" + port);
});
