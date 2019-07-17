const express = require("express");
const router = express.Router();
const Topic = require("../models/topic");

router.get("/", (req, res) => {
    Topic.find({}, (err, topics) => {
      if (err) {
        console.log(err);
      } else {
        res.render("partials/header", { topics: topics });
      }
    });
  });

  module.exports = router;