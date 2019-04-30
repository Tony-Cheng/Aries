const { SHA3 } = require('sha3');
const hash = new SHA3(256);

var mysql = require('mysql');

function hash_SHA3(pass) {
    hash.update(pass);
    return hash.digest(encoding = 'hex');
}

exports.storeUsername = function (user) {
    var con = mysql.createConnection({
        host: "mysql.tcheng.ca",
        user: "server_test",
        password: "Testserver123!",
        database: "Proximity"
    });

    con.connect(function (err) {
        if (err) throw err;
        user = '';
        console.log("Connected! About to store Username...");
        var sql = 'INSERT INTO login (username, password) VALUES (${user}, \'Highway 37\')';
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
}

exports.storePassword = function (pass) {
    var hashedPassword = hash_SHA3(pass);
}

exports.storeUsername("test");