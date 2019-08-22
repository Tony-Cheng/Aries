const fs = require('fs');

settings = {
    "mongo": {
        "host": "",
        "user": "",
        "password": ""
    },
    "mysql": {
        "host": "",
        "user": "",
        "password": ""
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