import express from 'express';
import prisma from '../config/prisma.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all products for user
router.get('/', auth, async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create product
router.post('/', auth, async (req, res) => {
    const { name, category, ...otherData } = req.body;
    const userId = req.user.id;

    try {
        const product = await prisma.product.create({
            data: {
                userId,
                name,
                category,
                productionCost: Number(otherData.productionCost) || 0,
                laborCost: Number(otherData.laborCost) || 0,
                packagingCost: Number(otherData.packagingCost) || 0,
                shippingCost: Number(otherData.shippingCost) || 0,
                expectedVolume: Number(otherData.expectedVolume) || 100,
                cardFee: Number(otherData.cardFee) || 0,
                commission: Number(otherData.commission) || 0,
                marketplaceFee: Number(otherData.marketplaceFee) || 0,
                taxRate: Number(otherData.taxRate) || 0,
                desiredMargin: Number(otherData.desiredMargin) || 20,
                suggestedPrice: Number(otherData.suggestedPrice),
                netMargin: Number(otherData.netMargin),
                healthScore: Number(otherData.healthScore),
                breakEven: Number(otherData.breakEven)
            }
        });
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, category, ...otherData } = req.body;
    const userId = req.user.id;

    try {
        const product = await prisma.product.update({
            where: {
                id,
                userId // Ensure user owns the product
            },
            data: {
                name,
                category,
                productionCost: Number(otherData.productionCost),
                laborCost: Number(otherData.laborCost),
                packagingCost: Number(otherData.packagingCost),
                shippingCost: Number(otherData.shippingCost),
                expectedVolume: Number(otherData.expectedVolume),
                cardFee: Number(otherData.cardFee),
                commission: Number(otherData.commission),
                marketplaceFee: Number(otherData.marketplaceFee),
                taxRate: Number(otherData.taxRate),
                desiredMargin: Number(otherData.desiredMargin),
                suggestedPrice: Number(otherData.suggestedPrice),
                netMargin: Number(otherData.netMargin),
                healthScore: Number(otherData.healthScore),
                breakEven: Number(otherData.breakEven)
            }
        });

        res.json(product);
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        await prisma.product.delete({
            where: {
                id,
                userId
            }
        });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
