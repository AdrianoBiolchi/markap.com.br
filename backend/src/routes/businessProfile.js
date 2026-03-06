import express from 'express';
import prisma from '../config/prisma.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/business-profile
 * Fetches the user's business profile.
 */
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        let profile = await prisma.businessProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            // Create a default profile if it doesn't exist
            profile = await prisma.businessProfile.create({
                data: {
                    userId,
                    pricingMode: 'SIMPLE'
                }
            });
        }

        res.json(profile);
    } catch (err) {
        console.error('Error fetching business profile:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * POST /api/business-profile
 * Creates or updates the user's business profile and calculates the fixed cost percentage.
 */
router.post('/', auth, handleUpsert);

/**
 * PUT /api/business-profile
 * Same as POST — for REST consistency.
 */
router.put('/', auth, handleUpsert);

async function handleUpsert(req, res) {
    const userId = req.user.id;
    const {
        monthlyRent,
        ownerSalary,
        employeesCost,
        utilitiesCost,
        accountingCost,
        systemsCost,
        marketingCost,
        otherFixedCosts,
        expectedMonthlyRevenue,
        pricingMode,
        segment,
        customMarketMargin,
        customMarginGoal,
        monthlyProfitGoal,
        monthlyRevenueGoal,
        taxRate,
        cardFee,
        commission,
        marketplaceFee
    } = req.body;

    try {
        const totalFixedCosts =
            (Number(monthlyRent) || 0) +
            (Number(ownerSalary) || 0) +
            (Number(employeesCost) || 0) +
            (Number(utilitiesCost) || 0) +
            (Number(accountingCost) || 0) +
            (Number(systemsCost) || 0) +
            (Number(marketingCost) || 0) +
            (Number(otherFixedCosts) || 0);

        const fRevenue = Number(expectedMonthlyRevenue) || 0;
        const fixedCostPercentage = fRevenue > 0 ? (totalFixedCosts / fRevenue) * 100 : 0;

        const profileData = {
            monthlyRent: Number(monthlyRent) || 0,
            ownerSalary: Number(ownerSalary) || 0,
            employeesCost: Number(employeesCost) || 0,
            utilitiesCost: Number(utilitiesCost) || 0,
            accountingCost: Number(accountingCost) || 0,
            systemsCost: Number(systemsCost) || 0,
            marketingCost: Number(marketingCost) || 0,
            otherFixedCosts: Number(otherFixedCosts) || 0,
            expectedMonthlyRevenue: fRevenue,
            pricingMode: pricingMode || 'SIMPLE',
            fixedCostPercentage,
            segment: segment || 'outro',
            customMarketMargin: Number(customMarketMargin) || 0,
            customMarginGoal: Number(customMarginGoal) || 0,
            monthlyProfitGoal: Number(monthlyProfitGoal) || 0,
            monthlyRevenueGoal: Number(monthlyRevenueGoal) || 0,
            taxRate: Number(taxRate) || 0,
            cardFee: Number(cardFee) || 0,
            commission: Number(commission) || 0,
            marketplaceFee: Number(marketplaceFee) || 0,
        };


        const profile = await prisma.businessProfile.upsert({
            where: { userId },
            update: profileData,
            create: {
                ...profileData,
                userId
            }
        });

        res.json(profile);
    } catch (err) {
        console.error('Error updating business profile:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * GET /api/business-profile/cf-percent
 * Returns only the calculated CF%.
 */
router.get('/cf-percent', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await prisma.businessProfile.findUnique({
            where: { userId }
        });

        res.json({ cfPercent: profile ? profile.fixedCostPercentage : 0 });
    } catch (err) {
        console.error('Error fetching CF%:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
