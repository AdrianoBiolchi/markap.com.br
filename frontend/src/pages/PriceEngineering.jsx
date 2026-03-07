import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import AppShell from '../components/AppShell'
import { C } from '../tokens/colors'

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmt(value) {
    if (!value && value !== 0) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function parseBRL(str) {
    const cleaned = String(str).replace(/[^\d,]/g, '').replace(',', '.')
    return parseFloat(cleaned) || 0
}

function parsePct(str) {
    const cleaned = String(str).replace(/[^\d,]/g, '').replace(',', '.')
    return Math.min(100, parseFloat(cleaned) || 0)
}

// ─── Input de moeda ────────────────────────────────────────────────────────

function CurrencyInput({ label, hint, value, onChange }) {
    const [focused, setFocused] = useState(false)
    const [raw, setRaw] = useState('')

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {label && (
                <label style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#374151',
                    letterSpacing: '0.01em',
                }}>{label}</label>
            )}
            <input
                type="text"
                value={focused ? raw : (value ? fmt(value) : '')}
                placeholder="R$ 0,00"
                onFocus={() => { setFocused(true); setRaw(value ? String(value).replace('.', ',') : '') }}
                onBlur={() => { setFocused(false); onChange(parseBRL(raw)) }}
                onChange={e => setRaw(e.target.value.replace(/[^\d,]/g, ''))}
                style={{
                    width: '100%',
                    padding: '11px 14px',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 15,
                    color: '#0F0E0C',
                    background: '#F9FAFB',
                    border: `1.5px solid ${focused ? '#1A5C3A' : 'transparent'}`,
                    borderRadius: 12,
                    outline: 'none',
                    boxShadow: focused ? '0 0 0 4px rgba(26,92,58,0.08)' : 'none',

                    transition: 'all 0.15s ease',
                }}
            />
            {hint && (
                <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {hint}
                </p>
            )}
        </div>
    )
}

// ─── Input de percentual ───────────────────────────────────────────────────

function PctInput({ label, hint, value, onChange }) {
    const [focused, setFocused] = useState(false)
    const [raw, setRaw] = useState('')

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {label && (
                <label style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#374151',
                }}>{label}</label>
            )}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#F9FAFB',
                border: `1.5px solid ${focused ? '#1A5C3A' : 'transparent'}`,
                borderRadius: 12,
                boxShadow: focused ? '0 0 0 4px rgba(26,92,58,0.08)' : 'none',
                transition: 'all 0.15s ease',
                overflow: 'hidden',

            }}>
                <input
                    type="text"
                    value={focused ? raw : (value ? String(value).replace('.', ',') : '')}
                    placeholder="0"
                    onFocus={() => { setFocused(true); setRaw(value ? String(value).replace('.', ',') : '') }}
                    onBlur={() => { setFocused(false); onChange(parsePct(raw)) }}
                    onChange={e => setRaw(e.target.value.replace(/[^\d,]/g, ''))}
                    style={{
                        flex: 1,
                        padding: '11px 14px',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 15,
                        color: '#0F0E0C',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                    }}
                />
                <span style={{
                    padding: '11px 14px',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 15,
                    color: '#9CA3AF',
                    background: 'rgba(0,0,0,0.03)',
                    borderLeft: '1px solid rgba(0,0,0,0.05)',

                }}>%</span>
            </div>
            {hint && (
                <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {hint}
                </p>
            )}
        </div>
    )
}

// ─── Componente principal ──────────────────────────────────────────────────

