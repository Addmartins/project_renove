require("dotenv").config();
const jwt = require("jsonwebtoken");
const knex = require("../../connection")


const verificarLoginFornecedor = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(401).json({
            mensagem: "Fornecedor não autorizado!"
        });
    }

    const token = authorization.split(' ')[1]

    try {

        const { id } = jwt.verify(token, process.env.JWT);

        const fornecedor = await knex('fornecedores').where({ id }).first();

        if(!fornecedor) {
            return res.status(401).json({
                mensagem: "Fornecedor não autorizado!"
            })
        }

        req.fornecedor = fornecedor

        next();

    } catch (error) {

        console.log(error)
        return res.status(401).json({
            mensagem: "Fornecedor não autorizado!"
        })
    }

}

module.exports = verificarLoginFornecedor