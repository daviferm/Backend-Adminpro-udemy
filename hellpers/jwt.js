const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {

        // Objeto por si queremos mandar mas parámetros
        const paylod = {
            uid,
        };

        jwt.sign({
            uid
        }, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se puedo optener el jwt!!');
            } else {
                resolve(token);
            }

        });

    })



}

module.exports = {
    generarJWT
};