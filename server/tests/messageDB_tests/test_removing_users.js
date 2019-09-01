var settings = require('../../test_settings.json');
const messaging_service = require('../../process_messages/messagingDB');
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
    var messagingService = new messaging_service(mysql_con, mongo_db, settings.toxicity_api_endpoint);
    await messagingService.remove_user_from_chat(2, 23);
    mysql_con.end();
    mongo_con.close();
    return;
}

main();