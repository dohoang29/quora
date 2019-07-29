const express = require("express");
const router = express.Router();
const Topic = require("../models/topic");
const { ensureAuthenticated } = require("../config/auth");

router.get("/:id", ensureAuthenticated, (req, res) => {
  Topic.findById(req.params.id, (err, topic) => {
    if (err) {
      console.log(err);
    } else {
      res.render("topicPage", { topic: topic });
    }
  });
});

router.get("/:topicId/:userId/:action", (req, res) => {
  var topicId = req.params.topicId;
  var userId = req.params.userId;
  var action = req.params.action;
  var count;
  Topic.findById(topicId, (err, topic) => {
    if (err) {
      console.log(err);
    } else {
      if (action === "Follow") {
        topic.followers.push(userId);
        topic.save();
        count = topic.followers.length.toString();
        action = "Unfollow";
      } else {
        for (var i = 0; i < topic.followers.length; i++) {
          if (topic.followers[i] == userId) {
            topic.followers.splice(i, 1);
          }
        }
        topic.save();
        count = topic.followers.length.toString();
        action = "Follow";
      }
      var follow = { count: count, status: action };
      return res.send(follow);
    }
  });
});
module.exports = router;
