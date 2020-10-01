const { response } = require('express');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../hellpers/jwt');

const getUsuarios = async(req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(limite),

        Usuario.countDocuments()
    ])

    res.json({
        ok: true,
        usuarios,
        total
    })
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;


    try {

        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado!'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        // Generar el token
        const token = await generarJWT(usuario.uid);

        res.status(200).json({
            ok: true,
            token,
            usuario
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

    const uid = req.params.id;

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
        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden modificar el correo!'
            })
        }

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