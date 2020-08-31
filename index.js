require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

// Crear el servidor
const app = express();

// Configurar cors
app.use(cors());

// Libreria para manejar pas peticiones post (recibir formulario Fontend)
const bodyParser = require('body-parser');

// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())

// Recibir formulario en formato json()
app.use(express.json());

dbConnection();

// Rutas
app.use('/api/usuarios', require('./rutas/usuarios'));
app.use('/api/login', require('./rutas/auth'));





app.listen(process.env.PORT, () => {
    console.log('Servidor en puerto', process.env.PORT);
})