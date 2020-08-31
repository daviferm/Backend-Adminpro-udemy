const { validationResult } = require('express-validator');
const { response } = require('express')

const validarCampos = (req, res = response, next) => {

    const errores = validationResult(req);
    // Si el arreglo de errores no está vacio...
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    next();
}

module.exports = {
    validarCampos
}