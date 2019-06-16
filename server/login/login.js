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
        // this.app.post("/aires/server/login", (req, res) => {
        //   login(req, res);
        // });
    }

}

function login(request, response) {
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

function register(request, response) {
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