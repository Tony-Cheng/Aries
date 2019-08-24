const fs = require('fs');

settings = {
    "mongo": {
<<<<<<< HEAD
        "host": "aries.tcheng.ca",
        "user": "memes888",
        "password": "Memes888"
=======
        "host": "",
        "user": "",
        "password": "",
        "database":"aries"
>>>>>>> aa0df9dc2916610ed358d8a946c4a74e45e6a83a
    },
    "mysql": {
        "host": "aries.tcheng.ca",
        "user": "memes888",
        "password": "Memes888",
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