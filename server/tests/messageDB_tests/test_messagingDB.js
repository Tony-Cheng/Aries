var settings = require('../../test_settings.json');
const messaging_service = require('../../process_messages/messagingDB');
const db = require('../init_db');

async function main() {
    await db.init();
    var messagingService = new messaging_service(db.mysql_pool, db.mongodb, settings.toxicity_api_endpoint);
    console.log('not toxic message: ' + await messagingService.send_message('test sending a message', 1, 2));
    console.log('toxic message: ' + await messagingService.send_message('go to hell', 2, 2));
    console.log('find chat group: ');
    let chat_groups = await messagingService.retrieve_chat_groups(4);
    console.log(chat_groups)
    let messages = await messagingService.retrieve_chat_messages(2);
    console.log('retrieve messages: ')
    console.log(messages)
    console.log(await messagingService.delete_chat(20));
    return;
}

main();