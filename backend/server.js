const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const Product = require('./models/Product');
require('dotenv').config();

const app = express();

// 1. CONFIGURACIÓN (OBLIGATORIO PRIMERO)
app.use(cors());
app.use(express.json());

// 2. CONEXIÓN
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Conectado'))
    .catch(err => console.error('❌ Error DB:', err));

// 3. RUTAS
app.use('/api/products', productRoutes);

// ... (resto del código arriba igual)


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));