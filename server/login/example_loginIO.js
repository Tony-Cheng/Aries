const loginIO = require('./loginIO.js')

async function example() {
    io = new loginIO();
    io.store("user13", "abcdef").then((res) => {
        console.log('Insert successful')
    }).catch((err) => {
        console.log('Insert unsuccessful')
    });
    
    io2 = new loginIO();
    io2.check("user13", "abcdef").then((res) => {
        console.log('correct password')
    }).catch((err) => {
        console.log('Incorrect password')
    });
}

example();