var express = require("express");
var logfmt = require("logfmt");
var mongoose = require('mongoose');
var path = require('path');
var app = express();

mongoose.connect('mongodb://localhost/flappyface');

var userSchema = mongoose.Schema({
    fbid: String,
    name: String, 
    highscore: Number
});
var User = mongoose.model('User', userSchema);

app.use(logfmt.requestLogger());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

var port = Number(process.env.PORT || 80);
app.listen(port, function() {
  console.log("Listening on " + port);
});