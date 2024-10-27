require("dotenv").config();
const knex = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {

    async create_client(object, senhaCryptografada) {

    },

    async validar_email(email) {
        return await knex("clients").where({ email }).first();
    },

    async validar_empresa(nome_client) {
        return await knex("clients")
            .where({ nome_client }).first();
    },

    async validar_cnpj(cnpj){
        return await knex("clients").where({cnpj}).first()
    }

}