const fs = require('fs');

settings = {
    "mongo": {
        "host": "",
        "user": "",
        "password": "",
        "database":"aries"
    },
    "mysql": {
        "host": "",
        "user": "",
        "password": "",
        "database":"Aries"
    },
    "port": "",
    "toxicity_api_endpoint":""
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