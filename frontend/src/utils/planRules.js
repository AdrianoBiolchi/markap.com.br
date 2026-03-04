export const FREE_LIMITS = {
    maxProducts: 5,
    diagnosticInsights: 2,      // Free vê 2, Pro vê 5
    showConsolidatedMetrics: false,
    showMarketComparison: false,
    showAdvancedSimulator: false,
    showFullHistory: false,
    exportPDF: false,
}

export const canAddProduct = (user, productsCount) => {
    if (user.plan === 'FREE') return productsCount < FREE_LIMITS.maxProducts
    return true
}

export const canSeeDiagnostic = (user, insightIndex) => {
    if (user.plan === 'FREE') return insightIndex < FREE_LIMITS.diagnosticInsights
    return true
}
