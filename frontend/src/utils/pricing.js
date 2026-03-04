// ============================================================
// MARKAP — LÓGICA DE CÁLCULO v2.0
// Metodologia: Markup com rateio de custos fixos por faturamento
// Referência: SEBRAE, Margem de Contribuição, markup divisor
// ============================================================

/**
 * MODO SIMPLES (recomendado para maioria dos empresários)
 * 
 * CF% = Custos Fixos Mensais Totais ÷ Faturamento Previsto Total × 100
 * Markup = 100 ÷ (100 - CF% - DespesasVariáveis% - MargemDesejada%)
 * Preço = Custo Direto Unitário × Markup
 * 
 * Lógica: os custos fixos são tratados como percentual do faturamento,
 * assim são rateados proporcionalmente entre TODOS os produtos,
 * não sobrecarregando nenhum produto individualmente.
 */

// Custo Direto Total por Unidade (só custos do produto em si)
export const calcDirectCost = (product) => {
    return (
        (product.productionCost || 0) +
        (product.laborCost || 0) +
        (product.packagingCost || 0) +
        (product.shippingCost || 0)
    )
}

// Despesas Variáveis Totais em % (incidem sobre o preço de venda)
export const calcVariableExpensesPercent = (product) => {
    return (
        (product.taxRate || 0) +
        (product.cardFee || 0) +
        (product.commission || 0) +
        (product.marketplaceFee || 0)
    )
}

// CF% — Percentual de Custo Fixo sobre Faturamento (Modo Simples)
export const calcFixedCostPercent = (businessProfile) => {
    if (!businessProfile) return 0
    const totalFixed =
        (businessProfile.monthlyRent || 0) +
        (businessProfile.ownerSalary || 0) +
        (businessProfile.employeesCost || 0) +
        (businessProfile.utilitiesCost || 0) +
        (businessProfile.accountingCost || 0) +
        (businessProfile.systemsCost || 0) +
        (businessProfile.marketingCost || 0) +
        (businessProfile.otherFixedCosts || 0)

    const revenue = businessProfile.expectedMonthlyRevenue || 0

    if (revenue <= 0) return 0
    return (totalFixed / revenue) * 100
}

// Markup Divisor — fórmula padrão SEBRAE/markup
// Markup = 100 ÷ (100 - CF% - DV% - ML%)
export const calcMarkup = (fixedCostPercent, variableExpensesPercent, desiredMargin) => {
    const denominator = 100 - fixedCostPercent - variableExpensesPercent - desiredMargin
    if (denominator <= 0) return 0 // configuração inviável
    return 100 / denominator
}

// Preço Sugerido (Modo Simples)
export const calcSuggestedPrice = (product, businessProfile) => {
    const directCost = calcDirectCost(product)
    const cfPercent = calcFixedCostPercent(businessProfile)
    const dvPercent = calcVariableExpensesPercent(product)
    const desiredMargin = product.desiredMargin || 20
    const markup = calcMarkup(cfPercent, dvPercent, desiredMargin)
    if (markup <= 0) return 0
    return directCost * markup
}

// Preço Mínimo (margem zero — só cobre custos)
export const calcMinimumPrice = (product, businessProfile) => {
    const directCost = calcDirectCost(product)
    const cfPercent = calcFixedCostPercent(businessProfile)
    const dvPercent = calcVariableExpensesPercent(product)
    const markup = calcMarkup(cfPercent, dvPercent, 0)
    if (markup <= 0) return 0
    return directCost * markup
}

// Margem Líquida Real dado um preço de venda
export const calcNetMargin = (product, businessProfile, sellingPrice) => {
    if (!sellingPrice || sellingPrice <= 0) return 0
    const directCost = calcDirectCost(product)
    const cfPercent = calcFixedCostPercent(businessProfile)
    const dvPercent = calcVariableExpensesPercent(product)
    const fixedCostValue = sellingPrice * (cfPercent / 100)
    const variableCostValue = sellingPrice * (dvPercent / 100)
    const totalCost = directCost + fixedCostValue + variableCostValue
    return ((sellingPrice - totalCost) / sellingPrice) * 100
}

// Lucro Líquido por Unidade
export const calcNetProfitPerUnit = (product, businessProfile, sellingPrice) => {
    if (!sellingPrice || sellingPrice <= 0) return 0
    return sellingPrice * (calcNetMargin(product, businessProfile, sellingPrice) / 100)
}

