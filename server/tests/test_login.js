var settings = require('../test_settings.json');
const Login = require('../login/login');
const mysql = require('mysql');
const MongoClient = require('mongodb').MongoClient;

async function main() {
    let url = `mongodb://${settings.mongo.user}:${settings.mongo.password}@${settings.mongo.host}:27017/admin`;
    let mongo_con = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let mongo_db = mongo_con.db(settings.mongo.database);
    let mysql_con = mysql.createConnection(settings.mysql);
    await mysql_con.connect();
    var login = new Login(mysql_con);
    console.log(await login.retrieve_all_users())
    return;
}

main();