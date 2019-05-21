const mysql = require('mysql');
const fs = require('fs');

const mysql_setting = JSON.parse(fs.readFileSync(__dirname + "/setting.json")).mysql;

/**
 * A function for handling messages
 */
module.exports = class {
    /**
     * Initialize the class
     */
    constructor() {
        this.con = mysql.createConnection(mysql_setting);
    }

    /**
     * Store the message in the database
     * @param {String} message 
     * @param {String} to
     * @param {String} from
     * @param {INT} chatid
     * @param {INT} timestamp
     */
    storeMessage(to, from, message, chatid, timestamp) {
        return new Promise((resolve, reject) => {
            let con = this.con;
            con.connect(function (err) {
                if (err) {
                    console.log(err);
                    reject("Connection Failed");
                }
            });
            let sql = `INSERT INTO chat (username, chatid, timestamp, message) VALUES \('${to}', '${from}', '${chatid}', '${timestamp}', '${message}')`;
            con.query(sql, (err, res, field) => {
                con.end();
                if (err) {
                    console.log(err);
                    reject("Query Failed");
                } else {
                    console.log("Successfully inserted message");
                    resolve("Success");
                }
            })
        })
    }

    /**
     * Retrieve all the messages of an instance of a chat between two users
     * @param {INT} chatid
     */
    retrieveMessages(chatid) {
        return new Promise((resolve, reject) => {
            let con = this.con;
            con.connect(function (err) {
                if (err) {
                    console.log(err)
                }
            });
            let sql = `SELECT * FROM chat WHERE chatid='${chatid}'`
            con.query(sql, (err, res, field) => {
                con.end();
                if (err) {
                    console.log(err);
                    reject("Query failed");
                } else {
                    console.log("Successfully retrieved messages");
                    resolve(res);
                }
            })
        })
    } 

    /**
     * Retrieve all the appropriate chatids associate with a user
     * @param {STRING} username
     * @param {INT} chatid
     */
    getAllConversations(username, chatid) {
        return new Promise((resolve, reject) => {
            let con = this.con;
            con.connect(function (err) {
                if (err) {
                    console.log(err)
                }
            });
            let sql = `SELECT * FROM chat WHERE chatid='${chatid} AND username1='${username}' OR username2='${username}'`
            con.query(sql, (err, res, field) => {
                con.end();
                if (err) {
                    console.log(err);
                    reject("Query failed");
                } else {
                    console.log("Successfully retrieved chatids");
                    resolve(res);
                }
            })
        })
    }
}
 
