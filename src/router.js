const express = require('express')
const { cadastroClient, loginClient, getClient, updateClient } = require('./controllers/client/client');
const verificarLogin = require('./cryptografia/jwt');
const { newRequest, getRequest } = require('./controllers/requests/requets');
// const verificarLogin = require('./filter/verificarLogin');

const rotas = express.Router();


//cadastro client

//login admin
rotas.post('/cadastro/client', cadastroClient);
rotas.post('/login/client', loginClient);

rotas.use(verificarLogin)


//Filter para verificar login
// rotas.use(verificarLogin)
rotas.get('/client', getClient);
rotas.put('/client', updateClient);
// rotas.delete('/client', )

//Requests
rotas.post('/request', newRequest);
rotas.get('/request', getRequest);





//obter e atualizar client
// rotas.get('client', client.getClients);
// rotas.put('/client', client.updateClient)

//requests > solicitações

module.exports = rotas