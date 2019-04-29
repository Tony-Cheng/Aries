

const { SHA3 } = require('sha3');

const hash = new SHA3(256);

console.log(hash);

hash.update('mypassword');
console.log(hash.digest(encoding='hex'));