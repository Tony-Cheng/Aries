const { SHA3 } = require('sha3');
const mysql = require('mysql');
const fs = require('fs')

const hash = new SHA3(256);
const mysql_setting = JSON.parse(fs.readFileSync("../setting.json")).mysql;


/**
 * Return the hash value of the password
 * @param {String} pass the password
 */
function hash_SHA3(pass) {
    hash.update(pass);
    return hash.digest(encoding = 'hex');
}

/**
 * A class for handling 
 */
module.exports = class {
    /**
     * Initialize this class.
     */
    constructor() {
        this.con = mysql.createConnection(mysql_setting);
    }

    /**
    * Store the username and password in the MySQL database.
    * @param {String} user the username 
    * @param {String} pass the password
    */
    async store(user, pass) {
        let hash_pass = hash_SHA3(pass);
        let con = this.con
        con.connect(function (err) {
            if (err) {
                console.log(err)
                return Promise.reject('Connection failed');
            }
        });
        let sql = `INSERT INTO login (username, password) VALUES \('${user}', '${hash_pass}'\)`;
        con.query(sql, function (err, res) {
            con.end();
            if (err) {
                if (err.code == 'ER_DUP_ENTRY') {
                    console.log('Query failed: duplicated username');
                    return Promise.reject('Username already exists');
                }
                else {
                    console.log(err);
                    return Promise.reject('Query failed')
                }
            }
            else {
                console.log("A pair of username and password is inserted.");
                return Promise.resolve('Success');
            }
        });
    }

}