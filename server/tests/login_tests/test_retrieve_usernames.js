var settings = require('../../test_settings.json');
const Login = require('../../login/login');
const mysql = require('mysql');
const MongoClient = require('mongodb').MongoClient;

async function create_mongo_pool(mongo_settings) {
    let url = `mongodb://${mongo_settings.user}:${mongo_settings.password}@${mongo_settings.host}:27017/admin`;
    let mongo_con = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return await mongo_con.db(mongo_settings.database);
}

async function create_mysql_pool(mysql_settings) {
    return await mysql.createPool(mysql_settings);
}

async function main() {
    let mongo_db = await create_mongo_pool(settings.mongo);
    let mysql_pool = await create_mysql_pool(settings.mysql);
    let login = new Login(mysql_pool);
    for (let i = 0; i < 1000; i++) {
        login.rerieve_usernames([10, 11, 12, 13, 14, 15, 17, 21, 22, 23, 24])
            .then((usernames) => {
                console.log(usernames);
                console.log(i)
            })
    }
    return;
}

main();