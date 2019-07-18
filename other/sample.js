function mongodb_insert(res, url) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            const db = client.db('tcheng_website');
            const collection = db.collection('location');
            collection.insertOne(res, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve(result.insertedId);
                client.close();
            });
        });
    });
}