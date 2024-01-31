const knex = require('knex')({
    client:"pg",
    connection: {
        host: "localhost",
        port: 5433,
        user: "postgres",
        password: "postgres",
        database: "projeto_renove"
    }
})

module.exports = {
    knex
}