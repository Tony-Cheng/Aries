const toxicity_classification = require('./toxicity_classification');
module.exports = class {

    constructor(mysql_con, mongo_db, toxicity_api) {
        this.mysql_con = mysql_con;
        this.mongo_db = mongo_db;
        this.toxicity_api = toxicity_api;
        this.current_inserting = new Set();
    }


    async send_message(text, user_id, chat_id) {
        let results = await store_message(text, user_id, chat_id, this.mysql_con);
        let toxicity_status = await toxicity_classification.classify_message(results.insertId, this.mysql_con, this.toxicity_api);
        return toxicity_status;
    }

    async create_two_user_chat_group(user_id1, user_id2) {
        let chat_id = await find_chat_id_by_user_ids([user_id1, user_id2], this.mongo_db);
        let user_ids = [user_id1, user_id2].sort();
        if (chat_id || this.current_inserting.has(user_ids)) {
            return false;
        }
        this.current_inserting.add(user_ids)
        chat_id = await create_chat_group_for_users(user_ids, this.mysql_con, this.mongo_db);
        this.current_inserting.delete(user_ids);
        return chat_id;
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

async function create_chat_group_for_users(users_ids, mysql_con, mongo_db) {
    users_ids.sort();
    let created_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let chat_id = await create_chat(mysql_con, created_time);
    await create_chat_group(users_ids, chat_id, created_time, mongo_db);
    return chat_id;
}

async function create_chat_group(user_ids, chat_id, created_time, mongo_db) {
    let values = { user_ids: user_ids, created_time: created_time, chat_id: chat_id };
    let chat_groups = await mongo_db.collection('chat_groups');
    await chat_groups.insertOne(values);
    return;
}

async function create_chat(mysql_con, created_time) {
    return new Promise((resolve, reject) => {
        mysql_con.query('INSERT INTO chats SET ?', { created_time: created_time }, function (error, results, fields) {
            if (error) return reject(error);
            return resolve(results.insertId);
        });
    });
}

async function find_chat_id_by_user_ids(user_ids, mongo_db) {
    user_ids.sort();
    let chat_groups = await mongo_db.collection('chat_groups');
    let result = await chat_groups.find({ user_ids: user_ids }).toArray();
    if (result.length > 0) {
        return result[0].chat_id;
    }
    else {
        return 0;
    }
}
