require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

// Crear el servidor
const app = express();

// Configurar cors
app.use(cors());

dbConnection();

// Rutas
app.get('/', (req, res) => {

    res.status(400).json({
        ok: true,
        msg: 'Hola Mundo'
    })
})




app.listen(process.env.PORT, () => {
    console.log('Servidor en puerto', process.env.PORT);
})