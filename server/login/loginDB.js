const { SHA3 } = require('sha3');
const mysql = require('mysql');
const fs = require('fs')
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
 * A class for handling 
 */
module.exports = class {
    /**
     * Initialize this class.
     */
    constructor(mysql_con) {
        this.mysql_con = mysql_con;
    }

    /**
    * Store the username and password in the MySQL database.
    * @param {String} user the username 
    * @param {String} pass the password
    */
    store(user, pass) {
        return new Promise((resolve, reject) => {
            let hash_pass = hash_SHA3(pass);
            let sql = `INSERT INTO login (username, password) VALUES \('${user}', '${hash_pass}'\)`;
            this.mysql_con.query(sql, (err, res, field) => {
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

    /**
     * Return true if the username and password matches the record stored in the database.
     * @param {String} user the username
     * @param {String} pass the password
     */
    check(user, pass) {
        return new Promise((resolve, reject) => {
            let hash_pass = hash_SHA3(pass)
            let sql = `SELECT * FROM login WHERE username = '${user}'`;
            this.mysql_con.query(sql, (err, res, field) => {
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
                            //resolve('Correct')
                            resolve(res[0].user_id)
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