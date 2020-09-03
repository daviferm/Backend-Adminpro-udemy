//=================================================
// path => api/todo
//=================================================

const { Router } = require('express');
const { getTodo, getDocumentosColecion } = require('../controlers/busqueda');
const { verificaToken } = require('../middelwares/autentication');

const router = Router();


router.get('/:termino', verificaToken, getTodo);
router.get('/coleccion/:tabla/:termino', verificaToken, getDocumentosColecion);





module.exports = router;