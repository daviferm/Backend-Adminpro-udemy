const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');


const verificaToken = (req, res, next) => {

    // Leer el token del encabezado
    // const token = req.get('token');
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token!!'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al verificar el token'
        })
    }

}

const validarADMIN_ROLE = async(req, res, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no está en la base de datos!'
            })
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene permiso de Administrador!'
            })
        }
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Error inesperado al validar el role!'
        })
    }
}
const validarADMIN_ROLEoMismoUsuario = async(req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no está en la base de datos!'
            })
        }

        if (usuarioDB.role === 'ADMIN_ROLE' && uid === id) {
            next();
            res.status(200).json({
                ok: true,
                msg: 'Actualización correcta'
            })
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene permiso de Administrador!'
            })
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Error inesperado al validar el role!'
        })
    }
}

module.exports = {
    verificaToken,
    validarADMIN_ROLE,
    validarADMIN_ROLEoMismoUsuario
}