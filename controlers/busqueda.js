const { response } = require("express");
const Usuario = require('../models/usuarios');
const Hospital = require('../models/hospitales');
const Medico = require('../models/medicos');

const getTodo = async(req, res = response) => {

    const termino = req.params.termino;
    var regex = new RegExp(termino, 'i');

    const [usuarios, hospitales, medicos] = await Promise.all([

        Usuario.find().or([{ nombre: regex }, { email: regex }]),
        Hospital.find({ nombre: regex }),
        Medico.find({ nombre: regex })

    ])

    res.json({
        ok: true,
        usuarios,
        hospitales,
        medicos
    })
}

const getDocumentosColecion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const termino = req.params.termino;

    try {
        var regex = new RegExp(termino, 'i');

        let data = [];
        switch (tabla) {
            case 'usuarios':
                data = await Usuario.find({ nombre: regex });
                break;
            case 'hospitales':
                data = await Hospital.find({ nombre: regex })
                    .populate('usuario', 'nombre img')
                break;
            case 'medicos':
                data = await Medico.find({ nombre: regex })
                    .populate('usuario', 'nombre img')
                    .populate('hospital', 'nombre img')
                break;
            default:
                return res.status(404).json({
                    ok: false,
                    msg: 'La tabla debe de ser: usuarios, hospitales o medicos!!'
                })
        }
        res.status(200).json({
            ok: true,
            coleccion: tabla,
            resultado: data
        })

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    getTodo,
    getDocumentosColecion
}