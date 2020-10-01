const { response } = require('express');
const { subirPorTipo } = require('../hellpers/actualizar-img');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

const subirImagen = (req, res = response) => {

    // Validar que existe un archivo
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No seleccionó nada.',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }


    const tipo = req.params.tabla;
    const id = req.params.id;
    const archivo = req.files.imagen;
    const nombreCortado = archivo.name.split('.');
    const extArchivo = nombreCortado[nombreCortado.length - 1];

    const tiposValidos = ['usuarios', 'hospitales', 'medicos'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(404).json({
            ok: false,
            msg: 'Tipos permitidos: usuarios, hospitales, medicos!'
        })
    }
    // Solo aceptamos estas extensiones
    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (!extValidas.includes(extArchivo)) {
        return res.status(404).json({
            ok: false,
            msg: 'Extensiones permitidas: png, jpg, gif, jpeg!!'
        })
    }

    // Nombre único del archivo
    const nombreArchivo = `${uuid.v4()}.${extArchivo}`;

    subirPorTipo(tipo, id, nombreArchivo, res, archivo);

}

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tabla;
    const img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../uploads/no-img.jpg');
        res.sendFile(pathNoImage);
    }
}


module.exports = {
    subirImagen,
    retornaImagen
}