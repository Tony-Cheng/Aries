var settings = require('../../test_settings.json');
const ScoreSystem = require('../../recommendation/score_system');
const mysql = require('mysql');
const MongoClient = require('mongodb').MongoClient;

async function main() {
    let url = `mongodb://${settings.mongo.user}:${settings.mongo.password}@${settings.mongo.host}:27017/admin`;
    let mongo_con = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let mongo_db = mongo_con.db(settings.mongo.database);
    let mysql_pool = mysql.createPool(settings.mysql);
    var scoreSystem = new ScoreSystem(mysql_pool);
    console.log(await scoreSystem.update_score(10, false));
    console.log(await scoreSystem.update_score(11, true));

    mongo_con.close();
    return;
}

main();