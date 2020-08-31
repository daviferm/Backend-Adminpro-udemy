//=================================================
// Login usuario => path - /api/login
//=================================================
const { Router } = require('express');
// libreria de express para hacer validaciones
const { check } = require('express-validator');
const { login } = require('../controlers/auth');
const { validarCampos } = require('../middelwares/validar-campos');

const router = Router();

router.post('/', [
        check('email', 'El correo es obligatorio!').isEmail(),
        check('password', 'La contraseña es obligatoria!').not().isEmpty(),
        validarCampos
    ],
    login
);


module.exports = router;