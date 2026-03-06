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
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Erro ao carregar produtos' });
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
                suggestedPrice: Number(otherData.suggestedPrice) || 0,
                netMargin: Number(otherData.netMargin) || 0,
                healthScore: Math.round(Number(otherData.healthScore)) || 0,
                breakEven: Math.round(Number(otherData.breakEven)) || 0
            }
        });
        res.status(201).json(product);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// Update product
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, category, ...otherData } = req.body;
    const userId = req.user.id;

    try {
        // First check if product belongs to user
        const existing = await prisma.product.findFirst({
            where: { id, userId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Produto não encontrado ou acesso negado' });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                category,
                productionCost: Number(otherData.productionCost) ?? existing.productionCost,
                laborCost: Number(otherData.laborCost) ?? existing.laborCost,
                packagingCost: Number(otherData.packagingCost) ?? existing.packagingCost,
                shippingCost: Number(otherData.shippingCost) ?? existing.shippingCost,
                expectedVolume: Number(otherData.expectedVolume) ?? existing.expectedVolume,
                cardFee: Number(otherData.cardFee) ?? existing.cardFee,
                commission: Number(otherData.commission) ?? existing.commission,
                marketplaceFee: Number(otherData.marketplaceFee) ?? existing.marketplaceFee,
                taxRate: Number(otherData.taxRate) ?? existing.taxRate,
                desiredMargin: Number(otherData.desiredMargin) ?? existing.desiredMargin,
                suggestedPrice: Number(otherData.suggestedPrice) ?? existing.suggestedPrice,
                netMargin: Number(otherData.netMargin) ?? existing.netMargin,
                healthScore: Math.round(Number(otherData.healthScore)) ?? existing.healthScore,
                breakEven: Math.round(Number(otherData.breakEven)) ?? existing.breakEven
            }
        });

        res.json(product);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const existing = await prisma.product.findFirst({
            where: { id, userId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        await prisma.product.delete({
            where: { id }
        });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
