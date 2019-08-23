const mysql = require('mysql');
const toxicity_classification = require('./toxicity_classification');
const MongoClient = require('mongodb').MongoClient;


module.exports = class {
    constructor(settings) {
        this.settings = settings;
    }

    async send_message(text, user_id, chat_id) {
        let results = await store_message(text, user_id, chat_id, this.settings.mysql);
        let toxicity_status = await toxicity_classification.classify_message(results.insertId, this.settings);
    }
    
    async create_two_chat_group() {
        
    }

}

function store_message(text, user_id, chat_id, mysql_settings) {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(mysql_settings);
        connection.connect(function (error) {
            if (error) return reject(error);
            let time = new Date().toISOString().slice(0, 19).replace('T', ' ');
            values = { text: text, user_id: user_id, chat_id: chat_id, isClassified: false, isToxic: false, time: time };
            connection.query('INSERT INTO messages SET ?', values, function (error, results, fields) {
                if (error) return reject(error);
                return resolve(results);
            });
        });
    })
}

async function create_chat_group_for_users(users, mongo_settings) {
    for (let i = 0; i < users.length; i++) {

    }
}

function create_chat_group(user, users, mongo_settings) {
    const url = `mongodb://${mongo_settings.host}:27017`;
    return new Promise((reject))
}

