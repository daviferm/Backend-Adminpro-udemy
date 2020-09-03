const fs = require('fs');
const Usuario = require('../models/usuarios');
const Hospital = require('../models/hospitales');
const Medico = require('../models/medicos');


const subirPorTipo = async(tipo, id, nombreArchivo, res, archivo) => {

    switch (tipo) {
        case 'usuarios':

            actualizarRegistro(Usuario, id, res, archivo, nombreArchivo, tipo);

            break;
        case 'hospitales':

            actualizarRegistro(Hospital, id, res, archivo, nombreArchivo, tipo);

            break;
        case 'medicos':

            actualizarRegistro(Medico, id, res, archivo, nombreArchivo, tipo);

            break;
        default:
            res.status(400).json({
                ok: false,
                msg: 'Error inesperado (tipo)'
            })
            break;
    }
}

// Actualizar base de datos
const actualizarRegistro = (registro, id, res, archivo, nombreArchivo, tipo) => {
    // Mover el archivo a la carpeta
    let path = `./uploads/${tipo}/${nombreArchivo}`;

    registro.findById(id, async(err, registroDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }

        subirImgNueva(archivo, path, res);

        const pathViejo = `./uploads/${tipo}/${registroDB.img}`;

        // Si existe elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
            fs.unlinkSync(pathViejo);
        }

        registroDB.img = nombreArchivo;
        const registroActualizado = await registroDB.save();

        res.json({
            ok: true,
            msg: `Imagen subida (${tipo})`,
            registro: registroActualizado
        })
    });
}

const subirImgNueva = (archivo, path, res) => {
    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al guardar el archivo.',
                errors: err
            });
        }

    })

}

module.exports = {
    subirPorTipo
};