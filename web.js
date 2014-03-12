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
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(__dirname+'/public'));
app.use(express.session({
        secret: "flappyface"
}));

app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(80);
console.log("listening on http://localhost:80/");