const jwt = require('jsonwebtoken');


const verificaToken = (req, res, next) => {

    // Leer el token del encabezado
    // const token = req.get('token');
    const token = req.header('token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token!!'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

module.exports = {
    verificaToken
}