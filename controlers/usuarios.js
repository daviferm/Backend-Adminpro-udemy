const { response } = require('express');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email img role google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    })
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;


    try {

        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe!!'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        res.status(200).json({
            ok: true,
            usuario,
            // token
        })

    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }

}

const actualizarUsuario = async(req, res = response) => {

    // TODO Validar token y comprobar si es el usuario correcto

    const uid = req.params.id

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese id'
            })
        }
        // Actualizar
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email!'
                })
            }
        }
        // delete campos.password;
        // delete campos.google;

        campos.email = email;

        // Actualizar
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.status(200).json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const eliminarUsuario = async(req, res = response) => {

    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            })
        }

        await Usuario.findByIdAndRemove(id);

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado',
            usuario: usuarioDB
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }


}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};