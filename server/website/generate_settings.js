const fs = require('fs');

settings = {
    "mongo": {
        "host": "aries.tcheng.ca",
        "user": "memes888",
        "password": "Memes888"
    },
    "mysql": {
        "host": "aries.tcheng.ca",
        "user": "memes888",
        "password": "Memes888"
    },
    "port": 3000
}

fs.writeFile ("settings.json", JSON.stringify(settings), function(err) {
    if (err) throw err;
    console.log('complete');
    }
);

fs.writeFile ("test_settings.json", JSON.stringify(settings), function(err) {
    if (err) throw err;
    console.log('complete');
    }
);