const express = require('express');
const router = express.Router();
require('dotenv').config();
const Product = require('../models/Product'); // 👈 REVISA ESTE NOMBRE
// console.log("Mi clave secreta es:", process.env.STRIPE_SECRET_KEY);

// 1. OBTENER TODOS
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. CREAR PRODUCTO
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product({
            ...req.body,
            price: Number(req.body.price),
            stock: Number(req.body.stock)
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 3. ACTUALIZAR PRODUCTO (Botón Naranja)
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            {
                ...req.body,
                price: Number(req.body.price),
                stock: Number(req.body.stock)
            }, 
            { new: true }
        );
        
        if (!updatedProduct) return res.status(404).json({ message: "No encontrado" });
        
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error en PUT:", error);
        res.status(500).json({ message: "Error al actualizar" });
    }
});

// 4. ELIMINAR POR ID
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reemplaza la línea 62 por esta
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;

        const line_items = items.map((item) => ({
            price_data: {
                currency: 'pen',
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: 1,
        }));

        // ... código anterior de la sesión ...

            const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/',
            });

// ✅ CAMBIO IMPORTANTE: Envía 'session' completa, no solo el { id }
res.json(session);
    } catch (error) {
        console.error("DETALLE DEL ERROR EN TERMINAL:", error.message); // Mira tu terminal negra
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;