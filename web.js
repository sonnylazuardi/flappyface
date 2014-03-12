var express = require("express");
var logfmt = require("logfmt");
var path = require('path');
var app = express();

app.use(logfmt.requestLogger());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

var port = Number(process.env.PORT || 80);
app.listen(port, function() {
  console.log("Listening on " + port);
});