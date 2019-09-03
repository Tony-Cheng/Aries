const ScoreSystem = require('../../recommendation/score_system');
const db = require('../init_db');


async function main() {
    await db.init();
    var scoreSystem = new ScoreSystem(db.mysql_pool);
    console.log(await scoreSystem.update_score(10, false));
    console.log(await scoreSystem.update_score(11, true));
    return;
}

main();