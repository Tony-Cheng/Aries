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

    async create_two_chat_group(user_id1, user_id2) {
        return create_chat_group_for_users(user_id1, user_id2, this.settings.mysql_settings, this.settings.mongo_settings);
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
    });
}

async function create_chat_group_for_users(users_ids, mysql_settings, mongo_settings) {
    let chat_id = await create_chat(mysql_settings);
    for (let i = 0; i < users_ids.length; i++) {
        await create_chat_group(users_ids[i], users_ids, chat_id, mongo_settings);
    }
    return chat_id;
}

async function create_chat_group(primary_user_id, user_ids, chat_id, mongo_settings) {
    let url = `mongodb://${mongo_settings.host}:27017`;
    let values = { primary_user_id = primary_user_id, user_ids = user_ids, chat_id = chat_id };
    let client = await MongoClient.connect(url);
    let db = await client.db(mongo_settings.database);
    let chat_groups = await db.collection('chat_groups');
    await chat_groups.insert(values);
    return;
}

async function create_chat(mysql_settings) {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(mysql_settings);
        connection.connect(function (error) {
            if (error) return reject(error);
            connection.query('INSERT INTO chats SET ?', {}, function (error, results, fields) {
                if (error) return reject(error);
                return resolve(results.insertId);
            });
        });
    });
}

