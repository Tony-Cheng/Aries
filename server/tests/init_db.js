const mysql = require('mysql');
const MongoClient = require('mongodb').MongoClient;
var settings = require('../test_settings.json');

exports.init = async () => {
    let url = `mongodb://${settings.mongo.user}:${settings.mongo.password}@${settings.mongo.host}:27017/admin`;
    let mongo_con = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    exports.mongodb = mongo_con.db(settings.mongo.database);
    exports.mysql_pool = mysql.createPool(settings.mysql);
}