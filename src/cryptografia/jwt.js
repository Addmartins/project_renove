require("dotenv").config();
const jwt = require("jsonwebtoken");
const knex = require("../connection")


const verificarLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(401).json({
            mensagem: "Cliente não autorizado!"
        });
    }

    const token = authorization.split(' ')[1]

    try {

        const { id } = jwt.verify(token, process.env.JWT);

        const client = await knex('clients').where({ id }).first();

        if(!client) {
            return res.status(401).json({
                mensagem: "Cliente não autorizado!"
            })
        }

        req.client = client

        next();

    } catch (error) {

        console.log(error)
        return res.status(401).json({
            mensagem: "Cliente não autorizado!"
        })
    }

}

module.exports = verificarLogin