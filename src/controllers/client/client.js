require('dotenv').config();
const query_client = require("../../querys/clientQuerys")
const knex = require("../../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const cadastroClient = async (req, res) => {
    const client = req.body;
    const { empresa, cnpj, senha, email } = client;
    const { cep, rua, cidade, estado, numero } = client.location;
    const { nome, cpf, email_gerente, telefone } = client.gerente;

    try {

        const senhaCryptografada = await bcrypt.hash(senha, 10);

        //validar se o gerente ja existe

        const gerente_existente = await knex('gerentes').where({ cpf }).first();


        let gerente_id = null;

        if (!gerente_existente) {
            //Persistir dados do gerente no database
            const gerente = await knex('gerentes').insert({
                nome,
                cpf,
                email: email_gerente,
                telefone
            }).returning('id');

            gerente_id = gerente[0].id;

        } else {
            gerente_id = gerente_existente.id;
        }


        //Persistir dados da localização no database
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

        const client_existe = await query_client.validar_email(email);

        if (client_existe) {
            return res.status(404).json({
                mensagem: "Email ja cadastrado."
            })
        }

        //Persistir dados da empresa no database
        const newClient = await knex('clients').insert(
            {
                cnpj,
                nome_client: empresa,
                senha: senhaCryptografada,
                email,
                location_id,
                gerente_id
            }
        ).returning("*")

        return res.status(201).json(newClient)

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            error: "Erro interno"
        })
    }
}

const loginClient = async (req, res) => {
    const { senha, email } = req.body;

    try {

        //Retornar o client do database

        const client = await knex('clients')
            .where({ email })
            .first();


        if (!client) {
            return res.status(501).json({
                mensagem: "Email ou senha inválida!"
            });
        };

        const validarSenha = await bcrypt.compare(senha, client.senha);


        if (!validarSenha) {
            return res.status(501).json({
                mensagem: "Email ou senha inválida!"
            });
        };

        const token = jwt.sign({ id: client.id }, process.env.JWT, { expiresIn: "8h" });

        const { senha: _, ...clientLogin } = client;

        return res.status(200).json({
            client: clientLogin, token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Erro interno"
        })
    }
}

const getClient = async (req, res) => {
    const { senha: _, ...client } = req.client;

    return res.json(client)
}

const updateClient = async (req, res) => {
    const client = req.body;
    const { id } = req.client
    const { empresa, cnpj, senha, email } = client;
    const location = client.location;
    const gerente = client.gerente;

    try {

        if (senha) {
            const senhaCryptografada = await bcrypt.hash(senha, 10);

            await knex('clients')
                .where({ id })
                .update({
                    senha: senhaCryptografada
                });
        }



        if (location) {
            const { location_id } = req.client;
            const { cep, rua, cidade, estado, numero } = location;

            await knex("location")
                .where({ id: location_id })
                .update({
                    cep,
                    rua,
                    cidade,
                    estado,
                    numero
                });


        }

        if (gerente) {
            const { gerente_id } = req.client;
            const { nome, cpf, email_gerente, telefone } = gerente;

            await knex("gerentes")
                .where({ id: gerente_id })
                .update({
                    nome,
                    cpf,
                    email_gerente,
                    telefone
                });
        }

        const update_client = await knex('clients')
            .where({ id })
            .update({
                cnpj,
                nome_client: empresa,
                email,
            }).returning("*");


        if (!update_client) {
            return res.status(501).json({
                mensagem: "Falha ao atualizar dados."
            })
        }


        const { senha: __, ...clietUpdate } = update_client[0];

        return res.status(200).json({ clietUpdate })


    } catch (error) {
        console.log(error)
        return res.status(501).json({
            mensagem: "Falha ao atualizar dados."
        })
    }


}

const deleteClient = async (req, res) => {

    const { id, location_id, gerente_id } = req.client;

    try {

        const gerente_qtd = await knex('clients')
            .select("*")
            .where({
                gerente_id
            });

        await knex("requests").where({ client_id: id }).delete();

        await knex("clients").where({ id }).delete()

        if (gerente_qtd.length == 1) {
            await knex("gerentes")
                .where({ id: gerente_id })
                .delete()
        }


        await knex("location").where({ id: location_id }).delete();


    } catch (error) {
        console.log(error)
        return res.status(501).json({
            mensagem: "Error interno."
        })
    }

}


module.exports = {
    cadastroClient,
    loginClient,
    getClient,
    updateClient,
    deleteClient
}