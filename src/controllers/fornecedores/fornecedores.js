require('dotenv').config();
const knex = require("../../connection");
const bcrypt = require('bcrypt');
const { request } = require('express');
const jwt = require("jsonwebtoken");

const create_fornecedor = async (req, res) => {
    const fornecedor = req.body;

    const { empresa, cnpj, senha, email, telefone, location, categoria } = fornecedor;
    const { cep, rua, cidade, estado, numero } = location || {};

    try {

        const categoria_id = await knex("categorias").where({ description: categoria }).first();

        const senhaCryptografada = await bcrypt.hash(senha, 10);

        const location = await knex('location').insert(
            {
                cep,
                cidade,
                estado,
                numero,
                rua
            }
        ).returning('id');

        const location_id = location[0].id;

        const newFornecedor = await knex('fornecedores').insert(
            {
                cnpj,
                nome_fornecedor: empresa,
                senha: senhaCryptografada,
                email,
                telefone,
                location_id,
                categoria_id: categoria_id.id
            }
        ).returning("*");

        return res.status(201).json(newFornecedor);



    } catch (error) {

        console.log(error)
        return res.status(501).json({
            mensagem: "Erro interno!"
        })
    }
}

const login_fornecedor = async (req, res) => {
    const { senha, email } = req.body;

    try {

        //retornar daddos do fornecedor

        const fornecedor = await knex('fornecedores')
            .where({ email })
            .first();

        if (!fornecedor) {
            return res.status(501).json({
                mensagem: "Email ou senha inválida!"
            });
        };

        const validarSenha = await bcrypt.compare(senha, fornecedor.senha);


        if (!validarSenha) {
            return res.status(501).json({
                mensagem: "Email ou senha inválida!"
            });
        };

        const token = jwt.sign({ id: fornecedor.id }, process.env.JWT, { expiresIn: "8h" });

        const { senha: _, ...fornecedorLogin } = fornecedor;

        return res.status(200).json({
            fornecedor: fornecedorLogin, token
        })

    } catch (error) {
        console.log(error)


        return res.status(401).json({
            mensagem: "Erro"
        })

    }
}

const get_requests = async (req, res) => {

    const { categoria } = req.body;

    try {

        if (!categoria) {

            const requests = await knex("requests")
            .where({
                status: true
            })
            .returning("*");

            for (const request of requests) {
                const oferta = await knex("ofertas").where({ request_id: request.id }).returning("*");


                request.ofertas = oferta;
            }
            return res.status(200).json(requests);
        };

        const requests_filter = await knex("categorias")
            .where({
                description:
                    categoria
            }).returning("id");



        if (!requests_filter) {
            return res.status(404).json({
                mensagem: "Categoria inexistente."
            });
        };

        const requests_list = await knex("requests")
            .where({ categoria_id: requests_filter[0].id }).returning("*");

            for (const request of requests_list) {
                const oferta = await knex("ofertas").where({ request_id: request.id }).select("*");

                request.ofertas = oferta;
            }


        return res.status(200).json(requests_list);



    } catch (error) {
        // console.log(error)
        return res.status(404).json({
            mensagem: "Usuario não autorizado."
        })
    }

}

const delete_fornecedor = async (req, res) => {

    // const { id } = req.fornecedor
    console.log( req.fornecedor )
};

const update_fornecedor = async (req, res) => {
    
}

module.exports = {
    create_fornecedor,
    login_fornecedor,
    get_requests,
    delete_fornecedor,
    update_fornecedor
}