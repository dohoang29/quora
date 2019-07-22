const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) =>
    res.render('login'));

// feed
router.get('/feed', ensureAuthenticated, (req, res) =>
    res.render('feed', {
        user: req.user
    })
);

module.exports = router;