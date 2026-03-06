// src/data/segmentBenchmarks.js
// Fonte: Sebrae 2025, CNC, IBGE — Projeções para pequenos negócios brasileiros

export const SEGMENT_BENCHMARKS = {
    alimentacao: {
        label: "Alimentação e Bebidas",
        icon: "🍽️",
        source: "Sebrae 2025",
        thresholds: { risco: 18, atencao: 28 },   // Ajustado para 2025 (+custos operacionais)
        marketAvg: 32,
        description: "Restaurantes, lanchonetes, confeitarias, delivery"
    },
    vestuario: {
        label: "Vestuário e Moda",
        icon: "👗",
        source: "Sebrae 2025",
        thresholds: { risco: 35, atencao: 55 },
        marketAvg: 60,
        description: "Roupas, acessórios, calçados, artesanato têxtil"
    },
    artesanato: {
        label: "Artesanato e Presentes",
        icon: "🎨",
        source: "Sebrae / ABRAFAR 2025",
        thresholds: { risco: 30, atencao: 45 },
        marketAvg: 52,
        description: "Peças artesanais, decoração, lembranças, bijuterias"
    },
    beleza: {
        label: "Beleza e Estética",
        icon: "💅",
        source: "Sebrae 2025",
        thresholds: { risco: 45, atencao: 58 },
        marketAvg: 65,
        description: "Salões, barbearias, estética, manicure"
    },
    servicos: {
        label: "Serviços Gerais",
        icon: "🔧",
        source: "Sebrae 2024",
        thresholds: { risco: 25, atencao: 38 },
        marketAvg: 45,
        description: "Consertos, manutenção, consultoria, freelance"
    },
    tecnologia: {
        label: "Tecnologia e Software",
        icon: "💻",
        source: "Sebrae / ABES 2025",
        thresholds: { risco: 35, atencao: 55 },
        marketAvg: 65,
        description: "Desenvolvimento, suporte técnico, design digital"
    },
    comercio: {
        label: "Comércio e Varejo",
        icon: "🛒",
        source: "CNC / Sebrae 2025",
        thresholds: { risco: 12, atencao: 22 },
        marketAvg: 28,
        description: "Revenda, lojas físicas, e-commerce, marketplace"
    },
    saude: {
        label: "Saúde e Bem-estar",
        icon: "🏥",
        source: "Sebrae 2025",
        thresholds: { risco: 28, atencao: 42 },
        marketAvg: 55,
        description: "Clínicas, farmácias, suplementos, terapias"
    },
    educacao: {
        label: "Educação e Cursos",
        icon: "📚",
        source: "Sebrae 2025",
        thresholds: { risco: 35, atencao: 55 },
        marketAvg: 62,
        description: "Cursos online, aulas particulares, treinamentos"
    },
    outro: {
        label: "Outro segmento",
        icon: "📦",
        source: "Sebrae (geral)",
        thresholds: { risco: 15, atencao: 25 },
        marketAvg: 30,
        description: "Segmento não listado"
    },
}

// Função utilitária para calcular status do produto
export function getProductStatus(netMargin, segment = "outro", customMargin = 0) {
    if (customMargin > 0) {
        // Se houver margem customizada, usamos ela como alvo (100% da margem customizada é o ok)
        // Risco se for menos de 60% da meta, Atenção se for entre 60% e 90%
        if (netMargin < customMargin * 0.6) return "risco"
        if (netMargin < customMargin * 0.9) return "atencao"
        return "ok"
    }

    const bench = SEGMENT_BENCHMARKS[segment] || SEGMENT_BENCHMARKS.outro
    const { risco, atencao } = bench.thresholds
    if (netMargin < risco) return "risco"
    if (netMargin < atencao) return "atencao"
    return "ok"
}

// Função para calcular healthScore 0-100
export function getHealthScore(netMargin, segment = "outro", customMargin = 0) {
    if (netMargin <= 0) return 0

    let target, riskLevel, warnLevel;

    if (customMargin > 0) {
        target = customMargin;
        riskLevel = customMargin * 0.6;
        warnLevel = customMargin * 0.9;
    } else {
        const bench = SEGMENT_BENCHMARKS[segment] || SEGMENT_BENCHMARKS.outro
        target = bench.marketAvg;
        riskLevel = bench.thresholds.risco;
        warnLevel = bench.thresholds.atencao;
    }

    if (netMargin < riskLevel) return Math.round((netMargin / riskLevel) * 30) // 0-30
    if (netMargin < warnLevel) return Math.round(30 + ((netMargin - riskLevel) / (warnLevel - riskLevel)) * 30) // 30-60
    return Math.min(Math.round(60 + ((netMargin - warnLevel) / (target - warnLevel)) * 40), 100) // 60-100
}
