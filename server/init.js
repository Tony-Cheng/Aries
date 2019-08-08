const fs = require('fs');
const mysql_init = require('./initialization/init_mysql');

function init_all() {
    const settings = JSON.parse(fs.readFileSync("./settings.json"));
    return mysql_init(settings.mysql)
    .then(() => {
        console.log("Finished MySQL Initialization!");
    })
    .catch((error) => {
        console.log(error);
    })
}

init_all();