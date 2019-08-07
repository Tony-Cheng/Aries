const fs = require('fs');
const mysql_init = require('./initialization/init_mysql');

function init_all() {
    const settings = JSON.parse(fs.readFileSync("./settings.json"));
    return mysql_init(settings)
    .then(() => {
        console.log("Success!");
    })
    .catch((error) => {
        console.log(error);
    })
}

init_all();