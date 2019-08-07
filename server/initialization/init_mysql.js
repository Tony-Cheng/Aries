const mysql = require('mysql')

module.exports = function (mysql_settings) {
    return new Promise((resolve, reject) => {
        let con = mysql.createConnection(mysql_settings);
        con.connect(function (error) {
            if (error) reject(error);
        });

        createAriesSchema(con)
            .then(() => {
                return createLoginTable(con);
            })
            .then(() => {
                con.end();
                resolve();
            })
            .catch((error) => {
                con.end();
                reject(error);
            })
    });
}

function createAriesSchema(con) {
    return new Promise((resolve, reject) => {
        let query = "CREATE SCHEMA `Aries`;";
        con.query(query, function (error, results, fields) {
            if (error) reject(error);
            resolve();
        });
    });
}

function createLoginTable(con) {
    return new Promise((resolve, reject) => {
        let query = "CREATE TABLE `Aries`.`login` (`id` INT NOT NULL AUTO_INCREMENT," +
            " `username` VARCHAR(45) NOT NULL, `password` LONGTEXT NULL,PRIMARY KEY(`id`)," +
            " UNIQUE INDEX`username_UNIQUE`(`username` ASC) VISIBLE);";
        con.query(query, function (error, results, fields) {
            if (error) reject(error);
            resolve();
        });
    });
}
