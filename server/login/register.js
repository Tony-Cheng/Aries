var store = require("./store.js");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");

var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/register.html'))
});

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) { 
        store.register(username, password).catch(function(err){}).then(function(res){});
    }
})
app.listen(3000);