const express = require("express");
const router = express.Router();
var Notifi = require("../models/notifi");

router.post("/", (req, res) => {
  var datas = req.body.data;
  Notifi.find({ _id: { $in: datas } })
    .populate("questionId")
    .populate("author")
    .sort({ creationDate: -1 })
    .limit(25)
    .exec((err,noti)=>{
        res.send(noti);
    })
});
module.exports = router;
