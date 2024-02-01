const knex = require('../connection');

module.exports = {

    async get_category(description) {
        
        return await knex('categorias')
        .where({ description }).returning("id");
        
    }

}