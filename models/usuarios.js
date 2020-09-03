const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    menssage: '{VALUE} no es un role válido!'
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        require: [true, 'El Email es requerido'],
        unique: [true, 'El correo ya existe']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        anum: rolesValidos
    },
    google: {
        type: Boolean,
        default: false
    }
});


usuarioSchema.method('toJSON', function() {

    // Extraer las propiedades que no quiero que regrese al frontend
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;

    return object;
});


usuarioSchema.plugin(uniqueValidator, { menssage: '{PATH} debe de ser único!' });

module.exports = model('Usuario', usuarioSchema);