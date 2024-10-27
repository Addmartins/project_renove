const knex = require('../connection');

module.exports = {
    async create_request(object) {
        return await knex('requests')
            .insert({
                client_id: object.client_id,
                categoria_id: object.categoria_id,
                description: object.description,
                quantidade: object.quantidade,
                marca: object.marca,
                produto: object.produto
            }).returning("*")

    },

    async get_requests(client_id){
        return await knex('requests').where({client_id}).returning("*")
    },

    async get_request(request_id){
        return await knex('requests').where({id: request_id}).first();
    },

    async delete_request(object) {
        return await knex('requests')
        .where({id: object.request_id, client_id: object.client_id}).delete()
    }


}