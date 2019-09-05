const toxicity_classification = require('./toxicity_classification');
module.exports = class {

    constructor(mysql_pool, mongo_db, toxicity_api) {
        this.mysql_pool = mysql_pool;
        this.mongo_db = mongo_db;
        this.toxicity_api = toxicity_api;
    }

    async send_message(text, user_id, chat_id) {
        let mysql_con = await get_connection(this.mysql_pool);
        let results = await store_message(text, user_id, chat_id, mysql_con);
        try {
            toxicity_classification.classify_message(results.insertId, mysql_con, this.toxicity_api);
        } catch (error) {
            console.log(error);
        } finally {
            mysql_con.release();
        }
        return results.insertId;
    }

    async classify_message(message_id) {
        let mysql_con = await get_connection(this.mysql_pool);
        let message = await retrieve_chat_message(message_id, mysql_con);
        if (!message.isClassified) {
            let toxicity_status = await toxicity_classification.classify_message(message_id, mysql_con, this.toxicity_api);
            mysql_con.release();
            return toxicity_status;
        }
        else {
            mysql_con.release();
            if (message.isToxic) {
                return toxicity_classification.TOXIC;
            }
            else {
                return toxicity_classification.NOTTOXIC;
            }
        }
    }

    async create_new_user_chat_group(user_ids) {
        let mysql_con = await get_connection(this.mysql_pool);
        let chat_id = await create_chat_group_for_users(user_ids, mysql_con, this.mongo_db);
        mysql_con.release();
        return chat_id;
    }

    async remove_user_from_chat(user_id, chat_id) {
        let user_ids = await find_chat_users(chat_id, this.mongo_db);
        if (user_ids.includes(user_id)) {
            if (user_ids.length === 2) {
                await this.delete_chat(chat_id);
            }
            else {
                await delete_user_from_chat(user_id, chat_id, this.mongo_db);
            }
        }
        return true;
    }

    async add_user_to_chat(user_id, chat_id) {
        let user_ids = await find_chat_users(chat_id, this.mongo_db);
        if (!user_ids.includes(user_id)) {
            await append_user_to_chat(user_id, chat_id, this.mongo_db);
        }
        return true;
    }

    async retrieve_chat_groups(user_id) {
        let chat_groups = this.mongo_db.collection('chat_groups');
        return await chat_groups.find({ user_ids: user_id }).sort({ created_time: -1 }).toArray();
    }

    async retrieve_chat_messages(chat_id) {
        return new Promise((resolve, reject) => {
            get_connection(this.mysql_pool)
                .then(mysql_con => {
                    let sql = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY time DESC LIMIT 100';
                    mysql_con.query(sql, [chat_id], (error, results, fields) => {
                        mysql_con.release();
                        if (error) return reject(error);
                        results.reverse();
                        return resolve(results);
                    })
                })
        })
    }

    async delete_chat(chat_id) {
        let mysql_con = await get_connection(this.mysql_pool);
        try {
            await delete_chat_group(chat_id, this.mongo_db);
            await delete_chat_messages(chat_id, mysql_con);
            await delete_chat(chat_id, mysql_con);
        } catch (error) {
            console.log(error);
        }
        mysql_con.release();
        return;
    }

}

function retrieve_chat_message(message_id, mysql_con) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM messages WHERE message_id = ?';
        mysql_con.query(sql, [message_id], function (error, results, fields) {
            if (error) return reject(error);
            return resolve(results[0]);
        });
    });
}

async function append_user_to_chat(user_id, chat_id, mongo_db) {
    let chat_groups = await mongo_db.collection('chat_groups');
    return await chat_groups.updateOne({ chat_id: chat_id }, { $push: { user_ids: user_id } });
}

async function delete_user_from_chat(user_id, chat_id, mongo_db) {
    let chat_groups = await mongo_db.collection('chat_groups');
    return await chat_groups.updateOne({ chat_id: chat_id }, { $pull: { user_ids: user_id } });
}

async function find_chat_users(chat_id, mongo_db) {
    let chat_groups = await mongo_db.collection('chat_groups');
    let result = await chat_groups.find({ chat_id: chat_id }).toArray();
    if (result.length > 0) {
        return result[0].user_ids;
    }
    else {
        return false;
    }
}

async function delete_chat_group(chat_id, mongo_db) {
    let chat_groups = await mongo_db.collection('chat_groups');
    return await chat_groups.deleteMany({ chat_id: chat_id });
}

function delete_chat(chat_id, mysql_con) {
    return new Promise((resolve, reject) => {
        mysql_con.query('DELETE FROM chats where chat_id = ?', [chat_id], function (error, results, fields) {
            if (error) return reject(error);
            return resolve();
        });
    });
}

function delete_chat_messages(chat_id, mysql_con) {
    return new Promise((resolve, reject) => {
        mysql_con.query('DELETE FROM messages where chat_id = ?', [chat_id], function (error, results, fields) {
            if (error) return reject(error);
            return resolve();
        });
    });
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

function get_connection(mysql_pool) {
    return new Promise((resolve, reject) => {
        mysql_pool.getConnection((error, mysql_con) => {
            if (error) return reject(error);
            return resolve(mysql_con);
        });
    });

}