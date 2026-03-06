import express from 'express';
import prisma from '../config/prisma.js';
import auth from '../middleware/auth.js';
import { calculatePricing } from '../utils/pricing.js';

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
        const businessProfile = await prisma.businessProfile.findUnique({
            where: { userId }
        });

        // In SIMPLE mode, we override product variable deductions with business profile defaults
        const isSimple = businessProfile?.pricingMode === 'SIMPLE';
        const dataForCalc = {
            ...otherData,
            taxRate: isSimple ? (businessProfile.taxRate || 0) : (Number(otherData.taxRate) || 0),
            cardFee: isSimple ? (businessProfile.cardFee || 0) : (Number(otherData.cardFee) || 0),
            marketplaceFee: isSimple ? (businessProfile.marketplaceFee || 0) : (Number(otherData.marketplaceFee) || 0),
            commission: isSimple ? (businessProfile.commission || 0) : (Number(otherData.commission) || 0),
            productionCost: Number(otherData.productionCost) || 0,
            laborCost: Number(otherData.laborCost) || 0,
            packagingCost: Number(otherData.packagingCost) || 0,
            shippingCost: Number(otherData.shippingCost) || 0,
            expectedVolume: Number(otherData.expectedVolume) || 100,
            suggestedPrice: Number(otherData.suggestedPrice) || 0,
        };

        const calculated = calculatePricing(dataForCalc, businessProfile);

        const allowedFields = [
            'name', 'category', 'productionCost', 'laborCost', 'packagingCost', 'shippingCost',
            'expectedVolume', 'cardFee', 'commission', 'marketplaceFee', 'taxRate',
            'desiredMargin', 'suggestedPrice', 'maxDiscount', 'competitorPrice', 'currentPrice'
        ];
        const createData = { userId };
        allowedFields.forEach(f => {
            if (dataForCalc[f] !== undefined) {
                if (['productionCost', 'laborCost', 'packagingCost', 'shippingCost', 'expectedVolume', 'cardFee', 'commission', 'marketplaceFee', 'taxRate', 'desiredMargin', 'suggestedPrice', 'maxDiscount', 'competitorPrice', 'currentPrice'].includes(f)) {
                    createData[f] = dataForCalc[f] === null ? null : Number(dataForCalc[f]);
                } else {
                    createData[f] = dataForCalc[f];
                }
            } else if (req.body[f] !== undefined) {
                createData[f] = req.body[f];
            }
        });

        const product = await prisma.product.create({
            data: {
                ...createData,
                ...calculated
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

        const businessProfile = await prisma.businessProfile.findUnique({
            where: { userId }
        });

        // Recalculate metrics based on merged data (incoming + existing)
        const isSimple = businessProfile?.pricingMode === 'SIMPLE';
        const combined = {
            ...existing,
            ...otherData,
            name: name ?? existing.name,
            category: category ?? existing.category,
            suggestedPrice: otherData.suggestedPrice !== undefined ? Number(otherData.suggestedPrice) : existing.suggestedPrice,
            // If Simple, Force profile rates. If Advanced, use body or existing.
            taxRate: isSimple ? (businessProfile.taxRate || 0) : (otherData.taxRate !== undefined ? Number(otherData.taxRate) : existing.taxRate),
            cardFee: isSimple ? (businessProfile.cardFee || 0) : (otherData.cardFee !== undefined ? Number(otherData.cardFee) : existing.cardFee),
            marketplaceFee: isSimple ? (businessProfile.marketplaceFee || 0) : (otherData.marketplaceFee !== undefined ? Number(otherData.marketplaceFee) : existing.marketplaceFee),
            commission: isSimple ? (businessProfile.commission || 0) : (otherData.commission !== undefined ? Number(otherData.commission) : existing.commission),
        };
        const calculated = calculatePricing(combined, businessProfile);

        const allowedFields = [
            'name', 'category', 'productionCost', 'laborCost', 'packagingCost', 'shippingCost',
            'expectedVolume', 'cardFee', 'commission', 'marketplaceFee', 'taxRate',
            'desiredMargin', 'suggestedPrice', 'maxDiscount', 'competitorPrice', 'currentPrice'
        ];
        const updateData = {};
        allowedFields.forEach(f => {
            if (combined[f] !== undefined) {
                // Converta para número se o campo for suposto ser Float ou Int no Prisma
                if (['productionCost', 'laborCost', 'packagingCost', 'shippingCost', 'expectedVolume', 'cardFee', 'commission', 'marketplaceFee', 'taxRate', 'desiredMargin', 'suggestedPrice', 'maxDiscount', 'competitorPrice', 'currentPrice'].includes(f)) {
                    updateData[f] = combined[f] === null ? null : Number(combined[f]);
                } else {
                    updateData[f] = combined[f];
                }
            }
        });

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...updateData,
                ...calculated
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
