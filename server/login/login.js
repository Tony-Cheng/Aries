var loginDB = require("./loginDB");

module.exports = class {

    constructor(mysql_con) {
        this.mysql_con = mysql_con;
    }

    login(request, response) {
        let username = request.body.username;
        let password = request.body.password;
        response.setHeader('content-type', 'application/json');
        if (username && password) {
            loginDB.check(username, password, this.mysql_con)
                .then((res) => {
                    request.session.loggedIn = true;
                    request.session.username = username;
                    request.session.user_id = res;
                    response.end(JSON.stringify({ status: "Success", user_id: res, username: username }))
                })
                .catch((err) => {
                    response.end(JSON.stringify({ status: "Incorrect username or password!" }));
                });
        }
        else {
            response.end(JSON.stringify({ status: "Username and password cannot be empty!" }));
        }
    }

    register(request, response) {
        var username = request.body.username;
        var password = request.body.password;
        response.setHeader('content-type', 'application/json');
        if (username && password) {
            loginDB.store(username, password, this.mysql_con)
                .then(() => {
                    response.end(JSON.stringify({ status: "Success" }));
                })
                .catch(() => {
                    response.end(JSON.stringify({ status: "Entered an existing username!" }));
                });
        }
        else {
            response.end(JSON.stringify({ status: "Username and password cannot be empty!" }));
        }
    }

    retrieve_all_users() {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT user_id, username FROM login';
            this.mysql_con.query(sql, (error, results, fields) => {
                if (error) return reject(error);
                return resolve(results);
            })
        })
    }
}
