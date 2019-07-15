// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // Trang chủ (có các url login) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('login.ejs'); // 
    });
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/readpage',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // =====================================
    // Đăng ký ==============================
    // =====================================
    // hiển thị form đăng ký
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // Xử lý form đăng ký ở đây
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/readpage', // Điều hướng tới trang hiển thị readpage
        failureRedirect: '/signup', // Trở lại trang đăng ký nếu lỗi
        failureFlash: true
    }));

    // =====================================
    // Thông tin user đăng ký =====================
    // =====================================
    app.get('/readpage', isLoggedIn, function(req, res) {
        res.render('readpage.ejs', {
            user: req.user // truyền đối tượng user cho readpage.ejs để hiển thị lên view
        });
    });

    // =====================================
    // Đăng xuất ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/profilePage', function(req, res) {
        res.render('profilePage.ejs'); // 
    });

};

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}