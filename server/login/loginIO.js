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
    hash.reset();
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
    store(user, pass) {
        return new Promise((resolve, reject) => {
            let hash_pass = hash_SHA3(pass);
            let con = this.con
            con.connect(function (err) {
                if (err) {
                    console.log(err)
                    reject('Connection failed');
                }
            });
            let sql = `INSERT INTO login (username, password) VALUES \('${user}', '${hash_pass}'\)`;
            con.query(sql, (err, res, field) => {
                con.end();
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        console.log('Query failed: duplicated username');
                        reject('Username already exists');
                    }
                    else {
                        console.log(err);
                        reject('Query failed')
                    }
                }
                else {
                    console.log("A pair of username and password is inserted.");
                    resolve('Success');
                }
            });
        });
    }

    check(user, pass) {
        return new Promise((resolve, reject) => {
            let con = this.con
            let hash_pass = hash_SHA3(pass)
            con.connect(function (err) {
                if (err) {
                    console.log(err)
                    return reject('Connection failed');
                }
            });
            let sql = `SELECT * FROM login WHERE username = '${user}'`;
            con.query(sql, (err, res, field) => {
                con.end()
                if (err) {
                    console.log('err')
                    reject('Query failed')
                }
                else {
                    if (res.length == 0) {
                        reject('No such user')
                    }
                    else {
                        let retrieved_pass = res[0].password
                        if (retrieved_pass == hash_pass) {
                            console.log('Username and password matched')
                            resolve('Correct')
                        }
                        else {
                            console.log('Username and password do not match')
                            reject('Incorrect password')
                        }
                    }
                }
            });
        });
    }

}