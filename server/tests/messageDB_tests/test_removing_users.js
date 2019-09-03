const settings = require('../../test_settings.json');
const messaging_service = require('../../process_messages/messagingDB');
const db = require('../init_db');

async function main() {
    await db.init();
    var messagingService = new messaging_service(db.mysql_pool, db.mongodb, settings.toxicity_api_endpoint);
    await messagingService.remove_user_from_chat(2, 23);
    return;
}

main();