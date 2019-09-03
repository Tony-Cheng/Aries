const Login = require('../../login/login');
const db = require('../init_db');


async function main() {
    await db.init();
    var login = new Login(db.mysql_pool);
    console.log(await login.retrieve_all_users())
    return;
}

main();