var loginIO = require("./loginIO");

exports.login = function(request, response) {
    var IO = new loginIO();
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) { 
        IO.check(username, password).then().catch((err) => {
        response.send(err);
        response.end();
        });
    }
}

exports.register = function(request, response) {
    var IO = new loginIO();
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) { 
        IO.store(username, password).then().catch(() => {
        response.send("Entered an existing username!");
        response.end();
        });
    }
}