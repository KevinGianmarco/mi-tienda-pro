const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const newProducts = [
     {  name: 'Monitor 4K', 
        price: 350, 
        description: 'Monitor ultra HD para diseño', 
        category: 'Electrónica', 
        stock: 15, 
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400' 
    },
    {   name: 'Audífonos Pro', 
        price: 120, 
        description: 'Cancelación de ruido activa', 
        category: 'Audio', 
        stock: 30, 
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400' 
    },
    {   name: 'Silla Ergonómica', 
        price: 200, 
        description: 'Ideal para largas jornadas', 
        category: 'Muebles', 
        stock: 5, 
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=400'
    },
    { 
        name: 'Teclado Mecánico RGB', 
        price: 85, 
        description: 'Switches blue con retroiluminación para gaming.', 
        category: 'Accesorios', 
        stock: 20, 
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400' 
    },
    { 
        name: 'Mouse Pro Wireless', 
        price: 60, 
        description: 'Sensor óptico de alta precisión y batería de larga duración.', 
        category: 'Accesorios', 
        stock: 15, 
        image: 'https://www.gloriousgaming.com/cdn/shop/files/GLO-MS-S2PRO-WL-BLK_Web_Gallery_Top.webp?v=1726851576&width=800' 
    },

    { 
        name: 'Micrófono de Estudio', 
        price: 150, 
        description: 'Patrón cardioide para grabaciones profesionales.', 
        category: 'Electrónica', 
        stock: 8, 
        image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400' 
    },
    { 
        name: 'Monitor 4k de Estudio', 
        price: 150, 
        description: 'Patrón cardioide para grabaciones profesionales.', 
        category: 'Electrónica', 
        stock: 8, 
        image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400' 
    }

];

const addData = async () => {
    try {
        for (const product of newProducts) {
            // Busca si ya existe un producto con el mismo nombre
            const exists = await Product.findOne({ name: product.name });
            for (const product of newProducts) {
    const exists = await Product.findOne({ name: product.name });

                if (!exists) {
                    await Product.create(product);
                    console.log(`✅ Agregado: ${product.name}`);
                } else {
                    // NUEVO: Si el producto ya existe, actualiza su imagen y otros datos
                    await Product.updateOne(
                        { name: product.name }, 
                        { $set: { image: product.image, price: product.price, description: product.description } }
                    );
                    console.log(`🔄 Actualizado: ${product.name}`);
                }
            }
        }
        console.log('🚀 Proceso terminado');
        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

addData();