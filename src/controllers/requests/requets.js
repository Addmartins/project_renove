const knex = require("../../connection");

const newRequest = async (req, res) => {
    const { description, marca, produto, quantidade, categoria } = req.body;

    const { id } = req.client;

    try {

        const categoria_id = await knex('categorias').where({ description: categoria }).returning('id');

        const new_request = await knex("requests")
        .insert({
            client_id: id,
            categoria_id,
            description,
            quantidade,
            marca,
            produto
        }).returning("*");

        return res.json(new_request)
        
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            mensagem: "Falha ao realizar a solicitação."
        })
    }

};

const updateRequest = async (req, res) => {

};

const deleteRequest = async (req, res) => {

}


module.exports = {
    newRequest,
    updateRequest,
    deleteRequest
}