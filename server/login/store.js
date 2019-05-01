const { SHA3 } = require('sha3');
const mysql = require('mysql');

const hash = new SHA3(256);

/**
 * Create a connection to the MySQL server.
 */
var con = mysql.createConnection({
    host: "localhost",
    user: "server_test",
    password: "Testserver123!",
    database: "Aries"
});


/**
 * Return the hash value of the password
 * @param {String} pass the password
 */
function hash_SHA3(pass) {
    hash.update(pass);
    return hash.digest(encoding = 'hex');
}

/**
 * Register the username and password in the MySQL database.
 * @param {String} user the username 
 * @param {String} pass the password
 */
exports.register = async (user, pass) => {
    let hash_pass = hash_SHA3(pass);
    con.connect(function (err) {
        if (err) {
            console.log(err)
            throw Error('Connection failed');
        }
    });
    let sql = `INSERT INTO login (username, password) VALUES \('${user}', '${hash_pass}'\)`;
    con.query(sql, function (err, res) {
        con.end();
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                console.log('Query failed: duplicated username');
                throw Error('username already exists');
            }
            else {
                console.log(err);
                throw Error('Query failed')
            }
        }
        else {
            console.log("1 record inserted");
            return;
        }
    });
}

// for testing purposes
// exports.register("user7", "abcdef");