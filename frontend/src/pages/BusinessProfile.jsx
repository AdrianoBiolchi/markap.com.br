import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import AppShell from '../components/AppShell'
import { SEGMENT_BENCHMARKS } from '../data/segmentBenchmarks'

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
                <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
        monthlyProfitGoal: 0,
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
                    monthlyProfitGoal: data.monthlyProfitGoal || 0,
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
                        borderRadius: 12,
                        padding: '12px 16px',
                        flexShrink: 0,
                        textAlign: 'center',
                    }}>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>CF% atual</p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 500, color: cfPercent > 60 ? '#FF6B6B' : cfPercent > 40 ? '#FFF176' : '#22C55E', lineHeight: 1 }}>
                            {cfPercent.toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* SEÇÃO 1: Custos Fixos Mensais */}
                <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 20,
                    padding: '24px',
                    marginBottom: 20,
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
                        }}>2</div>
                        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 20, color: '#0F0E0C', letterSpacing: '-0.02em' }}>
                            Faturamento Previsto
                        </h3>
                    </div>

                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Quanto você pretende faturar esse mês?
                    </p>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#9CA3AF', marginBottom: 14 }}>
                        Usado para calcular o percentual de custo fixo rateado por produto
                    </p>
                    <CurrencyInput icon="💰" value={form.expectedMonthlyRevenue} onChange={set('expectedMonthlyRevenue')} />

                    {form.expectedMonthlyRevenue > 0 && (
                        <div style={{
                            background: '#FFFFFF',
                            border: `1.5px solid ${cfColor}`,
                            borderRadius: 12, padding: '14px 18px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 14,
                        }}>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#374151' }}>{cfLabel}</p>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 500, color: cfColor, marginLeft: 16 }}>
                                {cfPercent.toFixed(1)}%
                            </span>
                        </div>
                    )}
                </div>

                {/* SEÇÃO 3: Modo de Precificação */}
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
                        }}>3</div>
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

                {/* Seção 4 — Segmento do Negócio */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: '24px', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #F0FDF4' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1A5C3A', color: '#FFF176', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 14 }}>4</div>
                        <div>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 20, color: '#0F0E0C', letterSpacing: '-0.02em' }}>Segmento do Negócio</h3>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
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
                                    borderRadius: 12,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
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

                {/* Seção 5 — Personalização de Metas */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: '24px', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #F0FDF4' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1A5C3A', color: '#FFF176', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 14 }}>5</div>
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
                                Minha Margem Alvo (%)
                            </p>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    value={form.customMarketMargin}
                                    onChange={e => setForm(f => ({ ...f, customMarketMargin: Number(e.target.value) }))}
                                    placeholder="Ex: 35"
                                    style={{
                                        width: "100%", padding: "12px 14px",
                                        fontFamily: "'DM Mono', monospace", fontSize: 15,
                                        color: '#0F0E0C', background: '#FFFFFF',
                                        border: `1.5px solid #E2E8F0`, borderRadius: 10,
                                        outline: "none",
                                    }}
                                />
                                <span style={{ position: 'absolute', right: 14, top: 12, color: '#9CA3AF', fontSize: 13 }}>%</span>
                            </div>
                            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6, lineHeight: 1.4 }}>
                                Se maior que zero, substitui a média do segmento no Markapômetro.
                            </p>
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
                                Crucial para o cálculo do ponto de equilíbrio.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                        width: '100%', background: '#1A5C3A', color: '#FFFFFF',
                        border: 'none', borderRadius: 14, padding: '18px 24px',
                        fontSize: 16, fontWeight: 800, fontFamily: "'Fraunces', serif",
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1, marginBottom: 12,
                    }}
                    onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#143d28' }}
                    onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#1A5C3A' }}
                >
                    {saving ? 'Salvando...' : 'Salvar configurações →'}
                </button>
            </div >
        </AppShell >
    )
}