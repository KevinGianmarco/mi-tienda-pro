const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // Verifica que este archivo exista en models/

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = [
   
];

const importData = async () => {
    try {
        /*await Product.deleteMany(); // Borra lo que haya para no duplicar*/
        await Product.insertMany(products);
        console.log('📦 ¡Productos de prueba insertados con éxito!');
        process.exit();
    } catch (error) {
        console.error('❌ Error al importar datos:', error);
        process.exit(1);
    }
};

importData();