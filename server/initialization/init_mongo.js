const MongoClient = require('mongodb').MongoClient;

module.exports = function (mongo_settings) {
    return new Promise((resolve, reject) => {
        let mongodb_connection_url = `mongodb://${mongo_settings.user}:${mongo_settings.password}` +
            `@${mongo_settings.host}/admin`;
        MongoClient.connect(mongodb_connection_url, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
            if (error) {
                reject(error);
                return;
            }
            let db = client.db('aries');
            createChatPropertyCollection(db)
                .then(() => {
                    let collection = db.collection('chat_properties');
                    return createUserIndex(db);
                })
                .catch(() => {
                    let collection = db.collection('chat_properties');
                    return createUserIndex(db);
                })
                .then(() => {
                    client.close();
                    resolve();
                })
                .catch((error) => {
                    console.log(error);
                    client.close();
                    resolve();
                });
        });
    });
}

function createChatPropertyCollection(db) {
    return new Promise((resolve, reject) => {
        db.createCollection("chat_properties", function (error, result) {
            if (error) reject(error);
            resolve();
        });
    });
}

function createUserIndex(collection) {
    return new Promise((resolve, reject) => {
        collection.index({ "user": 1 });
        resolve();
    });
}
