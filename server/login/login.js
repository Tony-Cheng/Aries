var loginDB = require("./loginDB");

module.exports = class {

    constructor(app, mysql_settings) {
        this.app = app;
        this.mysql_settings = mysql_settings;
    }

    init_all() {
        this.init_paths();
    }

    init_paths() {
        let mysql_settings = this.mysql_settings;
        this.app.post("/aries/server/register", (req, res) => {
            register(req, res, mysql_settings);
        });
        this.app.post("/aries/server/login", (req, res) => {
            login(req, res, mysql_settings);
        });
    }

}

function login(request, response, mysql_settings) {
    var db = new loginDB(mysql_settings);
    var username = request.body.username;
    var password = request.body.password;
    response.setHeader('content-type', 'application/json');
    if (username && password) {
        db.check(username, password).then(() => {
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

function register(request, response, mysql_settings) {
    var db = new loginDB(mysql_settings);
    var username = request.body.username;
    var password = request.body.password;
    response.setHeader('content-type', 'application/json');
    if (username && password) {
        db.store(username, password).then(() => {
            response.end(JSON.stringify({ status: "Success" }));
        }).catch(() => {
            response.end(JSON.stringify({ status: "Entered an existing username!" }));
        });
    }
    else {
        response.end(JSON.stringify({ status: "Username and password cannot be empty!" }));
    }
}