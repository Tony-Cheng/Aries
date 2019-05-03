const loginIO = require('./loginIO.js')

async function example() {
    io = new loginIO()
    io.store("user13", "abcdef").then((res) => {
        console.log('accepted')
        console.log(res)
    }).catch((err) => {
        console.log('rejected')
        console.log(err)
    });
}
example();