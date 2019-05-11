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
     * @param {String} username
     * @param {INT} chatid
     * @param {INT} timestamp
     */
    storeMessage(username, message, chatid, timestamp) {
        return new Promise((resolve, reject) => {
            let con = this.con;
            con.connect(function (err) {
                if (err) {
                    console.log(err);
                    reject("Connection Failed");
                }
            });
            let sql = `INSERT INTO chat (username, chatid, timestamp, message) VALUES \('${username}', '${message}', '${chatid}', '${timestamp}')`;
            con.query(sql, (err, res, field) => {
                con.end();
                if (err) {
                    
                }
            })
        })
    }

}
 
