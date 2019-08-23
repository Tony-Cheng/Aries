const fs = require('fs');

settings = {
    "mongo": {
        "host": "",
        "user": "",
        "password": ""
    },
    "": {
        "host": "",
        "user": "",
        "password": ""
    },
    "port": "",
    "toxicity-api-endpoint":""
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