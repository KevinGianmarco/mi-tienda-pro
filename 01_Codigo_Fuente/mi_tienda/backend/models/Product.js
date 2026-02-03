const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        default: 0
    },
    image: {
        type: String, // Aquí guardaremos la URL de la imagen (puedes usar una de internet por ahora)
        required: [true, "La URL de la imagen es obligatoria"]
    },
    category: {
        type: String,
        required: [true, "La categoría es obligatoria"]
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatoria"],
        default: 0
    }
}, {
    timestamps: true // Esto crea automáticamente campos de "creado el" y "actualizado el"
});

module.exports = mongoose.model('Product', productSchema);
