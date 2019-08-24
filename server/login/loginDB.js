const { SHA3 } = require('sha3');
const hash = new SHA3(256);

/**
 * Return the hash value of the password
 * @param {String} pass the password
 */
function hash_SHA3(pass) {
    hash.reset();
    hash.update(pass);
    return hash.digest(encoding = 'hex');
}

/**
* Store the username and password in the MySQL database.
* @param {String} user the username 
* @param {String} pass the password
*/
exports.store = (user, pass, mysql_con) => {
    return new Promise((resolve, reject) => {
        let hash_pass = hash_SHA3(pass);
        let sql = `INSERT INTO login (username, password) VALUES \('${user}', '${hash_pass}'\)`;
        mysql_con.query(sql, (err, res, field) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY') {
                    return reject('Username already exists');
                }
                else {
                    return reject('Query failed')
                }
            }
            else {
                return resolve('Success');
            }
        });
    });
}

/**
 * Return true if the username and password matches the record stored in the database.
 * @param {String} user the username
 * @param {String} pass the password
 */
exports.check = (user, pass, mysql_con) => {
    return new Promise((resolve, reject) => {
        let hash_pass = hash_SHA3(pass)
        let sql = `SELECT * FROM login WHERE username = '${user}'`;
        mysql_con.query(sql, (err, res, field) => {
            if (err) {
                return reject('Query failed')
            }
            else {
                if (res.length == 0) {
                    return reject('No such user')
                }
                else {
                    let retrieved_pass = res[0].password
                    if (retrieved_pass == hash_pass) {
                        return resolve(res[0].user_id)
                    }
                    else {
                        return reject('Incorrect password');
                    }
                }
            }
        });
    });
}

