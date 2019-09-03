var settings = require('../../test_settings.json');
const Login = require('../../login/login');
const db = require('../init_db');

async function main() {
    await db.init();
    let login = new Login(db.mysql_pool);
    for (let i = 0; i < 1000; i++) {
        login.rerieve_usernames([10, 11, 12, 13, 14, 15, 17, 21, 22, 23, 24])
            .then((usernames) => {
                console.log(usernames);
                console.log(i)
            })
    }
    return;
}

main();