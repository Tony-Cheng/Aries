module.exports = class {
    constructor(mysql_pool) {
        this.mysql_pool = mysql_pool;
    }

    async find_user_score(user_id) {
        let mysql_con = await get_connection(this.mysql_pool);
        let score = await retrieve_user_score(user_id, mysql_con);
        mysql_con.release();
        return score;
    }

    async update_score(user_id, is_toxic) {
        let mysql_con = await get_connection(this.mysql_pool);
        let score = await increment_score(user_id, is_toxic, mysql_con);
        mysql_con.release();
        return score;
    }

    async recommend_user(user_id) {
        let mysql_con = await get_connection(this.mysql_pool);
        let score = await suggest_user(user_id, mysql_con);
        mysql_con.release();
        return score;
    }
}

function retrieve_user_score(user_id, mysql_con) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT find_user_score(?) as score';
        mysql_con.query(sql, [user_id], function (error, results, fields) {
            if (error) return reject(error);
            return resolve(results[0].score);
        })
    })
}

function increment_score(user_id, is_toxic, mysql_con) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT increment_score(?, ?) as score';
        mysql_con.query(sql, [user_id, is_toxic], function (error, results, fields) {
            if (error) return reject(error);
            return resolve(results[0].score);
        })
    })
}


function get_connection(mysql_pool) {
    return new Promise((resolve, reject) => {
        mysql_pool.getConnection(function (error, mysql_con) {
            if (error) return reject(error);
            return resolve(mysql_con);
        })
    })
}

function suggest_user(user_id, mysql_con) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT suggest_user(?) as user_id';
        mysql_con.query(sql, [user_id], function (error, results, fields) {
            if (error) return reject(error);
            return resolve(results[0].user_id);
        })
    })
}