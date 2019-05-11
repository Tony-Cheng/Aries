

exports.register = function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) { 
        IO.store(username, password).then().catch(() => {
        response.send("Entered an existing username!");
        response.end();
        });
    }
}