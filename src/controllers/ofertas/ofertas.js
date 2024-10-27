const knex = require ("../../connection");

const gerar_oferta = async (req, res) => {
    const { id } = req.fornecedor;
    const { request_id } = req.params;
    const { valor } = req.body;

    if(!valor) {
        return res.status(404).json({
            mensagem: "É necessario informar o valor da oferta."
        })
    }


    try {

        const request = await knex("requests").where({id: request_id}).first();

        if(!request) {
            return res.status(404).json({
                mensagem: "Solicitação inexistente!"
            })
        }

        const create_oferta = await knex("ofertas").insert({
            fornecedor_id: id,
            request_id,
            valor
        }).returning("*");

        return res.status(200).json({
            create_oferta
        })

        
    } catch (error) {
        
        return res.status(501).json({
            mensagem: "Erro ao realizar oferta."
        });
    }
};


module.exports = {
    gerar_oferta
}