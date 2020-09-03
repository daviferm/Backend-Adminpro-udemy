const { Schema, model } = require('mongoose');



const HospitalSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    img: { type: String, required: false },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'Hospitales' });

HospitalSchema.method('toJSON', function() {
    // Extraer las propiedades que no quiero que regrese al frontend
    const { __v, ...object } = this.toObject();
    return object;
});


module.exports = model('Hospital', HospitalSchema);