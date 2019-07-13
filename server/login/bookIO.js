const { SHA3 } = require('sha3');
const mysql = require('mysql');
const fs = require('fs');
const hash = new SHA3(256);

const knex = require('../testSetup').knex;
const dbs = require('../testdbs');
const loginDB = dbs.loginDB;

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
    }

    /**
    * Store the username and password in the MySQL database.
    * @param {String} user the username 
    * @param {String} pass the password
    */
    store(user, pass) {
        return new Promise((resolve, reject) => {
            let hash_pass = hash_SHA3(pass);
            let res = loginDB.forge({'username' : user, 'password' : pass}).save().catch(function (e) {
                console.log(`Query Failed: ${e}`);
                reject(`Query Failed : ${e}`);
            }).then(function() {
                resolve("Inserted correctly");
            })
        });
    }

    /**
     * Return true if the username and password matches the record stored in the database.
     * @param {String} user the username
     * @param {String} pass the password
     */
    check(user, pass) {
        return new Promise((resolve, reject) => {
            let hash_pass = hash_SHA3(pass);
            let res = loginDB.where({'username' : user}).fetch().then(function(p) {
                console.log(p.toJSON()['password']);
                if (hash_pass == p.toJSON()['password']) {
                    console.log('Username and password matched');
                    resolve('Correct');
                } else {
                    reject('incorrect password');
                }
            }).catch(function (e) {
                console.log(`Error: ${e}`);
                reject(`Error: ${e}`);
            })
        });
    }
}