export default function PriceEngineering() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState(0)
    const [productName, setProductName] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [saving, setSaving] = useState(false)
    const [businessProfile, setBusinessProfile] = useState(null)
    const [activeSeg, setActiveSeg] = useState(null)

    const [form, setForm] = useState({
        productionCost: 0,
        laborCost: 0,
        packagingCost: 0,
        shippingCost: 0,
        taxRate: 0,
        cardFee: 0,
        marketplaceFee: 0,
        commission: 0,
        desiredMargin: 30,
        expectedVolume: 100,
        competitorPrice: 0,
    })

    const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }))

    useEffect(() => {
        async function loadData() {
            try {
                // Carregar perfil completo
                const profRes = await api.get('/business-profile')
                setBusinessProfile(profRes.data)

                // Carregar produto se estiver editando
                if (id) {
                    const pRes = await api.get('/products')
                    const product = pRes.data.find(p => p.id === id)
                    if (product) {
                        setProductName(product.name)
                        setProductCategory(product.category || '')
                        setForm({
                            productionCost: Number(product.productionCost?.toFixed(2)) || 0,
                            laborCost: Number(product.laborCost?.toFixed(2)) || 0,
                            packagingCost: Number(product.packagingCost?.toFixed(2)) || 0,
                            shippingCost: Number(product.shippingCost?.toFixed(2)) || 0,
                            taxRate: Number(product.taxRate?.toFixed(2)) || 0,
                            cardFee: Number(product.cardFee?.toFixed(2)) || 0,
                            marketplaceFee: Number(product.marketplaceFee?.toFixed(2)) || 0,
                            commission: Number(product.commission?.toFixed(2)) || 0,
                            desiredMargin: Number(product.desiredMargin?.toFixed(2)) || 30,
                            expectedVolume: product.expectedVolume || 100,
                            competitorPrice: Number(product.competitorPrice?.toFixed(2)) || 0,
                        })
                    }
                }
            } catch (e) {
                console.error('Erro ao carregar dados:', e)
            }
        }
        loadData()
    }, [id])

    // ─── Cálculos ────────────────────────────────────────────────────────────

    // Respeitando a mesma regra global do backend:
    const isSimple = businessProfile?.pricingMode === 'SIMPLE'

    // Custos diretos (se simples não contabiliza frete unitário pois já possui a taxa de % de envio global, mas pra evitar erros aqui por enquanto manteremos 0)
    const effShipping = isSimple ? 0 : form.shippingCost
    const totalCost = form.productionCost + form.laborCost + form.packagingCost + effShipping

    // Variáveis
    const effTaxRate = isSimple ? (businessProfile?.taxRate || 0) : form.taxRate
    const effCardFee = isSimple ? (businessProfile?.cardFee || 0) : form.cardFee
    const effMarketplaceFee = isSimple ? (businessProfile?.marketplaceFee || 0) : form.marketplaceFee
    const effCommission = isSimple ? (businessProfile?.commission || 0) : form.commission

    const cfPercent = businessProfile?.fixedCostPercentage || 0

    const deductions = cfPercent + effTaxRate + effCardFee + effMarketplaceFee + effCommission + form.desiredMargin
    const suggestedPriceRaw = deductions < 100 && totalCost > 0
        ? totalCost / (1 - deductions / 100)
        : 0
    const suggestedPrice = Math.round(suggestedPriceRaw * 100) / 100

    const netMargin = suggestedPrice > 0
        ? ((suggestedPrice - totalCost) / suggestedPrice * 100) - (cfPercent + effTaxRate + effCardFee + effMarketplaceFee + effCommission)
        : 0

    const healthScore =
        netMargin >= 30 ? Math.min(100, 70 + netMargin / 2) :
            netMargin >= 15 ? 50 + netMargin :
                netMargin >= 0 ? netMargin * 3 : 0

    const healthLabel = healthScore >= 80 ? 'Saudável' : healthScore >= 50 ? 'Atenção' : 'Crítico'

    const tabs = isSimple
        ? ['1. Custos diretos', '2. Estratégia (Margem)']
        : ['1. Custos diretos', '2. Taxas e canais', '3. Estratégia'];

    // Tratamento das guias: Como escondemos a aba de taxas no simple, a aba "estratégia" vira o índice 1.
    // Vamos processar qual o conteũdo de acordo com a seleção:
    const TAB_CUSTOS = 0;
    const TAB_TAXAS = isSimple ? -1 : 1;
    const TAB_ESTRATEGIA = isSimple ? 1 : 2;

    const handleSave = async () => {
        if (!productName) {
            alert('Por favor, insira o nome do produto.')
            return
        }
        setSaving(true)
        try {
            const data = {
                ...form,
                name: productName,
                category: productCategory,
                suggestedPrice,
                netMargin,
                healthScore,
                breakEven: Math.ceil(totalCost / (suggestedPrice / 10 || 1))
            }

            const payload = { ...data }
            if (isSimple) {
                delete payload.taxRate;
                delete payload.cardFee;
                delete payload.marketplaceFee;
                delete payload.commission;
                payload.shippingCost = 0; // zerado para garantir
            }

            if (id) {
                await api.put(`/products/${id}`, payload)
            } else {
                await api.post('/products', payload)
            }

            navigate('/dashboard')
        } catch (e) {
            console.error('Erro ao salvar produto:', e)
            alert('Erro ao salvar o produto.')
        } finally {
            setSaving(false)
        }
    }

    // ─── Barra de composição ─────────────────────────────────────────────────

    const segments = suggestedPrice > 0 ? [
        {
            id: 'cost', pct: totalCost / suggestedPrice * 100, color: C.costDirect, label: 'Custo direto', amount: totalCost, details: [
                { label: 'Aquisição / Matéria-prima', value: form.productionCost },
                { label: 'Mão de obra', value: form.laborCost },
                { label: 'Embalagem', value: form.packagingCost },
                { label: 'Frete unitário', value: effShipping }
            ].filter(d => d.value > 0)
        },
        {
            id: 'fixed', pct: cfPercent, color: C.costFixed, label: 'Custo fixo', amount: (cfPercent / 100) * suggestedPrice, details: [
                { label: 'Rateio base (Perfil global)', value: (cfPercent / 100) * suggestedPrice }
            ]
        },
        {
            id: 'tax', pct: effTaxRate, color: C.tax, label: 'Impostos', amount: (effTaxRate / 100) * suggestedPrice, details: [
                { label: 'Imposto Geral', value: (effTaxRate / 100) * suggestedPrice }
            ]
        },
        {
            id: 'fees', pct: effCardFee + effMarketplaceFee + effCommission, color: C.fees, label: 'Taxas', amount: ((effCardFee + effMarketplaceFee + effCommission) / 100) * suggestedPrice, details: [
                { label: 'Taxa do cartão', value: (effCardFee / 100) * suggestedPrice },
                { label: 'Marketplace', value: (effMarketplaceFee / 100) * suggestedPrice },
                { label: 'Comissão', value: (effCommission / 100) * suggestedPrice }
            ].filter(d => d.value > 0)
        },
        {
            id: 'margin', pct: form.desiredMargin, color: C.margin, label: 'Margem', amount: (form.desiredMargin / 100) * suggestedPrice, details: [
                { label: 'Lucro Líquido Esperado', value: (form.desiredMargin / 100) * suggestedPrice }
            ]
        },
    ].filter(s => s.pct > 0) : []


    return (
        <AppShell>
            <div style={{
                display: 'flex',
                gap: 24,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                alignItems: 'stretch',
                paddingBottom: 40
            }}>

                {/* COLUNA ESQUERDA — formulário */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24
                }}>

                    {/* Alerta de custos fixos zero e não preenchido */}
                    {(!businessProfile || cfPercent === 0) && (

                        <div style={{
                            background: '#FFFBEB',
                            border: '1px solid #FDE68A',
                            padding: '12px 20px',
                            borderRadius: 12,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 24
                        }}>
                            <p style={{ fontSize: 13, color: '#92400E' }}>
                                ⚠️ Configure seus custos fixos para um cálculo preciso.
                            </p>
                            <button
                                onClick={() => navigate('/business-profile')}
                                style={{
                                    background: '#1A5C3A', color: '#FFFFFF', border: 'none',
                                    borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                }}
                            >
                                Configurar agora
                            </button>
                        </div>
                    )}

                    {/* Card Principal */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: 24,
                        padding: 40,
                        boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
                        border: '1px solid #E2E8F0'
                    }}>
                        {/* Nome do produto e Engenharia de Preço */}
                        <div style={{ marginBottom: 40 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <span style={{ background: '#F0FDF4', color: '#1A5C3A', padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}>PREÇO E MARGEM</span>
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748B', margin: 0 }}>Engenharia de Preço</p>
                            </div>

                            <input
                                type="text"
                                value={productName}
                                onChange={e => setProductName(e.target.value)}
                                placeholder="Nome do produto ou serviço..."
                                style={{
                                    width: '100%', border: 'none', outline: 'none', background: 'transparent',
                                    fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 36, letterSpacing: '-0.02em',
                                    color: productName ? '#0F0E0C' : '#CBD5E1',
                                    marginBottom: 12
                                }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <input
                                    type="text"
                                    value={productCategory}
                                    onChange={e => setProductCategory(e.target.value)}
                                    placeholder="Adicione uma breve descrição ou categoria (ex: Coleção de Verão)"
                                    style={{
                                        flex: 1, border: 'none', outline: 'none', background: 'transparent',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#64748B',
                                        padding: '4px 0'
                                    }}
                                />
                            </div>

                            <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 16, lineHeight: 1.5, maxWidth: '600px' }}>
                                A <strong>Engenharia de Preço</strong> combina seus custos reais com impostos e taxas para encontrar o valor ideal de venda que garante sua margem de lucro.
                            </p>

                            <div style={{ height: 1, background: '#E2E8F0', marginTop: 24, width: '100%' }} />
                        </div>

                        {/* Abas estilo Switch */}
                        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: '#F1F5F9', padding: 6, borderRadius: 12, width: 'fit-content' }}>
                            {tabs.map((tab, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    style={{
                                        padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13,
                                        fontWeight: activeTab === i ? 700 : 500,
                                        background: activeTab === i ? '#FFFFFF' : 'transparent',
                                        color: activeTab === i ? '#0F0E0C' : '#64748B',
                                        boxShadow: activeTab === i ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Conteúdo das abas */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {activeTab === TAB_CUSTOS && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                                    <CurrencyInput label="Aquisição / matéria-prima" hint="Custo do produto pra você" value={form.productionCost} onChange={set('productionCost')} />
                                    <CurrencyInput label="Mão de obra" hint="Tempo para produzir" value={form.laborCost} onChange={set('laborCost')} />
                                    <CurrencyInput label="Embalagem" hint="Caixa, sacola, etiqueta" value={form.packagingCost} onChange={set('packagingCost')} />
                                    {!isSimple && (
                                        <CurrencyInput label="Frete unitário (PRO)" hint="Custo de transporte" value={form.shippingCost} onChange={set('shippingCost')} />
                                    )}
                                </div>
                            )}
                            {!isSimple && activeTab === TAB_TAXAS && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                                    <PctInput label="Imposto (%)" value={form.taxRate} onChange={set('taxRate')} />
                                    <PctInput label="Taxa do cartão (%)" value={form.cardFee} onChange={set('cardFee')} />
                                    <PctInput label="Taxa do marketplace (%)" value={form.marketplaceFee} onChange={set('marketplaceFee')} />
                                    <PctInput label="Comissão (%)" value={form.commission} onChange={set('commission')} />
                                </div>
                            )}
                            {activeTab === TAB_ESTRATEGIA && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                                        <div>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Margem desejada (%)</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                <input type="range" min={0} max={80} value={form.desiredMargin} onChange={e => set('desiredMargin')(Number(e.target.value))} style={{ flex: 1, accentColor: '#1A5C3A' }} />
                                                <span style={{ fontFamily: "'DM Mono'", fontSize: 15, fontWeight: 500 }}>{form.desiredMargin}%</span>
                                            </div>
                                        </div>
                                        <PctInput label="Vendas Mensais (un)" hint="Para cálculo de ponto de equilíbrio" value={form.expectedVolume} onChange={set('expectedVolume')} />
                                    </div>
                                    <CurrencyInput label="Preço do concorrente" value={form.competitorPrice} onChange={set('competitorPrice')} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dica da Plataforma (Preenchimento de espaço Vazio) */}
                    <div style={{
                        background: 'linear-gradient(to right, #F8FAFC, #FFFFFF)',
                        borderRadius: 24,
                        padding: 32,
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        gap: 24,
                        alignItems: 'flex-start',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#4F46E5" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Por que o Markup Divisor?</p>
                            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
                                A Markap calcula sua rentabilidade utilizando o custo real "por dentro" (Markup Divisor). Isso garante que, independente do percentual de taxas e impostos, a sua <strong style={{ color: '#0F0E0C' }}>Margem de Lucro Desejada</strong> não seja esmagada no final do mês, mantendo a saúde financeira do seu negócio previsível e lucrativa.
                            </p>
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA — resultado */}

                <div style={{
                    width: 380,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '36px 32px',
                    color: '#0F0E0C',
                    position: 'sticky',
                    top: 24,
                    boxShadow: '0 24px 48px rgba(0,0,0,0.06)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF' }}>SUA SUGESTÃO DE PREÇO</p>
                        <span style={{ padding: '4px 12px', borderRadius: 99, background: healthScore >= 80 ? '#F0FDF4' : healthScore >= 50 ? '#FFFBEB' : '#FEF2F2', color: healthScore >= 80 ? '#16A34A' : healthScore >= 50 ? '#D97706' : '#DC2626', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                            {healthLabel}
                        </span>
                    </div>

                    <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 56, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 32, background: 'linear-gradient(90deg, #1A5C3A 0%, #22C55E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {suggestedPrice > 0 ? fmt(suggestedPrice) : 'R$ —'}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', padding: '24px', marginBottom: 32 }}>
                        <div>
                            <p style={{ fontSize: 9, color: '#64748B', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>MARGEM REAL</p>
                            <p style={{ fontFamily: "'DM Mono'", fontSize: 26, color: '#0F0E0C' }}>{totalCost > 0 ? `${netMargin.toFixed(1)}%` : '—'}</p>
                        </div>
                        <div style={{ background: '#E2E8F0' }} />
                        <div style={{ paddingLeft: 16 }}>
                            <p style={{ fontSize: 9, color: '#64748B', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>EQUILÍBRIO</p>
                            <p style={{ fontFamily: "'DM Mono'", fontSize: 26, color: '#0F0E0C' }}>{totalCost > 0 ? Math.ceil(totalCost / (suggestedPrice / 10 || 1)) : '—'} <span style={{ fontSize: 13, color: '#9CA3AF' }}>un</span></p>
                        </div>
                    </div>

                    <div style={{ flex: 1 }} onMouseLeave={() => setActiveSeg(null)}>
                        <p style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.14em', marginBottom: 12 }}>COMPOSIÇÃO DE CUSTOS</p>
                        <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>

                            {segments.map((s, i) => (
                                <div
                                    key={i}
                                    onMouseEnter={() => setActiveSeg(i)}
                                    title={`${s.label}: ${s.pct.toFixed(1)}%`}

                                    style={{
                                        width: `${s.pct}%`,
                                        background: s.color,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        opacity: activeSeg === null || activeSeg === i ? 1 : 0.3,
                                        transform: activeSeg === i ? 'scaleY(1.3)' : 'scaleY(1)'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Area de detalhes expandida ou legenda padrao */}
                        <div style={{ minHeight: 90, marginBottom: 32 }}>
                            {activeSeg !== null && segments[activeSeg] ? (
                                <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: 16, border: '1px solid #E2E8F0', animation: 'fadeIn 0.2s ease-in-out' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: 3, background: segments[activeSeg].color, flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F0E0C' }}>{segments[activeSeg].label}</span>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F0E0C', marginRight: 8 }}>{fmt(segments[activeSeg].amount)}</span>
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>({segments[activeSeg].pct.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {segments[activeSeg].details.map((d, j) => (
                                            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748B' }}>
                                                <span>— {d.label}</span>
                                                <span style={{ fontFamily: "'DM Mono'" }}>{fmt(d.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px' }}>
                                    {segments.map((s, i) => (
                                        <div
                                            key={i}
                                            onMouseEnter={() => setActiveSeg(i)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.2s' }}
                                        >
                                            <div style={{ width: 8, height: 8, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{s.label} ({s.pct.toFixed(1)}%)</span>
                                        </div>

                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <style>
                        {`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-4px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        `}
                    </style>


                    <button
                        onClick={handleSave}
                        disabled={saving || totalCost === 0}
                        style={{
                            width: '100%',
                            background: totalCost > 0 ? '#1A5C3A' : '#F1F5F9',
                            color: totalCost > 0 ? '#FFFFFF' : '#9CA3AF',
                            border: 'none',
                            borderRadius: 14,
                            padding: '18px',
                            fontSize: 15,
                            fontWeight: 700,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            cursor: totalCost > 0 && !saving ? 'pointer' : 'not-allowed',
                            boxShadow: totalCost > 0 ? '0 8px 24px rgba(26,92,58,0.3)' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        {saving ? 'Salvando...' : (id ? 'Atualizar produto' : 'Salvar produto')}
                    </button>
                </div>

            </div>
        </AppShell>
    )
}