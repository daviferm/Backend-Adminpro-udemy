//=================================================
// path => /api/medicos
//=================================================

const { Router } = require('express');
const { getMedicos, crearMedicos, borrarMedicos, actualizarMedicos, obtenerMedicoPorId } = require('../controlers/medicos');
const { check } = require('express-validator');
const { validarCampos } = require('../middelwares/validar-campos');
const { verificaToken } = require('../middelwares/autentication');

const router = Router();


router.get('/', verificaToken, getMedicos);
router.get('/:id', verificaToken, obtenerMedicoPorId);

router.post('/', [
        verificaToken,
        check('nombre', 'El nombre del médico es necesario!!').not().isEmpty(),
        check('hospital', 'El id del hospital es necesario!!').not().isEmpty(),
        validarCampos
    ],
    crearMedicos
);

router.put('/:id', [
        verificaToken,
        check('nombre', 'El nombre del médico es necesario!!').not().isEmpty(),
        check('hospital', 'El id del hospital debe de ser válido!!').isMongoId(),
        validarCampos
    ],
    actualizarMedicos
);

router.delete('/:id',
    verificaToken,
    borrarMedicos
);



module.exports = router;