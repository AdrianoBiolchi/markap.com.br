// BusinessProfile.jsx
// IMPORTANTE: Esta página é STANDALONE — NÃO usar dentro do Layout/AppShell
// No router: <Route path="/business-profile" element={<BusinessProfile />} />
// Sem wrapper de layout, sem sidebar. Igual ao Login e Register.

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { height: 100%; }
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
            }}>
                {label}
            </label>
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
    })

    const [saving, setSaving] = useState(false)

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
            await fetch('/api/business-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, fixedCostPercentage: cfPercent }),
            })
            navigate('/calculator')
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <style>{FONTS}</style>

            {/* ROOT: fullscreen split, sem sidebar */}
            <div style={{
                display: 'flex',
                width: '100vw',
                minHeight: '100vh',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>

                {/* ═══════════════════════════════════════════
            PAINEL ESQUERDO — verde, fixo, motivacional
            ═══════════════════════════════════════════ */}
                <div style={{
                    width: '42%',
                    minWidth: 360,
                    background: '#1A5C3A',
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '40px 44px',
                    overflow: 'hidden',
                }}>

                    {/* Logo */}
                    <div style={{ marginBottom: 52 }}>
                        <span style={{
                            fontFamily: "'Fraunces', serif",
                            fontWeight: 900,
                            fontSize: 26,
                            color: '#FFFFFF',
                            letterSpacing: '-0.03em',
                        }}>
                            Mark<em style={{ fontStyle: 'italic', color: '#FFF176' }}>ap</em>
                        </span>
                    </div>

                    {/* Headline */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            fontFamily: "'Fraunces', serif",
                            fontWeight: 900,
                            fontSize: 42,
                            lineHeight: 1.08,
                            letterSpacing: '-0.03em',
                            color: '#FFFFFF',
                            marginBottom: 20,
                        }}>
                            Conhecer seus custos é{' '}
                            <mark style={{
                                background: '#FFF176',
                                color: '#1A5C3A',
                                padding: '1px 5px',
                                borderRadius: 4,
                                WebkitBoxDecorationBreak: 'clone',
                                boxDecorationBreak: 'clone',
                                fontStyle: 'normal',
                            }}>
                                o primeiro passo
                            </mark>
                            {' '}para lucrar de verdade.
                        </h1>

                        <p style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 15,
                            lineHeight: 1.65,
                            color: 'rgba(255,255,255,0.65)',
                            marginBottom: 40,
                        }}>
                            Muitos empreendedores precificam no achismo e perdem
                            dinheiro sem saber. Isso acaba aqui.
                        </p>

                        {/* Steps */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
                            {[
                                { num: 1, label: 'Perfil da empresa', done: true },
                                { num: 2, label: 'Custos fixos', active: true },
                            ].map((step) => (
                                <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: step.done ? '#FFF176' : '#FFFFFF',
                                        color: '#1A5C3A',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 13,
                                        fontWeight: 800,
                                        fontFamily: "'Fraunces', serif",
                                        flexShrink: 0,
                                    }}>
                                        {step.done ? '✓' : step.num}
                                    </div>
                                    <span style={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontSize: 14,
                                        fontWeight: step.active ? 700 : 400,
                                        color: step.active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                                    }}>
                                        {step.label}{step.active ? ' ← atual' : ''}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Card O que é custo fixo */}
                        <div style={{
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.14)',
                            borderRadius: 16,
                            padding: '18px 20px',
                            display: 'flex',
                            gap: 14,
                            alignItems: 'flex-start',
                        }}>
                            <div style={{
                                width: 36,
                                height: 36,
                                background: '#FFF176',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                                flexShrink: 0,
                            }}>💡</div>
                            <div>
                                <p style={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    color: '#FFFFFF',
                                    marginBottom: 6,
                                }}>O que é custo fixo?</p>
                                <p style={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontSize: 12,
                                    lineHeight: 1.65,
                                    color: 'rgba(255,255,255,0.6)',
                                }}>
                                    São gastos que você tem todo mês, independente de vender ou não.
                                    Aluguel, salário, contador — esses valores precisam estar embutidos no seu preço.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.3)',
                        marginTop: 32,
                    }}>
                        Dados seguros e privados. Só você tem acesso.
                    </p>
                </div>

                {/* ═══════════════════════════════════════════
            PAINEL DIREITO — branco, formulário
            ═══════════════════════════════════════════ */}
                <div style={{
                    flex: 1,
                    background: '#F7F7F7',
                    minHeight: '100vh',
                    overflowY: 'auto',
                }}>

                    {/* Header interno */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '24px 48px',
                        background: '#FFFFFF',
                        borderBottom: '1px solid #F0F0F0',
                    }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 13,
                                color: '#64748B',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            ← Voltar
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 34,
                                height: 34,
                                background: '#1A5C3A',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFF176',
                                fontWeight: 800,
                                fontFamily: "'Fraunces', serif",
                                fontSize: 14,
                            }}>A</div>
                            <div>
                                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#0F0E0C' }}>Sua Empresa</p>
                                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#9CA3AF' }}>Admin</p>
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo do formulário */}
                    <div style={{ padding: '40px 48px', maxWidth: 680, margin: '0 auto' }}>

                        {/* Título da página */}
                        <div style={{ marginBottom: 40 }}>
                            <h2 style={{
                                fontFamily: "'Fraunces', serif",
                                fontWeight: 800,
                                fontSize: 28,
                                color: '#0F0E0C',
                                letterSpacing: '-0.02em',
                                marginBottom: 6,
                            }}>
                                Perfil da Empresa
                            </h2>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#64748B' }}>
                                Seus custos fixos mensais
                            </p>
                        </div>

                        {/* ─── SEÇÃO 1: Custos Fixos ─── */}
                        <div style={{ marginBottom: 40 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginBottom: 24,
                                paddingBottom: 16,
                                borderBottom: '2px solid #F0FDF4',
                            }}>
                                <div style={{
                                    width: 32, height: 32,
                                    borderRadius: '50%',
                                    background: '#1A5C3A',
                                    color: '#FFF176',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 800,
                                    fontSize: 14,
                                    flexShrink: 0,
                                }}>1</div>
                                <h3 style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 800,
                                    fontSize: 20,
                                    color: '#0F0E0C',
                                    letterSpacing: '-0.02em',
                                }}>Custos Fixos Mensais</h3>
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

                            {/* Total */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: '#DCFCE7',
                                border: '1px solid #86EFAC',
                                borderRadius: 12,
                                padding: '16px 20px',
                                marginTop: 24,
                            }}>
                                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#1A5C3A' }}>
                                    Total de custos fixos:
                                </span>
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: '#1A5C3A', letterSpacing: '-0.01em' }}>
                                    {formatCurrency(totalFixedCosts)}
                                </span>
                            </div>
                        </div>

                        {/* ─── SEÇÃO 2: Faturamento Previsto ─── */}
                        <div style={{ marginBottom: 40 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginBottom: 24,
                                paddingBottom: 16,
                                borderBottom: '2px solid #F0FDF4',
                            }}>
                                <div style={{
                                    width: 32, height: 32,
                                    borderRadius: '50%',
                                    background: '#1A5C3A',
                                    color: '#FFF176',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 800,
                                    fontSize: 14,
                                    flexShrink: 0,
                                }}>2</div>
                                <h3 style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 800,
                                    fontSize: 20,
                                    color: '#0F0E0C',
                                    letterSpacing: '-0.02em',
                                }}>Faturamento Previsto</h3>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                                    Quanto você pretende faturar esse mês?
                                </p>
                                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>
                                    Usado para calcular o percentual de custo fixo por produto
                                </p>
                                <CurrencyInput
                                    icon="💰"
                                    value={form.expectedMonthlyRevenue}
                                    onChange={set('expectedMonthlyRevenue')}
                                />
                            </div>

                            {/* CF% em tempo real */}
                            {form.expectedMonthlyRevenue > 0 && (
                                <div style={{
                                    background: '#FFFFFF',
                                    border: `1.5px solid ${cfColor}`,
                                    borderRadius: 12,
                                    padding: '16px 20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#374151' }}>
                                        {cfLabel}
                                    </p>
                                    <span style={{
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 20,
                                        fontWeight: 500,
                                        color: cfColor,
                                        letterSpacing: '-0.01em',
                                        flexShrink: 0,
                                        marginLeft: 16,
                                    }}>
                                        {cfPercent.toFixed(1)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* ─── SEÇÃO 3: Modo de Precificação ─── */}
                        <div style={{ marginBottom: 48 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginBottom: 24,
                                paddingBottom: 16,
                                borderBottom: '2px solid #F0FDF4',
                            }}>
                                <div style={{
                                    width: 32, height: 32,
                                    borderRadius: '50%',
                                    background: '#1A5C3A',
                                    color: '#FFF176',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 800,
                                    fontSize: 14,
                                    flexShrink: 0,
                                }}>3</div>
                                <h3 style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 800,
                                    fontSize: 20,
                                    color: '#0F0E0C',
                                    letterSpacing: '-0.02em',
                                }}>Modo de Precificação</h3>
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
                                        subtitle: 'Para produtos com volumes diferentes',
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
                                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                        letterSpacing: '0.08em',
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

                        {/* ─── BOTÃO SALVAR ─── */}
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            style={{
                                width: '100%',
                                background: '#1A5C3A',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: 14,
                                padding: '18px 24px',
                                fontSize: 16,
                                fontWeight: 800,
                                fontFamily: "'Fraunces', serif",
                                letterSpacing: '-0.01em',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.7 : 1,
                                transition: 'all 0.15s ease',
                                marginBottom: 16,
                            }}
                            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = '#143d28' }}
                            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = '#1A5C3A' }}
                        >
                            {saving ? 'Salvando...' : 'Salvar e ir para a Calculadora →'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={() => navigate('/calculator')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontSize: 13,
                                    color: '#9CA3AF',
                                }}
                            >
                                Pular por agora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
