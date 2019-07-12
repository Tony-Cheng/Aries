const knex = require('knex') ({
    client: "mysql",
    connection : {
        host : "mysql.tcheng.ca",
        user : "michael",
        password : "Michaellee888!!!",
        database : "Aries",
        charset : "utf8"
    }
});

module.exports.knex = knex;