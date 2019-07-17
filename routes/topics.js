const express = require("express");
const router = express.Router();
const Topic = require("../models/topic");

router.get("/topic/:id", (req, res) => {
  Topic.findById(req.params.id, (err, topic) => {
    if (err) {
      console.log(err);
    } else {
      res.render("topicPage", { topic: topic });
    }
  });
});

module.exports = router;
