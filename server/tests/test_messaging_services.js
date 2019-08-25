var settings = require('../test_settings.json');
const messaging_service = require('../process_messages/messagingDB');
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
    console.log('not toxic message: ' + await messagingService.send_message('test sending a message', 1, 2));
    console.log('toxic message: ' + await messagingService.send_message('go to hell', 2, 2));

    console.log('create a chat group: ' + await messagingService.create_two_user_chat_group(5, 4));

    console.log('find chat group: ');
    let chat_groups = await messagingService.retrieve_chat_groups(4);
    console.log(chat_groups)
    let messages = await messagingService.retrieve_chat_messages(2);
    console.log('retrieve messages: ')
    console.log(messages)
    return;
}

main();