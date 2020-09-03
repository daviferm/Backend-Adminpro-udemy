const { response } = require('express');
const Hospital = require('../models/hospitales');


const getHospitales = async(req, res = response) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    try {
        const hospitales = await Hospital.find()
            .populate('usuario', 'nombre img')
            .skip(desde)
            .limit(limite)

        const conteo = await Hospital.countDocument();
        res.status(200).json({
            ok: true,
            hospitales,
            conteo
        })

    } catch (error) {

        console.log(error);
        res.status(404).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}
const crearHospitales = async(req, res = response) => {

    const { nombre } = req.body;

    try {

        const existeHospital = await Hospital.findOne({ nombre: nombre });
        if (existeHospital) {
            return res.status(409).json({
                ok: false,
                msg: 'Ya existe un hospital con ese nombre!!',
                hospital: existeHospital
            })
        }

        const body = {
            ...req.body,
            usuario: req.uid
        }

        const hospital = new Hospital(body);

        hospital.save();

        res.status(200).json({
            ok: true,
            hospital,
        })

    } catch (error) {

        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }


}
const actualizarHospitales = async(req, res = response) => {


    try {

        const uid = req.params.id;

        const hospitalActualizado = await Hospital.findByIdAndUpdate(uid, req.body, { new: true });

        res.status(200).json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            ok: false,
            msg: 'No existe un hospital con ese id!!'
        })
    }
}
const borrarHospitales = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const hospitalDB = await Medico.findById(uid);
        if (!hospitalDB) {
            return res.status(401).json({
                ok: false,
                msg: 'No existe un Hospital con ese id'
            })
        }

        await Hospital.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Médico eliminado',
            hospital: hospitalDB
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    getHospitales,
    crearHospitales,
    actualizarHospitales,
    borrarHospitales
}