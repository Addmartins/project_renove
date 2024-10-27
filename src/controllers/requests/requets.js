const request = require('../../querys/requestQuerys');
const category = require('../../querys/categoryQuerys');
const knex = require('../../connection');
const { smtp_config } = require('../../smtp/smtp')

const newRequest = async (req, res) => {
    const { description, marca, produto, quantidade, categoria } = req.body;

    const { id } = req.client;

    try {

        const categoria_id = await category.get_category(categoria);

        let object_request = {
            client_id: id,
            description,
            marca,
            produto,
            quantidade,
            categoria_id: categoria_id[0].id
        }

        const new_request = await request.create_request(object_request);

        if (!new_request) {
            return res.status(400).json({
                mensagem: "Falha ao realizar uma solicitação."
            })
        }

        return res.status(201).json(new_request)



    } catch (error) {
        return res.status(501).json({
            mensagem: "Falha ao realizar a solicitação."
        })
    }

};

const getRequest = async (req, res) => {
    const { id } = req.client;

    try {

        const requests = await request.get_requests(id);

        for (const request of requests) {

            const oferta = await knex("ofertas").where({ request_id: request.id }).select("*");

            request.ofertas = oferta
        }



        return res.status(200).json(requests);

    } catch (error) {

        console.log(error)
        return res.status(400).json({
            mensagem: "Falha ao fazer a requisição."
        })
    }
}

const updateRequest = async (req, res) => {

};

const deleteRequest = async (req, res) => {
    const { id } = req.client;
    const { id: request_id } = req.body;

    try {

        const object = {
            client_id: id,
            request_id
        };

        const get_request = await request.get_request(request_id);

        if (!get_request) {
            return res.status(404).json({
                mensagem: "Solicitação não existe."
            })
        }

        await request.delete_request(object);

        return res.status(200).json({
            mensagem: "Sucess"
        })

    } catch (error) {
        console.log(error)
        return res.status(501).json({
            mensagem: "Falha ao deletar solicitação."
        })
    }


};

const aceitar_oferta = async (req, res) => {

    const { id: client_id, email } = req.client;
    const { request_id } = req.params;
    const { id: oferta_id } = req.body;

    console.log(email)

    try {

        const request = await knex("requests")
        .where({
            id: request_id,
            client_id
        }).first();


        if(!request) {
            return res.status(404).json({
                mensagem: "Solicitação não existe!"
            });
        }

        const aceitar = await knex("ofertas")
            .where({ id: oferta_id, request_id })
            .update({
                status: true
            }).returning("*");



            const email_fornecedor = await knex("fornecedores")
            .where({
                id: aceitar[0].fornecedor_id
            }).first();

        if(aceitar.length < 1) {
            return res.status(501).json({
                mensagem: "Não foi possivel encontrar a oferta."
            })
        }

        await knex('requests').where({
            id: request_id
        }).update({
            status: false
        });

        const object = {
            email_client: email,
            email_fornecedor
        }

        await smtp_config(object)



        return res.status(200).json({ request ,aceitar })

    } catch (error) {

        console.log(error)
        return res.status(404).json({
            mensagem: "Não foi possivel aceitar a oferta, tente novamente."
        })
    }
}


module.exports = {
    newRequest,
    getRequest,
    updateRequest,
    deleteRequest,
    aceitar_oferta
}