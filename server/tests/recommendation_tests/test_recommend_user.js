const db = require('../init_db');
const ScoreSystem = require('../../recommendation/score_system');

async function main() {
    await db.init();
    var scoreSystem = new ScoreSystem(db.mysql_pool);
    console.log(await scoreSystem.recommend_user(10));
    return;
}

main();