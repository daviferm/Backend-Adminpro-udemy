//=================================================
// path => /api/hospitales
//=================================================

const { Router } = require('express');
const { getHospitales, crearHospitales, borrarHospitales, actualizarHospitales } = require('../controlers/hospitales');
const { check } = require('express-validator');
const { validarCampos } = require('../middelwares/validar-campos');
const { verificaToken } = require('../middelwares/autentication');

const router = Router();


router.get('/', verificaToken, getHospitales);

router.post('/', [
        verificaToken,
        check('nombre', 'El nombre del hospital es obligatorio!').not().isEmpty(),
        validarCampos
    ],
    crearHospitales
);

router.put('/:id', [
        verificaToken,
        check('nombre', 'El nombre es obligatorio!').not().isEmpty(),
        check('usuario', 'El id del usuario es obligatorio!').not().isEmpty(),
    ],
    actualizarHospitales
);

router.delete('/:id',
    borrarHospitales
);






module.exports = router;