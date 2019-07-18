const express = require("express");
const router = express.Router();
const Topic = require("../models/topic");

router.get("/", (req, res) => {
  res.redirect("feed");
});

module.exports = router;
