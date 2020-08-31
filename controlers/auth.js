const { response } = require('express');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../hellpers/jwt');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {

            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        if (!bcrypt.compareSync(password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Creedenciales incorrectas - password'
            });
        }

        // Generar el token
        const token = await generarJWT(usuarioDB._id)


        res.status(200).json({
            ok: true,
            usuarioDB: usuarioDB,
            token
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }



};


module.exports = {
    login
}