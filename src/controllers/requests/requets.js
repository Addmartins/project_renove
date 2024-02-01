const request = require('../../querys/requestQuerys');
const category = require('../../querys/categoryQuerys')

const newRequest = async (req, res) => {
    const { description, marca, produto, quantidade, categoria } = req.body;

    const { id } = req.client;

    try {

        const categoria_id =  await category.get_category(categoria);

        let object_request = {
            client_id: id,
            description,
            marca,
            produto,
            quantidade,
            categoria_id: categoria_id[0].id
        }

       const new_request = await request.register_request(object_request);

       if(!new_request) {
        return res.status(400).json({
            mensagem: "Falha ao realizar uma solicitação."
        }) }

        return res.status(201).json(new_request)

      
        
    } catch (error) {
        return res.status(501).json({
            mensagem: "Falha ao realizar a solicitação."
        })
    }

};

const getRequest = async(req, res) => {
    const { id } = req.client;

    try {

        const requests = await request.get_requests(id);

        return res.status(200).json(requests);
        
    } catch (error) {
        return res.status(400).json({
            mensagem: "Falha ao fazer a requisição."
        })
    }
}

const updateRequest = async (req, res) => {

};

const deleteRequest = async (req, res) => {

}


module.exports = {
    newRequest,
    getRequest,
    updateRequest,
    deleteRequest
}