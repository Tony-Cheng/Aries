const api = require('../utils/api')

var currently_checking = new Set();

exports.UNKNOWN = 0;
exports.NOTTOXIC = 1;
exports.TOXIC = 2;

exports.classify_message = async (message_id, mysql_con, toxicity_api) => {
    if (currently_checking.has(message_id)) return exports.UNKNOWN;
    currently_checking.add(message_id);
    let result = await checkToxicity(message_id, mysql_con);
    if (result.isCLassified) {
        if (result.isToxic) return exports.TOXIC;
        else return exports.NOTTOXIC;
    }
    let isToxic = await api.isToxic(toxicity_api, result.text);
    result.isCLassified = true;
    result.isToxic = isToxic;
    await updateToxicity(result, mysql_con);
    if (isToxic)
        return exports.TOXIC;
    else
        return exports.NOTTOXIC;
}

function checkToxicity(message_id, mysql_con) {
    return new Promise((resolve, reject) => {
        mysql_con.query('SELECT * FROM `messages` WHERE `message_id` = ?', [message_id], function (error, results, fields) {
            if (error) return reject(error);
            if (results.length == 0) return reject(`No message with message_id ${message_id} is found.`)
            return resolve(results[0]);
        });
    });
}

function updateToxicity(values, mysql_con) {
    return new Promise((resolve, reject) => {
        mysql_con.query('UPDATE messages SET isClassified = ?, isToxic = ? WHERE message_id = ?',
            [values.isCLassified, values.isToxic, values.message_id], function (error, results, fields) {
                if (error) return reject(error);
                return resolve();
            });
    });
}