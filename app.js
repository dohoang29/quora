const express = require("express");
const ip = require("ip");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const comment = require("./models/comment");
const post = require("./models/post");
const search = require("./models/search");
const topic = require("./models/topic");
const user = require("./models/user");

const app = express();
const ip = process.env.ip || ip.address();
const port = process.env.port || 3000;


const accountsRoutes = require("./routes/accounts"),
  commentsRoutes = require("./routes/comments"),
  postsRoutes = require("./routes/posts"),
  searchRoutes = require("./routes/search"),
  topicsRoutes = require("./routes/topics");

mongoose.connect("mongodb://localhost/quora");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/");
app.use("/accounts/",accountsRoutes);
app.use("/comments/",commentsRoutes);
app.use("/posts/",postsRoutes);
app.use("/search/",searchRoutes);
app.use("/topics/",topicsRoutes);


app.listen(port, ip, () => {
  console.log("Server is listening at " + ip + ":" + port);
});
