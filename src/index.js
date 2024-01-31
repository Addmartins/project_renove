const express = require('express');
const cors = require("cors");
const rotas = require('./router');

const app = express();

app.use(express.json());
app.use(cors());

app.use(rotas)

app.listen(3000, () => {
    console.log("server is running")
});