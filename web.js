var express = require('express');
    
// mongoose.connect('mongodb://localhost/flappyface');

// var userSchema = mongoose.Schema({
//     fbid: String,
//     name: String, 
//     highscore: Number
// });
// var User = mongoose.model('User', userSchema);


// Setup the Express.js server
var app = express();

app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(80);
console.log("listening on http://localhost:80/");