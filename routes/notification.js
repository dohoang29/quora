var Notifi = require('../models/notifi');
router.get("/notification/:id", (req, res) => {
    res.render("feed", {});
});
//send notifi
router.post("/notification/:id", (req, res) => {
    User.findOne({
            _id: req.params.id
        })
        .populate("question")
        .exec((err, user) => {
            if (err) {
                console.log(err);
            } else {
                console.log(question.followers);
            }
        });
})