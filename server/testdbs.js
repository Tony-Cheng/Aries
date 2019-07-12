const knex = require("./testSetup").knex;
const bookshelf = require("bookshelf")(knex);

module.exports.knex = knex;

const loginDB = bookshelf.Model.extend({
    tableName : 'login'
});

module.exports = {
    loginDB : loginDB
}