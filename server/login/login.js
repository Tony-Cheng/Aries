var loginDB = require("./loginDB");

module.exports = class {

    constructor(mysql_pool) {
        this.mysql_pool = mysql_pool;
    }

    login(request, response) {
        let username = request.body.username;
        let password = request.body.password;
        response.setHeader('content-type', 'application/json');
        if (username && password) {
            this.mysql_pool.getConnection((error, mysql_con) => {
                if (error) return reject(error);
                loginDB.check(username, password, mysql_con)
                    .then((res) => {
                        request.session.loggedIn = true;
                        request.session.username = username;
                        request.session.user_id = res;
                        response.end(JSON.stringify({ status: "Success", user_id: res, username: username }))
                        mysql_con.release();

                    })
                    .catch((err) => {
                        console.log(err)
                        response.end(JSON.stringify({ status: "Incorrect username or password!" }));
                        mysql_con.release();
                    });
            })
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
            this.mysql_pool.getConnection((error, mysql_con) => {
                if (error) return reject(error);
                loginDB.store(username, password, mysql_con)
                    .then(() => {
                        response.end(JSON.stringify({ status: "Success" }));
                        mysql_con.release();
                    })
                    .catch(() => {
                        response.end(JSON.stringify({ status: "Entered an existing username!" }));
                        mysql_con.release();
                    });
            });
        }
        else {
            response.end(JSON.stringify({ status: "Username and password cannot be empty!" }));
        }
    }

    retrieve_all_users() {
        return new Promise((resolve, reject) => {
            this.mysql_pool.getConnection((error, mysql_con) => {
                if (error) return reject(error);
                let sql = 'SELECT user_id, username FROM login';
                mysql_con.query(sql, (error, results, fields) => {
                    mysql_con.release();
                    if (error) return reject(error);
                    return resolve(results);
                });
            });
        });

    }

    async rerieve_usernames(user_ids) {
        let usernames = [];
        for (let i = 0; i < user_ids.length; i++) {
            usernames.push(get_connection(this.mysql_pool)
                .then((mysql_con) => {
                    return retrieve_username(user_ids[i], mysql_con)
                        .then(username => {
                            mysql_con.release();
                            return username;
                        });
                })
            );
        }
        for (let i = 0; i < user_ids.length; i++) {
            usernames[i] = await usernames[i];
        }
        return usernames;
    }
}

function retrieve_username(user_id, mysql_con) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM login WHERE user_id = ?';
        mysql_con.query(sql, [user_id], function (error, results, fields) {
            if (error) return reject(error);
            return resolve(results[0].username);
        });
    });
}

function get_connection(mysql_pool) {
    return new Promise((resolve, reject) => {
        mysql_pool.getConnection((error, mysql_con) => {
            if (error) return reject(error);
            return resolve(mysql_con);
        });
    });
}