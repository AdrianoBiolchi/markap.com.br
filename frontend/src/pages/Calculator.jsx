import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import AppShell from '../components/AppShell'

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
                    background: '#FFFFFF',
                    border: `1.5px solid ${focused ? '#1A5C3A' : '#E2E8F0'}`,
                    borderRadius: 10,
                    outline: 'none',
                    boxShadow: focused ? '0 0 0 3px rgba(26,92,58,0.10)' : 'none',
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
                background: '#FFFFFF',
                border: `1.5px solid ${focused ? '#1A5C3A' : '#E2E8F0'}`,
                borderRadius: 10,
                boxShadow: focused ? '0 0 0 3px rgba(26,92,58,0.10)' : 'none',
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
                    background: '#F7F7F7',
                    borderLeft: '1px solid #E2E8F0',
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

export default function Calculator() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState(0)
    const [productName, setProductName] = useState('')
    const [saving, setSaving] = useState(false)
    const [cfPercent, setCfPercent] = useState(0)

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
                // Carregar CF%
                const cfRes = await api.get('/business-profile/cf-percent')
                setCfPercent(cfRes.data.cfPercent || 0)

                // Carregar produto se estiver editando
                if (id) {
                    const pRes = await api.get('/products')
                    const product = pRes.data.find(p => p.id === id)
                    if (product) {
                        setProductName(product.name)
                        setForm({
                            productionCost: product.productionCost || 0,
                            laborCost: product.laborCost || 0,
                            packagingCost: product.packagingCost || 0,
                            shippingCost: product.shippingCost || 0,
                            taxRate: product.taxRate || 0,
                            cardFee: product.cardFee || 0,
                            marketplaceFee: product.marketplaceFee || 0,
                            commission: product.commission || 0,
                            desiredMargin: product.desiredMargin || 30,
                            expectedVolume: product.expectedVolume || 100,
                            competitorPrice: product.competitorPrice || 0,
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

    const totalCost = form.productionCost + form.laborCost + form.packagingCost + form.shippingCost
    const deductions = cfPercent + form.taxRate + form.cardFee + form.marketplaceFee + form.commission + form.desiredMargin
    const suggestedPrice = deductions < 100 && totalCost > 0
        ? totalCost / (1 - deductions / 100)
        : 0

    const netMargin = suggestedPrice > 0
        ? ((suggestedPrice - totalCost) / suggestedPrice * 100) - (cfPercent + form.taxRate + form.cardFee + form.marketplaceFee + form.commission)
        : 0

    const healthScore =
        netMargin >= 30 ? Math.min(100, 70 + netMargin / 2) :
            netMargin >= 15 ? 50 + netMargin :
                netMargin >= 0 ? netMargin * 3 : 0

    const healthLabel = healthScore >= 80 ? 'Saudável' : healthScore >= 50 ? 'Atenção' : 'Crítico'

    const tabs = ['1. Custos do produto', '2. Taxas e canais', '3. Estratégia']

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
                suggestedPrice,
                netMargin,
                healthScore,
                breakEven: Math.ceil(totalCost / (suggestedPrice / 10 || 1))
            }

            if (id) {
                await api.put(`/products/${id}`, data)
            } else {
                await api.post('/products', data)
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
        { pct: totalCost / suggestedPrice * 100, color: '#94A3B8', label: 'Custo direto' },
        { pct: cfPercent, color: '#475569', label: 'Custo fixo' },
        { pct: form.taxRate, color: '#F59E0B', label: 'Impostos' },
        { pct: form.cardFee + form.marketplaceFee + form.commission, color: '#FB923C', label: 'Taxas' },
        { pct: form.desiredMargin, color: '#22C55E', label: 'Margem' },
    ] : []

    return (
        <AppShell>
            <div style={{
                display: 'flex',
                height: '100%',
                margin: '-28px -32px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                overflow: 'hidden',
            }}>

                {/* COLUNA ESQUERDA — formulário */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    background: '#F7F7F7',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '32px 40px',
                }}>
                    {/* Alerta de custos fixos zero */}
                    {cfPercent === 0 && (
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

                    {/* Nome do produto */}
                    <div style={{ marginBottom: 32 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>NOME DO PRODUTO</p>
                        <input
                            type="text"
                            value={productName}
                            onChange={e => setProductName(e.target.value)}
                            placeholder="Ex: Bolsa Couro Artesanal..."
                            style={{
                                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                                fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em',
                                color: productName ? '#0F0E0C' : '#D1D5DB',
                            }}
                        />
                    </div>

                    {/* Abas */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: '#FFFFFF', padding: 6, borderRadius: 12, border: '1px solid #E2E8F0', width: 'fit-content' }}>
                        {tabs.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                style={{
                                    padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13,
                                    fontWeight: activeTab === i ? 700 : 500,
                                    background: activeTab === i ? '#1A5C3A' : 'transparent',
                                    color: activeTab === i ? '#FFFFFF' : '#64748B',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Conteúdo das abas */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {activeTab === 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                                <CurrencyInput label="Custo de produção" hint="Matéria-prima, insumos" value={form.productionCost} onChange={set('productionCost')} />
                                <CurrencyInput label="Mão de obra" hint="Tempo para produzir" value={form.laborCost} onChange={set('laborCost')} />
                                <CurrencyInput label="Embalagem" hint="Caixa, sacola, etiqueta" value={form.packagingCost} onChange={set('packagingCost')} />
                                <CurrencyInput label="Frete / logística" hint="Custo de transporte" value={form.shippingCost} onChange={set('shippingCost')} />
                            </div>
                        )}
                        {activeTab === 1 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                                <PctInput label="Imposto (%)" value={form.taxRate} onChange={set('taxRate')} />
                                <PctInput label="Taxa do cartão (%)" value={form.cardFee} onChange={set('cardFee')} />
                                <PctInput label="Taxa do marketplace (%)" value={form.marketplaceFee} onChange={set('marketplaceFee')} />
                                <PctInput label="Comissão (%)" value={form.commission} onChange={set('commission')} />
                            </div>
                        )}
                        {activeTab === 2 && (
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

                {/* COLUNA DIREITA — resultado */}
                <div style={{
                    width: 360,
                    background: '#1A5C3A',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '32px 28px',
                    color: '#FFF',
                }}>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>PREÇO SUGERIDO</p>
                    <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 64, lineHeight: 0.9, letterSpacing: '-0.04em', marginBottom: 14 }}>
                        {suggestedPrice > 0 ? fmt(suggestedPrice) : 'R$ —'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
                        <span style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.1)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                            {healthLabel}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '20px 0', marginBottom: 24 }}>
                        <div>
                            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>MARGEM REAL</p>
                            <p style={{ fontFamily: "'DM Mono'", fontSize: 26 }}>{totalCost > 0 ? `${netMargin.toFixed(1)}%` : '—'}</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ paddingLeft: 16 }}>
                            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>EQUILÍBRIO</p>
                            <p style={{ fontFamily: "'DM Mono'", fontSize: 26 }}>{totalCost > 0 ? Math.ceil(totalCost / (suggestedPrice / 10 || 1)) : '—'} <span style={{ fontSize: 10 }}>un</span></p>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', marginBottom: 10 }}>COMPOSIÇÃO</p>
                        <div style={{ display: 'flex', height: 6, borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>
                            {segments.map((s, i) => (
                                <div key={i} style={{ width: `${s.pct}%`, background: s.color }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginBottom: 32 }}>
                            {segments.map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: 2, background: s.color }} />
                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving || totalCost === 0}
                        style={{
                            width: '100%',
                            background: totalCost > 0 ? '#FFF176' : 'rgba(255,255,255,0.15)',
                            color: '#1A5C3A',
                            border: 'none',
                            borderRadius: 12,
                            padding: '16px',
                            fontSize: 15,
                            fontWeight: 800,
                            fontFamily: "'Fraunces'",
                            cursor: totalCost > 0 && !saving ? 'pointer' : 'not-allowed',
                        }}
                    >
                        {saving ? 'Salvando...' : (id ? 'Atualizar produto →' : 'Salvar como produto →')}
                    </button>
                </div>
            </div>
        </AppShell>
    )
}