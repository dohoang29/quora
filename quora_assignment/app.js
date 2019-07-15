// server.js
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect database 

require('./config/passport')(passport); // 

// Config app express
app.use(morgan('dev')); // sử dụng để log mọi request ra console
app.use(cookieParser()); // sử dụng để đọc thông tin từ cookie
app.use(bodyParser()); // lấy thông tin từ form HTML
app.set('view engine', 'ejs'); // chỉ định view engine là ejs
app.use(express.static('public'));

app.use(session({ secret: 'xxxxxxxxxxxxx' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/routes.js')(app, passport); // load các routes từ các nguồn

app.listen(port);