const { Schema, model } = require('mongoose');


const MedicoSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    img: { type: String, required: false },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
}, { collection: 'Medicos' });


MedicoSchema.method('toJSON', function() {
    // Extraer las propiedades que no quiero que regrese al frontend
    const { __v, ...object } = this.toObject();
    return object;
});


module.exports = model('Medico', MedicoSchema);