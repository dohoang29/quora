const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/', (req, res) => {
    User.find((err, users) => {
        if (!err) {
            res.render("admin/list", { users: users })
        } else {
            console.log('Error in retrieving user list :' + err);
        }
    });
});
router.get('/add', (req, res) => {
    res.render("admin/add")
});
//
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (!err) {
            res.render("admin/edit", { user: user })
        }
    });
});
//
router.get('/resetPassword/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (!err) {
            res.render("admin/resetPassword", { user: user })
        }
    });
});

router.post('/add', (req, res) => {
    const {
        firstname,
        lastname,
        email,
        password
    } = req.body;
    let errors = [];
    if (!firstname || !lastname || !email || !password) {
        req.flash('error', 'Please enter full feild.');
        console.log('teof;')
        res.redirect('/admin/add');
    }
    if (password.length < 6) {
        req.flash('error', 'Password must be at least 6 characters');
        res.redirect('/admin/add');
    } else {
        User.findOne({
            email: email
        }).then(user => {
            if (user) {
                errors.push({
                    msg: 'Email already exists'
                });
                res.render('admin/add', {
                    errors,
                    firstname,
                    lastname,
                    email,
                    password,

                });
            } else {
                var user = new User();
                user.firstname = req.body.firstname;
                user.lastname = req.body.lastname;
                user.email = req.body.email;
                user.password = bcrypt.hashSync(req.body.password, 10);

                user.save((err, user) => {
                    if (!err)
                        res.redirect('/admin');
                    else {
                        if (err.name == 'ValidationError') {
                            handleValidationError(err, req.body);
                            res.render("user/add", {});
                        } else
                            console.log('Error during record insertion : ' + err);
                    }
                });
            }
        })
    }
});
router.post('/', (req, res) => {
    updateRecord(req, res);
});
//edit
function updateRecord(req, res) {
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, user) => {
        if (!err) { res.redirect('/admin'); } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("admin/edit", {});
            } else
                console.log('Error during record update : ' + err);
        }
    });
}

//reset password
router.post('/resetPassword/:id', (req, res) => {
        const {
            password
        } = req.body;
        let errors = [];
        if (req.body.password === req.body.password2) {
            User.findOne({ _id: req.params.id }, (err, user) => {
                user.password = bcrypt.hashSync(password, 10);
                user.save();
                console.log(user.password);
                res.redirect('/admin');
                req.flash(
                    'success_msg',
                    'You are now reseted password')
            })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
    })
    //
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}
//

// function resetRecord(req, res) {
//     User.findOneAndUpdate({ _id: req.body._id }, bcrypt.hashSync(req.body.password, 10), { new: true }, (err, user) => {
//         if (!err) { res.redirect('/admin'); } else {
//             if (err.name == 'ValidationError') {
//                 handleValidationError(err, req.body);
//                 res.render("admin/resetPassword", { user: user })
//             } else
//                 console.log('Error during record update : ' + err);
//         }
//     });
// }
// //
router.get('/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (!err) {
            res.redirect('/admin');
        } else { console.log('Error in user delete :' + err); }
    });
});

module.exports = router;