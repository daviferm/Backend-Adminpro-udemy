//=================================================
// Ruta: '/api/usuarios' 
//=================================================
const { Router } = require('express');
// libreria de express para hacer validaciones
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = require('../controlers/usuarios');
const { validarCampos } = require('../middelwares/validar-campos');
const { verificaToken } = require('../middelwares/autentication');

const router = Router();


router.get('/', verificaToken, getUsuarios);
router.post('/', [
        check('nombre', 'El nombre es obligatorio!').not().isEmpty(),
        check('password', 'La contraseña es obligatoria!').not().isEmpty(),
        check('email', 'El correo es obligatorio!').isEmail(),
        validarCampos,
        verificaToken,
    ],
    crearUsuario
);
router.put('/:id', [
        verificaToken,
        check('nombre', 'El nombre es obligatorio!').not().isEmpty(),
        check('email', 'El correo es obligatorio!').isEmail(),
        check('role', 'El role es obligatorio!').not().isEmail(),
        validarCampos,
    ],
    actualizarUsuario
);
router.delete('/:id',
    verificaToken,
    eliminarUsuario
);


module.exports = router;