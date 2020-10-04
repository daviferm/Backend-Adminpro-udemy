//=================================================
// Ruta: '/api/usuarios' 
//=================================================
const { Router } = require('express');
// libreria de express para hacer validaciones
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = require('../controlers/usuarios');
const { validarCampos } = require('../middelwares/validar-campos');
const { verificaToken, validarADMIN_ROLE, validarADMIN_ROLEoMismoUsuario } = require('../middelwares/autentication');

const router = Router();


router.get('/', [verificaToken, validarADMIN_ROLE], getUsuarios);
router.post('/', [
        check('nombre', 'El nombre es obligatorio!').not().isEmpty(),
        check('password', 'La contraseña es obligatoria!').not().isEmpty(),
        check('email', 'El correo es obligatorio!').isEmail(),
        validarCampos,
    ],
    crearUsuario
);
router.put('/:id', [
        verificaToken,
        validarADMIN_ROLEoMismoUsuario,
        check('nombre', 'El nombre es obligatorio!').not().isEmpty(),
        check('email', 'El correo es obligatorio!').isEmail(),
        check('role', 'El role es obligatorio!').not().isEmail(),
        validarCampos,
    ],
    actualizarUsuario
);
router.delete('/:id', [verificaToken, validarADMIN_ROLE],
    eliminarUsuario
);


module.exports = router;