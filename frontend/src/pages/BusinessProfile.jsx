import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import AppShell from '../components/AppShell'
import { SEGMENT_BENCHMARKS } from '../data/segmentBenchmarks'
import { NumericField } from '../components/ui/PremiumInputs'

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
`

function formatCurrency(value) {
    if (!value && value !== 0) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function parseCurrency(str) {
    const cleaned = String(str).replace(/[^\d,]/g, '').replace(',', '.')
    return parseFloat(cleaned) || 0
}

function CurrencyInput({ label, description, icon, value, onChange }) {
    const [focused, setFocused] = useState(false)
    const [display, setDisplay] = useState('')

    useEffect(() => {
        if (!focused) {
            setDisplay(value ? formatCurrency(value) : '')
        }
    }, [value, focused])

    const handleFocus = () => {
        setFocused(true)
        setDisplay(value ? String(value).replace('.', ',') : '')
    }

    const handleBlur = () => {
        setFocused(false)
        const parsed = parseCurrency(display)
        onChange(parsed)
        setDisplay(parsed ? formatCurrency(parsed) : '')
    }

    const handleChange = (e) => {
        const raw = e.target.value.replace(/[^\d,]/g, '')
        setDisplay(raw)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: '#374151',
            }}>{label}</label>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#FFFFFF',
                border: `1.5px solid ${focused ? '#1A5C3A' : '#E2E8F0'}`,
                borderRadius: 10,
                padding: '11px 14px',
                boxShadow: focused ? '0 0 0 3px rgba(26,92,58,0.12)' : 'none',
                transition: 'all 0.15s ease',
            }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                <input
                    type="text"
                    value={focused ? display : (value ? formatCurrency(value) : '')}
                    placeholder="R$ 0,00"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 15,
                        fontWeight: 400,
                        color: '#0F0E0C',
                        background: 'transparent',
                    }}
                />
            </div>
            {description && (
                <p style={{
                    fontSize: 13,
                    color: '#475569',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1.5,
                    marginTop: 4
                }}>
                    {description}
                </p>
            )}
        </div>
    )
}

export default function BusinessProfile() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        monthlyRent: 0,
        ownerSalary: 0,
        employeesCost: 0,
        utilitiesCost: 0,
        accountingCost: 0,
        systemsCost: 0,
        marketingCost: 0,
        otherFixedCosts: 0,
        expectedMonthlyRevenue: 0,
        pricingMode: 'SIMPLE',
        segment: 'outro',
        customMarketMargin: 0,
        customMarginGoal: 0,
        monthlyProfitGoal: 0,
        monthlyRevenueGoal: 0,
        taxRate: 0,
        cardFee: 0,
        commission: 0,
        marketplaceFee: 0,
    })

    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await api.get('/business-profile')
                const data = res.data
                setForm(f => ({
                    ...f,
                    monthlyRent: data.monthlyRent || 0,
                    ownerSalary: data.ownerSalary || 0,
                    employeesCost: data.employeesCost || 0,
                    utilitiesCost: data.utilitiesCost || 0,
                    accountingCost: data.accountingCost || 0,
                    systemsCost: data.systemsCost || 0,
                    marketingCost: data.marketingCost || 0,
                    otherFixedCosts: data.otherFixedCosts || 0,
                    expectedMonthlyRevenue: data.expectedMonthlyRevenue || 0,
                    pricingMode: data.pricingMode || 'SIMPLE',
                    segment: data.segment || 'outro',
                    customMarketMargin: data.customMarketMargin || 0,
                    customMarginGoal: data.customMarginGoal || 0,
                    monthlyProfitGoal: data.monthlyProfitGoal || 0,
                    monthlyRevenueGoal: data.monthlyRevenueGoal || 0,
                    taxRate: data.taxRate || 0,
                    cardFee: data.cardFee || 0,
                    commission: data.commission || 0,
                    marketplaceFee: data.marketplaceFee || 0,
                }))
            } catch (e) {
                console.error('Erro ao carregar perfil:', e)
            }
        }
        loadProfile()
    }, [])

    const totalFixedCosts =
        form.monthlyRent +
        form.ownerSalary +
        form.employeesCost +
        form.utilitiesCost +
        form.accountingCost +
        form.systemsCost +
        form.marketingCost +
        form.otherFixedCosts

    const cfPercent =
        form.expectedMonthlyRevenue > 0
            ? (totalFixedCosts / form.expectedMonthlyRevenue) * 100
            : 0

    const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }))

    const cfColor =
        cfPercent > 60 ? '#FF6B6B' :
            cfPercent > 40 ? '#F59E0B' :
                cfPercent > 0 ? '#22C55E' :
                    '#9CA3AF'

    const cfLabel =
        cfPercent > 60 ? 'Custos fixos muito elevados — revise seus gastos' :
            cfPercent > 40 ? 'Custos fixos altos — considere otimizar' :
                cfPercent > 0 ? 'Proporção saudável de custos fixos' :
                    'Preencha o faturamento previsto'

    const handleSubmit = async () => {
        setSaving(true)
        try {
            await api.post('/business-profile', form)
            navigate('/dashboard')
        } catch (e) {
            console.error('Erro ao salvar:', e)
            alert('Erro ao salvar as configurações. Tente novamente.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <AppShell
            pageTitle="Perfil da Empresa"
            pageSubtitle="Configure seus custos fixos mensais para calcular preços com precisão"
        >
            <style>{FONTS}</style>

            <div style={{ maxWidth: 720, margin: '0 auto' }}>

                {/* Card informativo no topo */}
                <div style={{
                    background: '#1A5C3A',
                    borderRadius: 16,
                    padding: '20px 24px',
                    marginBottom: 32,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                }}>
                    <div style={{ flex: 1 }}>
                        <p style={{
                            fontFamily: "'Fraunces', serif",
                            fontWeight: 800,
                            fontSize: 18,
                            color: '#FFFFFF',
                            letterSpacing: '-0.02em',
                            marginBottom: 6,
                        }}>
                            Conhecer seus custos é{' '}
                            <mark style={{
                                background: '#FFF176',
                                color: '#1A5C3A',
                                padding: '0 4px',
                                borderRadius: 3,
                                WebkitBoxDecorationBreak: 'clone',
                                boxDecorationBreak: 'clone',
                            }}>o primeiro passo</mark>
                            {' '}para lucrar de verdade.
                        </p>
                        <p style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.65)',
                            lineHeight: 1.5,
                        }}>
                            Esses valores são usados para calcular o custo fixo de cada produto automaticamente.
                        </p>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        borderRadius: 14,
                        padding: '14px 20px',
                        flexShrink: 0,
                        textAlign: 'center',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>CF% atual</p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 32, fontWeight: 500, color: cfPercent > 60 ? '#FF6B6B' : cfPercent > 40 ? '#FFF176' : '#22C55E', lineHeight: 1 }}>
                            {cfPercent.toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* SEÇÃO 1: Custos Fixos Mensais */}
                <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 24,
                    padding: '32px',
                    marginBottom: 24,
                    boxShadow: '0 10px 30px -12px rgba(0,0,0,0.05)',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        marginBottom: 24, paddingBottom: 16,
                        borderBottom: '2px solid #F0FDF4',
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: '#1A5C3A', color: '#FFF176',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 14,
                        }}>1</div>
                        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 20, color: '#0F0E0C', letterSpacing: '-0.02em' }}>
                            Custos Fixos Mensais
                        </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                        <CurrencyInput label="Aluguel / espaço" icon="🏠" value={form.monthlyRent} onChange={set('monthlyRent')} />
                        <CurrencyInput label="Pró-labore (seu salário)" icon="👤" value={form.ownerSalary} onChange={set('ownerSalary')} />
                        <CurrencyInput label="Funcionários / terceiros" icon="👥" value={form.employeesCost} onChange={set('employeesCost')} />
                        <CurrencyInput label="Energia, Água, Internet" icon="⚡" value={form.utilitiesCost} onChange={set('utilitiesCost')} />
                        <CurrencyInput label="Contador / escritório" icon="📋" value={form.accountingCost} onChange={set('accountingCost')} />
                        <CurrencyInput label="Sistemas e assinaturas" icon="💻" value={form.systemsCost} onChange={set('systemsCost')} />
                        <CurrencyInput label="Marketing mensal fixo" icon="📢" value={form.marketingCost} onChange={set('marketingCost')} />
                        <CurrencyInput label="Outros custos fixos" icon="➕" value={form.otherFixedCosts} onChange={set('otherFixedCosts')} />
                    </div>

                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        background: '#DCFCE7', border: '1px solid #86EFAC',
                        borderRadius: 12, padding: '16px 20px', marginTop: 24,
                    }}>
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#1A5C3A' }}>
                            Total de custos fixos:
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: '#1A5C3A' }}>
                            {formatCurrency(totalFixedCosts)}
                        </span>
                    </div>
                </div>

                {/* SEÇÃO 2: Faturamento Previsto */}
                <div style={{
                    background: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: 20, padding: '28px', marginBottom: 20,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        marginBottom: 20, paddingBottom: 16,
                        borderBottom: '2px solid #F0FDF4',
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: '#1A5C3A', color: '#FFF176',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 14,
                        }}>2</div>
                        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 20, color: '#0F0E0C', letterSpacing: '-0.02em' }}>
                            Faturamento Previsto
                        </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'start' }}>
                        <div>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#1A5C3A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 18 }}>💡</span> Cálculo do Preço (Rateio)
                            </p>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                                O <strong>Faturamento Previsto</strong> é o que você fatura HOJE (ou espera faturar no próximo mês).
                            </p>
                            <div style={{ marginTop: 12, padding: '10px 14px', background: '#F0FDF4', borderRadius: 10, borderLeft: '3px solid #1A5C3A' }}>
                                <p style={{ fontSize: 11, color: '#166534', fontWeight: 600, margin: '0 0 4px 0' }}>
                                    Para que serve?
                                </p>
                                <p style={{ fontSize: 11, color: '#166534', margin: 0, lineHeight: 1.4 }}>
                                    Ele define o peso do seu aluguel e luz em cada produto. Se este valor for realista, seu preço cobrirá todas as contas.
                                </p>
                            </div>
                        </div>

                        <div style={{ background: '#F0FDF4', padding: 20, borderRadius: 16, border: '1px solid #DCFCE7' }}>
                            <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 12, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Valor mensal esperado (R$)
                            </label>
                            <CurrencyInput icon="💰" value={form.expectedMonthlyRevenue} onChange={set('expectedMonthlyRevenue')} />

                            {form.expectedMonthlyRevenue > 0 && (
                                <div style={{
                                    background: '#FFFFFF',
                                    border: `1.5px solid ${cfColor}`,
                                    borderRadius: 12, padding: '12px 14px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    marginTop: 16,
                                }}>
                                    <div>
                                        <p style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>Incidência de CF</p>
                                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#374151', margin: 0, fontWeight: 600 }}>{cfPercent > 40 ? '⚠️ Alerta de peso alto' : '✅ Peso saudável'}</p>
                                    </div>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 600, color: cfColor }}>
                                        {cfPercent.toFixed(1)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SEÇÃO 3: Deduções Variáveis (Globais) */}
                <div style={{
                    background: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: 20, padding: '24px', marginBottom: 20,
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        marginBottom: 24, paddingBottom: 16,
                        borderBottom: '2px solid #F0FDF4',
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: '#1A5C3A', color: '#FFF176',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 14,
                        }}>3</div>
                        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 20, color: '#0F0E0C', letterSpacing: '-0.02em' }}>
                            Deduções Variáveis (Impostos e Taxas)
                        </h3>
                    </div>

                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Quais são as taxas que incidem sobre toda venda?
                    </p>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
                        No modo de precificação "Simples", esses percentuais são aplicados automaticamente em todos os produtos.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                        <NumericField label="Impostos (Ex: Simples Nacional)" value={form.taxRate} onChange={set('taxRate')} suffix="%" />
                        <NumericField label="Taxas de Cartão/Intermediador" value={form.cardFee} onChange={set('cardFee')} suffix="%" />
                        <NumericField label="Comissão / Marketplace" value={form.commission} onChange={set('commission')} suffix="%" />
                        <NumericField label="Outras Taxas (Ex: Frete % global)" value={form.marketplaceFee} onChange={set('marketplaceFee')} suffix="%" />
                    </div>
                </div>

                {/* SEÇÃO 4: Modo de Precificação */}
                <div style={{
                    background: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: 20, padding: '24px', marginBottom: 20,
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #F0FDF4',
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: '#1A5C3A', color: '#FFF176',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 14,
                        }}>4</div>
                        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 20, color: '#0F0E0C', letterSpacing: '-0.02em' }}>
                            Modo de Precificação
                        </h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {[
                            {
                                value: 'SIMPLE',
                                title: 'Simples',
                                subtitle: 'Recomendado para iniciantes',
                                desc: 'O CF% calculado é aplicado automaticamente em todos os produtos.',
                            },
                            {
                                value: 'ADVANCED',
                                title: 'Avançado',
                                subtitle: 'Para volumes diferentes',
                                desc: 'Você define manualmente o percentual de custo fixo por produto.',
                                pro: true,
                            },
                        ].map((mode) => {
                            const active = form.pricingMode === mode.value
                            return (
                                <button
                                    key={mode.value}
                                    onClick={() => !mode.pro && setForm((f) => ({ ...f, pricingMode: mode.value }))}
                                    style={{
                                        textAlign: 'left',
                                        padding: '20px',
                                        background: active ? '#DCFCE7' : '#FFFFFF',
                                        border: `2px solid ${active ? '#1A5C3A' : '#E2E8F0'}`,
                                        borderRadius: 14,
                                        cursor: mode.pro ? 'not-allowed' : 'pointer',
                                        opacity: mode.pro ? 0.6 : 1,
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16, color: '#0F0E0C' }}>
                                            {mode.title}
                                        </p>
                                        {mode.pro && (
                                            <span style={{
                                                background: '#1A5C3A',
                                                color: '#FFF176',
                                                fontSize: 9,
                                                fontWeight: 700,
                                                padding: '2px 7px',
                                                borderRadius: 99,
                                            }}>PRO</span>
                                        )}
                                        {active && !mode.pro && (
                                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#1A5C3A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ color: '#FFF176', fontSize: 12 }}>✓</span>
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, color: '#1A5C3A', marginBottom: 4 }}>
                                        {mode.subtitle}
                                    </p>
                                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
                                        {mode.desc}
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Seção 5 — Segmento do Negócio */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: '24px', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #F0FDF4' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1A5C3A', color: '#FFF176', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 14 }}>5</div>
                        <div>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 20, color: '#0F0E0C', letterSpacing: '-0.02em' }}>Segmento do Negócio</h3>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#64748B', marginTop: 4 }}>
                                Define as margens de referência do seu mercado — fonte: Sebrae
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {Object.entries(SEGMENT_BENCHMARKS).map(([key, seg]) => (
                            <div
                                key={key}
                                onClick={() => setForm(f => ({ ...f, segment: key }))}
                                style={{
                                    textAlign: 'left',
                                    padding: '14px 16px',
                                    background: form.segment === key ? '#DCFCE7' : '#FFFFFF',
                                    border: `1.5px solid ${form.segment === key ? '#1A5C3A' : '#E2E8F0'}`,
                                    borderRadius: 14,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    boxShadow: form.segment === key ? '0 8px 20px -6px rgba(26,92,58,0.15)' : 'none',
                                }}
                                onMouseEnter={e => {
                                    if (form.segment !== key) {
                                        e.currentTarget.style.borderColor = '#1A5C3A';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (form.segment !== key) {
                                        e.currentTarget.style.borderColor = '#E2E8F0';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                <span style={{ fontSize: 20 }}>{seg.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, color: '#0F0E0C' }}>{seg.label}</p>
                                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                                        Margem média: <strong style={{ color: '#1A5C3A' }}>{seg.marketAvg}%</strong> · {seg.source}
                                    </p>
                                    <a
                                        href={seg.infoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            fontSize: 9,
                                            color: '#1A5C3A',
                                            textDecoration: 'none',
                                            fontWeight: 700,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 3,
                                            marginTop: 3,
                                            opacity: 0.8
                                        }}
                                    >
                                        Ler sobre a margem ➔
                                    </a>
                                </div>
                                {form.segment === key && (
                                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#1A5C3A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ color: '#FFF176', fontSize: 11 }}>✓</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seção 6 — Personalização de Metas */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: '24px', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #F0FDF4' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1A5C3A', color: '#FFF176', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 14 }}>6</div>
                        <div>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 20, color: '#0F0E0C', letterSpacing: '-0.02em' }}>Personalizar Metas</h3>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                                Opcional: Defina sua própria meta de margem se não quiser usar o benchmark
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Meta de Margem Líquida (%)
                            </p>
                            {(() => {
                                const segBenchmark = SEGMENT_BENCHMARKS[form.segment]?.thresholds?.atencao || 25;
                                const activeGoal = form.customMarginGoal > 0 ? form.customMarginGoal : segBenchmark;
                                const goalColor = activeGoal < 15 ? '#D62828' : activeGoal < 25 ? '#F59E0B' : '#2E7D52';
                                return (
                                    <div style={{ background: '#F7F7F7', borderRadius: 14, padding: '16px 18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <div>
                                                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 36, fontWeight: 500, color: goalColor, lineHeight: 1 }}>
                                                    {activeGoal}%
                                                </p>
                                                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                                                    {form.customMarginGoal > 0 ? 'Meta personalizada' : `Benchmark: ${SEGMENT_BENCHMARKS[form.segment]?.label || 'geral'}`}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
                                                {[{ l: 'Mínimo', v: 10, c: '#D62828' }, { l: 'Atenção', v: 20, c: '#F59E0B' }, { l: 'Saudável', v: 30, c: '#2E7D52' }].map(ref => (
                                                    <div key={ref.l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <span style={{ fontSize: 9, color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{ref.l}</span>
                                                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: ref.c }}>{ref.v}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <input
                                            type="range" min="5" max="60" step="1"
                                            value={activeGoal}
                                            onChange={e => setForm(f => ({ ...f, customMarginGoal: Number(e.target.value) }))}
                                            style={{ width: '100%', accentColor: goalColor, cursor: 'pointer', marginBottom: 10 }}
                                        />
                                        <div style={{ display: 'flex', height: 4, borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
                                            <div style={{ flex: 1, background: '#D62828', opacity: 0.4 }} />
                                            <div style={{ flex: 1, background: '#F59E0B', opacity: 0.4 }} />
                                            <div style={{ flex: 1, background: '#22C55E', opacity: 0.4 }} />
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => setForm(f => ({ ...f, customMarginGoal: 0 }))}
                                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 7, border: '1.5px solid #E2E8F0', background: form.customMarginGoal === 0 ? '#1A5C3A' : '#fff', color: form.customMarginGoal === 0 ? '#fff' : '#374151', cursor: 'pointer' }}
                                            >
                                                Benchmark ({segBenchmark}%)
                                            </button>
                                            {[15, 20, 25, 30, 35].map(v => (
                                                <button key={v} onClick={() => setForm(f => ({ ...f, customMarginGoal: v }))}
                                                    style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, padding: '5px 10px', borderRadius: 7, border: '1.5px solid #E2E8F0', background: form.customMarginGoal === v ? '#1A5C3A' : '#fff', color: form.customMarginGoal === v ? '#fff' : '#374151', cursor: 'pointer' }}
                                                >{v}%</button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        <div>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Meta de Lucro Mensal (R$)
                            </p>
                            <CurrencyInput
                                icon="📈"
                                value={form.monthlyProfitGoal}
                                onChange={set('monthlyProfitGoal')}
                            />
                            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6, lineHeight: 1.4 }}>
                                Crucial para o cálculo do lucro total no Dashboard.
                            </p>
                        </div>
                    </div>
                    <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1A5C3A', background: 'rgba(26, 92, 58, 0.02)', borderRadius: 16, padding: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'inline-block', background: '#1A5C3A', color: '#FFF176', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, marginBottom: 12 }}>FOCO NO DASHBOARD</div>
                                <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 18, color: '#1A5C3A', marginBottom: 8, margin: 0 }}>
                                    Meta de Faturamento Mensal
                                </h4>
                                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#475569', lineHeight: 1.5, marginTop: 12 }}>
                                    Diferente do previsto, a <strong>Meta</strong> é onde você quer chegar.
                                </p>
                                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#64748B', lineHeight: 1.5, marginTop: 8 }}>
                                    Não usamos este valor para mexer no seu preço, mas sim para monitorar a "Saúde Financeira" no Dashboard. Se você estiver longe da meta, o Markap te avisará.
                                </p>
                            </div>
                            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 20, border: '2px dashed #1A5C3A', boxShadow: '0 8px 20px -10px rgba(0,0,0,0.1)' }}>
                                <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 800, color: '#1A5C3A', marginBottom: 12, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Vendas desejadas (R$)
                                </label>
                                <CurrencyInput
                                    icon="🎯"
                                    value={form.monthlyRevenueGoal}
                                    onChange={set('monthlyRevenueGoal')}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, background: '#F0FDF4', padding: '8px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: 14 }}>🚀</span>
                                    <p style={{ fontSize: 10, color: '#166534', margin: 0, fontWeight: 600 }}>
                                        Define os alertas de desempenho no seu painel principal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                        width: '100%', background: '#1A5C3A', color: '#FFFFFF',
                        border: 'none', borderRadius: 16, padding: '20px 24px',
                        fontSize: 18, fontWeight: 800, fontFamily: "'Fraunces', serif",
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1, marginBottom: 32,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 12px 24px -8px rgba(26,92,58,0.4)',
                    }}
                    onMouseEnter={e => {
                        if (!saving) {
                            e.currentTarget.style.background = '#143d28';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(26,92,58,0.5)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!saving) {
                            e.currentTarget.style.background = '#1A5C3A';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(26,92,58,0.4)';
                        }
                    }}
                >
                    {saving ? 'Salvando...' : 'Salvar configurações →'}
                </button>
            </div >
        </AppShell >
    )
}