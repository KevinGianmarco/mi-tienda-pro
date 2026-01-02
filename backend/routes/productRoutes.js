const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // 👈 REVISA ESTE NOMBRE

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

module.exports = router;