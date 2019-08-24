const mysql = require('mysql');
const toxicity_classification = require('./toxicity_classification');
const MongoClient = require('mongodb').MongoClient;


module.exports = class {
    constructor(mysql_con, mongo_con, toxicity_api) {
        this.mysql_con = mysql_con;
        this.mongo_con = mongo_con;
        this.toxicity_api = toxicity_api;
    }


    async send_message(text, user_id, chat_id) {
        let results = await store_message(text, user_id, chat_id, this.mysql_con);
        let toxicity_status = await toxicity_classification.classify_message(results.insertId, this.mysql_con, this.toxicity_api);
        return toxicity_status;
    }

    async create_two_user_chat_group(user_id1, user_id2) {
        return create_chat_group_for_users([user_id1, user_id2], this.mysql_con, this.mongo_con);
    }

}

function store_message(text, user_id, chat_id, mysql_con) {
    return new Promise((resolve, reject) => {
        let time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        values = { text: text, user_id: user_id, chat_id: chat_id, isClassified: false, isToxic: false, time: time };
        mysql_con.query('INSERT INTO messages SET ?', values, function (error, results, fields) {
            if (error) return reject(error);
            return resolve(results);
        });
    });
}

async function create_chat_group_for_users(users_ids, mysql_con, mongo_con) {
    let chat_id = await create_chat(mysql_con);
    for (let i = 0; i < users_ids.length; i++) {
        await create_chat_group(users_ids[i], users_ids, chat_id, mongo_con);
    }
    return chat_id;
}

async function create_chat_group(primary_user_id, user_ids, chat_id, mongo_con) {
    let values = { primary_user_id: primary_user_id, user_ids: user_ids, chat_id: chat_id };
    let db = await mongo_con.db('aries');
    let chat_groups = await db.collection('chat_groups');
    await chat_groups.insertOne(values);
    return;
}

async function create_chat(mysql_con) {
    return new Promise((resolve, reject) => {
        mysql_con.query('INSERT INTO chats () VALUES ()', function (error, results, fields) {
            if (error) return reject(error);
            return resolve(results.insertId);
        });
    });
}

