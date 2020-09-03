const { response } = require('express');
const Medico = require('../models/medicos');


const getMedicos = async(req, res = response) => {


    try {
        const medicos = await Medico.find()
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img')


        res.status(200).json({
            ok: true,
            medicos
        })



    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}
const crearMedicos = async(req, res = response) => {

    try {
        const uid = req.uid;
        const medico = new Medico({
            ...req.body,
            usuario: uid
        });
        const medicoDB = await medico.save(medico);

        res.status(200).json({
            ok: true,
            msg: 'Registro médico guardado!',
            medico: medicoDB
        })

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }
}
const actualizarMedicos = async(req, res = response) => {

    try {

        const uid = req.params.id;

        const medicoDB = await Medico.findByIdAndUpdate(uid, req.body, { new: true });

        res.status(200).json({
            ok: true,
            msg: 'Médico actualizado',
            medico: medicoDB
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            ok: false,
            msg: 'No existe un Médico con ese id!!'
        })
    }

}
const borrarMedicos = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const medicoDB = await Medico.findById(uid);
        if (!medicoDB) {
            return res.status(401).json({
                ok: false,
                msg: 'No existe un Médico con ese id'
            })
        }

        await Medico.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Médico eliminado',
            medico: medicoDB
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
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    borrarMedicos
}