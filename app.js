const express = require("express");
const ip = require("ip");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
//const LocalStrategy = require("passport-local");

// const comment = require("./models/comment");
// const answer = require("./models/answer");
const Question = require("./models/question");
// const search = require("./models/search");
const Topic = require("./models/topic");
// const user = require("./models/user");

const app = express();
const ipAdress = process.env.ip || ip.address();
const port = process.env.port || 3000;

const indexRoutes = require("./routes/index"),
  accountsRoutes = require("./routes/accounts"),
  commentsRoutes = require("./routes/comments"),
  postsRoutes = require("./routes/newFeed"),
  searchRoutes = require("./routes/search"),
  topicsRoutes = require("./routes/topics");

mongoose.connect("mongodb+srv://hoang:Uxgyr9RspAYQkUtD@cluster0-7nvfn.mongodb.net/test");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",indexRoutes);
//app.use("/feed",postsRoutes);
app.use("/topic/:id",topicsRoutes);
// app.use("/posts/",postsRoutes);
// app.use("/search/",searchRoutes);
// app.use("/topics/",topicsRoutes);

app.listen(port, ipAdress, () => {
  console.log("Server is listening at " + ipAdress + ":" + port);
});