// Margem de Contribuição por Unidade (preço - custos variáveis - custo direto)
export const calcContributionMargin = (product, sellingPrice) => {
    if (!sellingPrice || sellingPrice <= 0) return 0
    const directCost = calcDirectCost(product)
    const dvPercent = calcVariableExpensesPercent(product)
    const variableCostValue = sellingPrice * (dvPercent / 100)
    return sellingPrice - directCost - variableCostValue
}

// Ponto de Equilíbrio em unidades
// PE = Custos Fixos Totais ÷ Margem de Contribuição Unitária
export const calcBreakEven = (businessProfile, product, sellingPrice) => {
    if (!businessProfile) return 0
    const totalFixed =
        (businessProfile.monthlyRent || 0) +
        (businessProfile.ownerSalary || 0) +
        (businessProfile.employeesCost || 0) +
        (businessProfile.utilitiesCost || 0) +
        (businessProfile.accountingCost || 0) +
        (businessProfile.systemsCost || 0) +
        (businessProfile.marketingCost || 0) +
        (businessProfile.otherFixedCosts || 0)

    const contributionMargin = calcContributionMargin(product, sellingPrice)
    if (contributionMargin <= 0) return 9999
    return Math.ceil(totalFixed / contributionMargin)
}

// Score de Saúde 0-100
export const calcHealthScore = (netMargin, breakEven, expectedVolume) => {
    let score = 0
    // Margem (40 pontos)
    if (netMargin >= 20) score += 40
    else if (netMargin >= 15) score += 30
    else if (netMargin >= 10) score += 20
    else if (netMargin >= 5) score += 10
    else if (netMargin > 0) score += 5
    // Break-even vs volume (40 pontos)
    const ratio = expectedVolume > 0 ? breakEven / expectedVolume : 1
    if (ratio <= 0.3) score += 40
    else if (ratio <= 0.5) score += 30
    else if (ratio <= 0.7) score += 20
    else if (ratio <= 1.0) score += 10
    // Margem de segurança (20 pontos)
    if (netMargin >= 25) score += 20
    else if (netMargin >= 15) score += 10
    return Math.min(score, 100)
}

// Composição do preço para barra visual
// Retorna objeto com % de cada componente
export const calcPriceComposition = (product, businessProfile, sellingPrice) => {
    const directCost = calcDirectCost(product)
    const cfPercent = calcFixedCostPercent(businessProfile)
    const dvPercent = calcVariableExpensesPercent(product)

    if (!sellingPrice || sellingPrice <= 0) {
        return {
            directCost: 0,
            fixedCost: 0,
            variableExpenses: 0,
            profit: 0,
            directCostValue: directCost,
            fixedCostValue: 0,
            variableExpensesValue: 0,
            profitValue: 0
        }
    }

    const directCostPercent = (directCost / sellingPrice) * 100
    const fixedCostPercent = cfPercent
    const variableExpensesPercent = dvPercent
    const profitPercent = 100 - directCostPercent - fixedCostPercent - variableExpensesPercent

    return {
        directCost: Math.max(0, directCostPercent),
        fixedCost: Math.max(0, fixedCostPercent),
        variableExpenses: Math.max(0, variableExpensesPercent),
        profit: Math.max(0, profitPercent),
        // Valores em R$
        directCostValue: directCost,
        fixedCostValue: sellingPrice * (cfPercent / 100),
        variableExpensesValue: sellingPrice * (dvPercent / 100),
        profitValue: sellingPrice * (Math.max(0, profitPercent) / 100),
    }
}

// ============================================================
// MODO AVANÇADO (escondido — aparece só em Configurações > Avançado)
// O usuário define manualmente o CF% para cada produto
// Útil para produtos com estruturas de custo muito diferentes
// ============================================================

export const calcSuggestedPriceAdvanced = (product, manualCfPercent) => {
    const directCost = calcDirectCost(product)
    const dvPercent = calcVariableExpensesPercent(product)
    const desiredMargin = product.desiredMargin || 20
    const markup = calcMarkup(manualCfPercent, dvPercent, desiredMargin)
    if (markup <= 0) return 0
    return directCost * markup
}
