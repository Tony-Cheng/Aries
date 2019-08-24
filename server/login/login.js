var loginDB = require("./loginDB");

module.exports = class {

    constructor(app, mysql_con) {
        this.app = app;
        this.mysql_con = mysql_con;
    }

    init_all() {
        this.init_paths();
    }

    init_paths() {
        let mysql_con = this.mysql_con;
        this.app.post("/aries/server/register", (req, res) => {
            register(req, res, mysql_con);
        });
        this.app.post("/aries/server/login", (req, res) => {
            login(req, res, mysql_con);
        });
    }

}

function login(request, response, mysql_con) {
    var db = new loginDB(mysql_con);
    var username = request.body.username;
    var password = request.body.password;
    response.setHeader('content-type', 'application/json');
    if (username && password) {
        db.check(username, password).then((res) => {
            request.session.loggedIn = true;
            request.session.username = username;
            request.session.user_id = res;
            response.end(JSON.stringify({ status: "Success" , user_id: res, username: username}))
        }).catch((err) => {
            response.end(JSON.stringify({ status: "Incorrect username or password!" }));
        });
    }
    else {
        response.end(JSON.stringify({ status: "Username and password cannot be empty!" }));
    }
}

function register(request, response, mysql_con) {
    var db = new loginDB(mysql_con);
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