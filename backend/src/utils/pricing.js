/**
 * Core pricing calculations used by the API to ensure consistency.
 */

export function calculatePricing(product, businessProfile) {
    const {
        productionCost = 0,
        laborCost = 0,
        packagingCost = 0,
        shippingCost = 0,
        taxRate = 0,
        cardFee = 0,
        marketplaceFee = 0,
        commission = 0,
        suggestedPrice = 0,
    } = product;

    const cfPercent = businessProfile?.fixedCostPercentage || 0;
    const directCost = Number(productionCost) + Number(laborCost) + Number(packagingCost) + Number(shippingCost);

    // Total variable deductions as percentage of price
    const varDeductionsPct = Number(taxRate) + Number(cardFee) + Number(marketplaceFee) + Number(commission);

    // Net Margin formula = ((Price - Cost) / Price) * 100 - (Fees + Taxes + Fixed Cost %)
    let netMargin = 0;
    if (suggestedPrice > 0) {
        netMargin = (((suggestedPrice - directCost) / suggestedPrice) * 100) - (varDeductionsPct + cfPercent);
    }

    // Health Score calculation (same logic as frontend)
    // 0-100 scale: 
    // < 0: 0
    // 0-15: 0-45 (linear)
    // 15-30: 45-75 (linear)
    // > 30: 75-100 (capped)
    let healthScore = 0;
    if (netMargin >= 30) {
        healthScore = Math.min(100, 75 + (netMargin - 30) / 2);
    } else if (netMargin >= 15) {
        healthScore = 45 + (netMargin - 15) * 2;
    } else if (netMargin >= 0) {
        healthScore = netMargin * 3;
    }

    // Break Even: unidades mensais necessárias para cobrir os custos fixos alocados a este produto
    // Margem de contribuição por unidade = Preço - Custo Direto - Deduções Variáveis
    // Custos fixos alocados = cfPercent% × Receita estimada (Preço × Volume esperado)
    const contributionMargin = suggestedPrice - directCost - (suggestedPrice * varDeductionsPct / 100);
    const estimatedRevenue = suggestedPrice * (Number(product.expectedVolume) || 30);
    const monthlyFixedCosts = (cfPercent / 100) * estimatedRevenue;
    const breakEven = contributionMargin > 0 ? Math.ceil(monthlyFixedCosts / contributionMargin) : 0;

    // Returns only the derived metrics
    return {
        netMargin: Math.round(netMargin * 10) / 10,
        healthScore: Math.round(healthScore),
        breakEven: Math.max(0, breakEven)
    };
}
