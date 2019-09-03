const ScoreSystem = require('../../recommendation/score_system');
const db = require('../init_db');

async function main() {
    await db.init();
    var scoreSystem = new ScoreSystem(db.mysql_pool);
    console.log(await scoreSystem.find_user_score(10));
    return;
}

main();