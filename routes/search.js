const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Topic = require("../models/topic");
const User = require("../models/user");
const Search = require("../models/search");

router.get("/:text", (req, res) => {
  var value = req.params.text;
  Search.find(
    { name: { $regex: new RegExp(value,"i") } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(10)
    .exec((err, searchResult) => {
      if (err) {
        console.log(err);
      } else {
        res.send(searchResult);
      }
    });
});

module.exports = router;
