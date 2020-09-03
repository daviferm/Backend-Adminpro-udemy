//=================================================
// path => api/upload
//=================================================
const { Router } = require('express');
const { verificaToken } = require('../middelwares/autentication');
const { subirImagen, retornaImagen } = require('../controlers/upload');

const fileUpload = require('express-fileupload');


const router = Router();
router.use(fileUpload());

router.put('/:tabla/:id', verificaToken, subirImagen);
router.get('/:tabla/:img', verificaToken, retornaImagen);


module.exports = router;