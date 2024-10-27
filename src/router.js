const express = require('express')
const { cadastroClient, loginClient, getClient, updateClient, deleteClient } = require('./controllers/client/client');
const verificarLogin = require('./cryptografia/jwt');
const { newRequest, getRequest, deleteRequest, aceitar_oferta } = require('./controllers/requests/requets');
const { create_fornecedor, login_fornecedor, get_requests, delete_fornecedor } = require('./controllers/fornecedores/fornecedores');
const verificarLoginFornecedor = require('./controllers/fornecedores/loginFornecedores');
const { gerar_oferta } = require('./controllers/ofertas/ofertas');
// const verificarLogin = require('./filter/verificarLogin');

const rotas = express.Router();


//cadastro client
rotas.post('/cadastro/client', cadastroClient);

//login cleint
rotas.post('/login/client', loginClient);

//cadastro fornecedor
rotas.post('/cadastro/fornecedor', create_fornecedor);
rotas.post('/login/fornecedor', login_fornecedor);
//Routers fornecedor
rotas.get("/requests/clients", verificarLoginFornecedor, get_requests);
rotas.delete("/fornecedor", verificarLoginFornecedor, delete_fornecedor);
rotas.post('/fornecedor/:request_id', verificarLoginFornecedor, gerar_oferta);

rotas.use(verificarLogin)


//Filter para verificar login
// rotas.use(verificarLogin)
rotas.get('/client', getClient);
rotas.put('/client', updateClient);
rotas.delete('/client', deleteClient);

//Requests
rotas.post('/request', newRequest);
rotas.get('/request',  getRequest);
rotas.delete('/request', deleteRequest);
rotas.put('/request/:request_id', aceitar_oferta);






//obter e atualizar client
// rotas.get('client', client.getClients);
// rotas.put('/client', client.updateClient)

//requests > solicitações

module.exports = rotas