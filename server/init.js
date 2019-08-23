const settings = require('./test_settings.json');
const mysql_init = require('./initialization/init_mysql');
const mongo_init = require('./initialization/init_mongo');


function init_all() {
    mysql_init(settings.mysql)
    .then(() => {
        console.log("Finished MySQL Initialization!");
    })
    .catch((error) => {
        console.log(error);
    })
    mongo_init(settings.mongo)
    .then(() => {
        console.log("Finished Mongo Initialization!");
    })
    .catch((error) => {
        console.log(error);
    })
    
}

init_all();