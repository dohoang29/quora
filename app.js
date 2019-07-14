var express = require("express");
var ip = require("ip");
var bodyParser = require("body-parser");

var app = express();
var ip = process.env.ip || ip.address();
var port = process.env.port || 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, ip, () => {
  console.log("Server is listening at " + ip + ":" + port);
});
