const mysql = require('mysql')
const api = require('../utils/api')

var currently_checking = new Set();

exports.UNKNOWN = 0;
exports.NOTTOXIC = 1;
exports.TOXIC = 2;

exports.classify_message = async (message_id, settings) => {
    let mysql_settings = settings.mysql;
    if (currently_checking.has(message_id)) return exports.UNKNOWN;
    currently_checking.add(message_id);
    let result = await isToxic(message_id, mysql_settings);
    if (result.isCLassified) {
        if (result.isToxic) return exports.TOXIC;
        else return exports.NOTTOXIC;
    }
    let isToxic = await api.isToxic(settings.toxicity_api_endpoint, result.text);
    result.isCLassified = true;
    result.isToxic = isToxic;
    await updateToxicity(result, mysql_settings);
    if (isToxic)
        return exports.TOXIC;
    else
        return exports.NOTTOXIC;
}

function isToxic(message_id, mysql_settings) {
    return new Promise((resolve, reject) => {
        let con = mysql.createConnection(mysql_settings);
        con.connect(function (err) {
            if (err) return reject(err);
            con.query('SELECT * FROM `messages` WHERE `message_id` = ?', [message_id], function (error, results, fields) {
                con.end();
                if (error) return reject(error);
                if (results.length) return reject(`No message with message_id ${message_id} is found.`)
                return resolve(results[0]);
            });
        });
    });
}

function updateToxicity(values, mysql_settings) {
    return new Promise((resolve, reject) => {
        let con = mysql.createConnection(mysql_settings);
        con.connect(function (err) {
            if (err) return reject(err);
            connection.query('UPDATE messages SET isClassified = ?, isToxic = ? WHERE message_id = ?',
                [values.isCLassified, values.isToxic, values.message_id], function (error, results, fields) {
                    if (error) return reject(error);
                    return resolve();
                });
        });
    });
}