const loginIO = require('./loginIO.js')

function example() {
    io = new loginIO()
    io.store("user10", "abcdef");
}
example();