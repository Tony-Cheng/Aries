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
     * @param {STRING} username1
     * @param {STRING} username2
     */
    getAllConversations(username1, username2) {
        return new Promise((resolve, reject) => {
            let con = this.con;
            con.connect(function (err) {
                if (err) {
                    console.log(err)
                }
            });
            let sql = `SELECT * FROM chat WHERE username1='${username1}' OR username2='${username2}'`
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

    /**
     * Store new chatid of a conversation between two users.
     * @param {STRING} username1
     * @param {STRING} username2
     * @param {INT} chatid
     */
    storeNewConversation(username1, username2, chatid) {
        return new Promise((resolve, reject) => {
            let con = this.con;
            con.connect(function (err) {
                if (err) {
                    console.log(err);
                }
            });
            let sql = `INSERT INTO chatids (username1, username2, chatid) VALUES \('${username1}', '${username2}', '${chatid}')`;
            con.query(sql, (err, res, field) => {
                con.end();
                if (err) {
                    console.log(err);
                    reject("Query Failed");
                } else {
                    console.log("Successfully inserted new conversation");
                    resolve("Success");
                }
            })
        })
    }
}
 
