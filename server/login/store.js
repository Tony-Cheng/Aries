hash_SHA3 = function(pass) {
    hash.update(pass);
    return hash.digest(encoding='hex');
}

exports.storeUsername = function(user) {
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected! About to store Username...");
        var sql = "INSERT INTO login (username, password) VALUES (${user}, 'Highway 37')";
        con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
}

exports.storePassword = function(pass) {
    var hashedPassword = hash_SHA3(pass);
    
}

const { SHA3 } = require('sha3');
const hash = new SHA3(256);

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "http://mysql.tcheng.ca",
    user: "server_test",
    password: "Testserver123!",
    database: "Proximity"
});

exports.storeUsername("test");







