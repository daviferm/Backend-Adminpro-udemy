const { response } = require('express');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../hellpers/jwt');
const { googleVerify } = require('../hellpers/google-verify');

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
        const token = await generarJWT(usuarioDB._id);

        res.status(200).json({
            ok: true,
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

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        // Comprobar si el usuario esta registrado en la base de datos
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            // Si no existe el usuario en la base de datos
            usuario = new Usuario({
                google: true,
                nombre: name,
                email,
                img: picture,
                password: ':)'
            })
        } else {
            // Si el usuario existe en la base de datos
            usuario = usuarioDB;
        }
        let token;

        // Guardamos el usuario en la base de datos y generamos el token JWT
        await Promise.all([
            usuario = await usuario.save(),
            // Generar el token
            token = await generarJWT(usuario._id)
        ])

        res.status(200).json({
            ok: true,
            token
        });


    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'El token de Google no es correcto!!',
            error
        })

    }
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;
    // Generar el token
    token = await generarJWT(uid);

    // Obtener el usuario
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    })

}


module.exports = {
    login,
    googleSignIn,
    renewToken
}