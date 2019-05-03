var loginIO = require("./loginIO");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");

var app = express();
var IO = new loginIO();
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
        IO.store(username, password).then().catch(() => {
        response.send("Entered an existing username!");
        response.end();
        });
    }
})

app.listen(3000);