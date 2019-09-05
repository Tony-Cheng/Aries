const settings = require('../../test_settings.json');
const messaging_service = require('../../process_messages/messagingDB');
const db = require('../init_db');

async function main() {
    await db.init();
    var messagingService = new messaging_service(db.mysql_pool, db.mongodb, settings.toxicity_api_endpoint);
    console.log(await messagingService.send_message('hello', 1, 1));
    console.log(await messagingService.classify_message(647));
    return;
}

main();