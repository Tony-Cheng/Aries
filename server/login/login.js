var loginIO = require("./loginIO");

module.exports = class {

    constructor(app) {
        this.app = app;
    }

    init_all() {
        this.init_paths();
    }

    init_paths() {
        this.app.post("/aries/server/register", (req, res) => {
            register(req, res);
        });
        this.app.post("/aries/server/login", (req, res) => {
            login(req, res);
        });
    }

}

function login(request, response) {
    var IO = new loginIO();
    var username = request.body.username;
    var password = request.body.password;
    response.setHeader('content-type', 'application/json');
    if (username && password) {
        IO.check(username, password).then(() => {
            request.session.loggedIn = true;
            request.session.username = username;
            response.end(JSON.stringify({ status: "Success" }))
        }).catch((err) => {
            response.end(JSON.stringify({ status: "Incorrect username or password!" }));
        });
    }
    else {
        response.end(JSON.stringify({ status: "Username and password cannot be empty!" }));
    }
}

function register(request, response) {
    var IO = new loginIO();
    var username = request.body.username;
    var password = request.body.password;
    response.setHeader('content-type', 'application/json');
    if (username && password) {
        IO.store(username, password).then(() => {
            response.end(JSON.stringify({ status: "Success" }));
        }).catch(() => {
            response.end(JSON.stringify({ status: "Entered an existing username!" }));
        });
    }
    else {
        response.end(JSON.stringify({ status: "Username and password cannot be empty!" }));
    }
}