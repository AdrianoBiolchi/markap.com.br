import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBusinessStore } from "../store/useBusinessStore";
import { useProductStore } from "../store/useProductStore";

/*
  MARKAP CALCULATOR — "O Coração do Markap"
  Layout: 2 Colunas Fixas (58% / 42%)
  Estilo: 100% Inline Styles
*/

const C = {
    verdePrimary: "#1A5C3A",
    verdeMid: "#2E7D52",
    verdeBright: "#22C55E",
    verdeLight: "#DCFCE7",
    branco: "#FFFFFF",
    offWhite: "#F7F7F7",
    ink: "#0F0E0C",
    amarelo: "#FFF176",
    coral: "#FF6B6B",
    borda: "#E2E8F0",
    textoMuted: "#64748B",
};

const F = {
    display: "'Fraunces', serif",
    body: "'Plus Jakarta Sans', sans-serif",
    mono: "'DM Mono', monospace",
};

export default function Calculator() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile, fetchProfile } = useBusinessStore();
    const { products, addProduct, updateProduct } = useProductStore();

    const [activeTab, setActiveTab] = useState(0);
    const [productName, setProductName] = useState("");
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
        maxDiscount: 0,
        competitorPrice: 0,
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        fetchProfile();
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [fetchProfile]);

    useEffect(() => {
        if (id) {
            const p = products.find((prod) => prod.id === id);
            if (p) {
                setProductName(p.name || "");
                setForm({
                    productionCost: p.productionCost || 0,
                    laborCost: p.laborCost || 0,
                    packagingCost: p.packagingCost || 0,
                    shippingCost: p.shippingCost || 0,
                    taxRate: p.taxRate || 0,
                    cardFee: p.cardFee || 0,
                    marketplaceFee: p.marketplaceFee || 0,
                    commission: p.commission || 0,
                    desiredMargin: p.desiredMargin || 30,
                    maxDiscount: p.maxDiscount || 0,
                    competitorPrice: p.competitorPrice || 0,
                });
            }
        }
    }, [id, products]);

    // Helpers
    const formatBRL = (v) =>
        v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const parseCurrency = (str) => {
        if (typeof str === "number") return str;
        const numeric = parseFloat(str.replace(/\D/g, "")) / 100;
        return isNaN(numeric) ? 0 : numeric;
    };

    const handleInputChange = (field, val, isPercent = false) => {
        const value = isPercent ? parseFloat(val) || 0 : parseCurrency(val);
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // Profile Data
    const profileCosts = useMemo(() => {
        if (!profile) return { totalFixed: 0, percent: 0 };
        const totalFixed =
            (profile.monthlyRent || 0) +
            (profile.ownerSalary || 0) +
            (profile.employeesCost || 0) +
            (profile.utilitiesCost || 0) +
            (profile.accountingCost || 0) +
            (profile.systemsCost || 0) +
            (profile.marketingCost || 0) +
            (profile.otherFixedCosts || 0);
        const percent = profile.expectedMonthlyRevenue > 0
            ? (totalFixed / profile.expectedMonthlyRevenue) * 100
            : 0;
        return { totalFixed, percent };
    }, [profile]);

    // CALCULATION ENGINE
    const results = useMemo(() => {
        const totalCost =
            form.productionCost +
            form.laborCost +
            form.packagingCost +
            form.shippingCost;

        const fixedCP = profileCosts.percent;
        const deductions =
            fixedCP +
            form.taxRate +
            form.cardFee +
            form.marketplaceFee +
            form.commission +
            form.desiredMargin;

        const suggestedPrice = deductions < 100 ? totalCost / (1 - deductions / 100) : 0;

        const netMargin = suggestedPrice > 0
            ? ((suggestedPrice - totalCost - (suggestedPrice * (deductions - form.desiredMargin)) / 100) / suggestedPrice) * 100
            : 0;

        const breakEven = suggestedPrice > totalCost
            ? Math.ceil(profileCosts.totalFixed / (suggestedPrice - totalCost - (suggestedPrice * (form.taxRate + form.cardFee + form.marketplaceFee + form.commission)) / 100))
            : 0;

        const healthScore =
            netMargin >= 30 ? Math.min(100, 70 + netMargin) :
                netMargin >= 15 ? 50 + netMargin :
                    netMargin >= 0 ? netMargin * 3 : 0;

        return {
            totalCost,
            suggestedPrice,
            netMargin,
            breakEven: breakEven > 0 ? breakEven : 0,
            healthScore,
            deductions,
            fixedCP
        };
    }, [form, profileCosts]);

    const handleSave = async () => {
        const data = { ...form, name: productName, ...results };
        let ok;
        if (id) {
            ok = await updateProduct({ ...data, id });
        } else {
            ok = await addProduct(data);
        }
        if (ok) navigate("/dashboard");
    };

    return (
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh", backgroundColor: C.branco }}>

            {/* PAINEL ESQUERDO (58%) */}
            <div style={{ flex: isMobile ? "none" : "0 0 58%", padding: isMobile ? "24px" : "60px 80px", backgroundColor: C.offWhite, boxSizing: "border-box" }}>

                {/* Banner CF% não configurado */}
                {profileCosts.totalFixed === 0 && (
                    <div style={{ backgroundColor: C.amarelo, padding: "12px 20px", borderRadius: 12, marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(0,0,0,0.05)" }}>
                        <span style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600 }}>⚠️ Configure seus custos fixos para um cálculo preciso.</span>
                        <button onClick={() => navigate("/business-profile")} style={{ background: C.ink, color: C.branco, border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Configurar agora</button>
                    </div>
                )}

                {/* Nome do Produto */}
                <div style={{ marginBottom: 40 }}>
                    <label style={{ display: "block", fontSize: 12, color: C.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Nome do produto</label>
                    <input
                        type="text"
                        placeholder="Ex: Bolsa Couro Artesanal, Consultoria hora, Brigadeiro"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        style={{
                            width: "100%",
                            border: "none",
                            background: "transparent",
                            fontFamily: F.display,
                            fontSize: 24,
                            fontWeight: 800,
                            color: C.ink,
                            outline: "none",
                            borderBottom: `2px solid transparent`,
                            transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.target.style.borderBottom = `2px solid ${C.verdePrimary}`}
                        onBlur={(e) => e.target.style.borderBottom = `2px solid transparent`}
                    />
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                    {["1. Custos do produto", "2. Taxas e canais", "3. Estratégia"].map((label, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 100,
                                border: "1px solid",
                                borderColor: activeTab === i ? C.verdePrimary : C.borda,
                                backgroundColor: activeTab === i ? C.verdePrimary : "transparent",
                                color: activeTab === i ? C.branco : C.textoMuted,
                                fontFamily: F.body,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Conteúdo Aba 1 */}
                {activeTab === 0 && (
                    <div className="tab-content" style={{ animation: "fadeIn 0.3s ease" }}>
                        <Grid>
                            <InputGroup label="Custo de produção" val={form.productionCost} name="productionCost" onChange={handleInputChange} desc="Matéria-prima, insumos, mercadoria" />
                            <InputGroup label="Mão de obra" val={form.laborCost} name="laborCost" onChange={handleInputChange} desc="Tempo para produzir cada unidade" />
                            <InputGroup label="Embalagem" val={form.packagingCost} name="packagingCost" onChange={handleInputChange} desc="Caixa, sacola, etiqueta" />
                            <InputGroup label="Frete / logística" val={form.shippingCost} name="shippingCost" onChange={handleInputChange} desc="Custo de transporte por unidade" />
                        </Grid>
                        <div style={{ backgroundColor: C.verdeLight, padding: 16, borderRadius: 12, marginTop: 24, fontFamily: F.body, fontSize: 14 }}>
                            <strong style={{ color: C.verdePrimary }}>Custo direto total:</strong> {formatBRL(results.totalCost)}
                        </div>
                    </div>
                )}

                {/* Conteúdo Aba 2 */}
                {activeTab === 1 && (
                    <div className="tab-content" style={{ animation: "fadeIn 0.3s ease" }}>
                        <Grid>
                            <InputGroup label="Imposto (%)" val={form.taxRate} name="taxRate" isPercent onChange={handleInputChange} desc="Simples, MEI, etc." />
                            <InputGroup label="Taxa do cartão (%)" val={form.cardFee} name="cardFee" isPercent onChange={handleInputChange} desc="Maquininha ou gateway" />
                            <InputGroup label="Taxa marketplace (%)" val={form.marketplaceFee} name="marketplaceFee" isPercent onChange={handleInputChange} desc="Shopee, ML, iFood, etc." />
                            <InputGroup label="Comissão (%)" val={form.commission} name="commission" isPercent onChange={handleInputChange} desc="Vendedor ou representante" />
                        </Grid>
                        <div style={{ marginTop: 32, padding: 20, backgroundColor: C.branco, borderRadius: 16, border: `1px solid ${C.borda}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h4 style={{ margin: 0, fontFamily: F.body, fontSize: 13, color: C.textoMuted }}>Custo Fixo (CF%) atual:</h4>
                                    <p style={{ margin: "4px 0 0", fontFamily: F.mono, fontSize: 18, fontWeight: 500, color: C.ink }}>{results.fixedCP.toFixed(1)}%</p>
                                </div>
                                <button onClick={() => navigate("/business-profile")} style={{ background: "none", border: "none", color: C.verdePrimary, fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Alterar no perfil da empresa →</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conteúdo Aba 3 */}
                {activeTab === 2 && (
                    <div className="tab-content" style={{ animation: "fadeIn 0.3s ease" }}>
                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                                <label style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: C.ink }}>Margem desejada (%)</label>
                                <span style={{ fontFamily: F.mono, fontSize: 18, fontWeight: 500, color: C.verdePrimary }}>{form.desiredMargin}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="80"
                                value={form.desiredMargin}
                                onChange={(e) => handleInputChange("desiredMargin", e.target.value, true)}
                                style={{
                                    width: "100%",
                                    height: 6,
                                    borderRadius: 3,
                                    appearance: "none",
                                    background: form.desiredMargin < 15 ? C.coral : form.desiredMargin < 30 ? C.amarelo : C.verdeBright,
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            />
                            <p style={{ fontSize: 11, color: C.textoMuted, marginTop: 8, textAlign: "right", fontWeight: 600 }}>
                                {form.desiredMargin < 15 ? "Margem conservadora" : form.desiredMargin < 30 ? "Margem saudável" : "Margem premium"}
                            </p>
                        </div>
                        <Grid>
                            <InputGroup label="Desconto máximo (%)" val={form.maxDiscount} name="maxDiscount" isPercent onChange={handleInputChange} desc="Limite sem entrar no prejuízo" />
                            <InputGroup label="Preço do concorrente" val={form.competitorPrice} name="competitorPrice" onChange={handleInputChange} desc="Valor cobrado no mercado" />
                        </Grid>

                        {form.competitorPrice > 0 && results.suggestedPrice > 0 && (
                            <div style={{ marginTop: 24, padding: 16, borderRadius: 12, backgroundColor: C.branco, border: `1px solid ${C.borda}` }}>
                                <p style={{ margin: 0, fontFamily: F.body, fontSize: 13, color: C.ink }}>
                                    Diferença para o concorrente:
                                    <strong style={{ marginLeft: 8, color: results.suggestedPrice > form.competitorPrice ? C.coral : C.verdePrimary }}>
                                        {results.suggestedPrice > form.competitorPrice ? "+" : "-"}
                                        {formatBRL(Math.abs(results.suggestedPrice - form.competitorPrice))}
                                        ({((results.suggestedPrice / form.competitorPrice - 1) * 100).toFixed(1)}%)
                                    </strong>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Botão Salvar (Mobile) */}
                {isMobile && (
                    <button onClick={handleSave} style={{ width: "100%", marginTop: 32, padding: 20, backgroundColor: C.verdePrimary, color: C.branco, border: "none", borderRadius: 16, fontFamily: F.display, fontWeight: 700, fontSize: 16 }}>Salvar Produto</button>
                )}
            </div>

            {/* PAINEL DIREITO — RESULTADO (42%) */}
            <div style={{
                flex: isMobile ? "none" : "0 0 42%",
                backgroundColor: C.verdePrimary,
                padding: isMobile ? "40px 24px" : "60px",
                color: C.branco,
                position: isMobile ? "relative" : "sticky",
                top: 0,
                height: isMobile ? "auto" : "100vh",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                {/* Bloco 1 — Preço Sugerido (hero) */}
                <div>
                    <div style={{
                        padding: '28px 28px 0 28px',
                        borderBottom: 'none',
                    }}>
                        <p style={{
                            fontSize: 10,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.45)',
                            marginBottom: 4,
                        }}>PREÇO SUGERIDO</p>

                        <p style={{
                            fontFamily: "'Fraunces', serif",
                            fontWeight: 900,
                            fontSize: 'clamp(52px, 6vw, 80px)',
                            lineHeight: 0.95,
                            letterSpacing: '-0.04em',
                            color: '#FFFFFF',
                            marginBottom: 14,
                            wordBreak: 'break-all',
                        }}>
                            {results.suggestedPrice > 0 ? formatBRL(results.suggestedPrice) : 'R$ —'}
                        </p>

                        <div style={{ marginBottom: 24 }}>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                background: results.healthScore >= 80 ? 'rgba(34,197,94,0.2)' :
                                    results.healthScore >= 50 ? 'rgba(255,241,118,0.2)' :
                                        'rgba(255,107,107,0.2)',
                                border: `1px solid ${results.healthScore >= 80 ? 'rgba(34,197,94,0.4)' :
                                        results.healthScore >= 50 ? 'rgba(255,241,118,0.4)' :
                                            'rgba(255,107,107,0.4)'
                                    }`,
                                color: results.healthScore >= 80 ? '#22C55E' :
                                    results.healthScore >= 50 ? '#FFF176' :
                                        '#FF6B6B',
                                fontSize: 11,
                                fontWeight: 700,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                borderRadius: 99,
                                padding: '4px 12px',
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                                {results.healthScore >= 80 ? 'Saudável' : results.healthScore >= 50 ? 'Atenção' : 'Crítico'}
                            </span>
                        </div>
                    </div>

                    {results.deductions >= 100 && (
                        <div style={{ padding: 16, backgroundColor: "rgba(255,107,107,0.2)", borderRadius: 12, border: `1px solid ${C.coral}`, marginBottom: 24 }}>
                            <p style={{ margin: 0, fontSize: 13, color: C.coral, fontWeight: 600 }}>⚠️ Seus custos ultrapassam 100% do preço. Reduza as taxas ou aumente a margem base.</p>
                        </div>
                    )}

                    {/* Bloco 2 — Métricas secundárias */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1px 1fr',
                        gap: 0,
                        margin: '24px 0',
                        padding: '20px 0',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <div style={{ paddingRight: 20 }}>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                MARGEM REAL
                            </p>
                            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 500, color: '#FFFFFF', lineHeight: 1 }}>
                                {results.netMargin.toFixed(1)}%
                            </p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ paddingLeft: 20 }}>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                EQUILÍBRIO
                            </p>
                            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 500, color: '#FFFFFF', lineHeight: 1 }}>
                                {results.breakEven} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>un/mês</span>
                            </p>
                        </div>
                    </div>

                    {/* Bloco 3 — Composição visual */}
                    <div style={{ marginBottom: 24 }}>
                        <p style={{
                            fontSize: 10,
                            color: 'rgba(255,255,255,0.4)',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginBottom: 12,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>COMPOSIÇÃO DO PREÇO</p>

                        <div style={{
                            display: 'flex',
                            height: 8,
                            borderRadius: 99,
                            overflow: 'hidden',
                            background: 'rgba(255,255,255,0.1)',
                            marginBottom: 12,
                        }}>
                            {results.suggestedPrice > 0 && [
                                { value: results.totalCost / results.suggestedPrice * 100, color: '#94A3B8', label: 'Custo' },
                                { value: results.fixedCP, color: '#64748B', label: 'CF' },
                                { value: form.taxRate, color: '#F59E0B', label: 'Impostos' },
                                { value: (form.cardFee + form.marketplaceFee + form.commission), color: '#FB923C', label: 'Taxas' },
                                { value: form.desiredMargin, color: '#22C55E', label: 'Margem' },
                            ].map((seg, i) => (
                                <div key={i} style={{
                                    width: `${Math.max(seg.value, 0)}%`,
                                    background: seg.color,
                                    transition: 'width 0.4s ease',
                                }} />
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10 }}>
                            {[
                                { color: '#94A3B8', label: 'Custo direto' },
                                { color: '#64748B', label: 'Custo fixo' },
                                { color: '#F59E0B', label: 'Impostos' },
                                { color: '#FB923C', label: 'Taxas' },
                                { color: '#22C55E', label: 'Margem' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bloco 4 — Linguagem Simples ou Estado Vazio */}
                    {results.totalCost > 0 && results.suggestedPrice > 0 ? (
                        <div style={{
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 14,
                            padding: '16px 18px',
                            marginBottom: 20,
                        }}>
                            <p style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 12,
                                lineHeight: 1.7,
                                color: 'rgba(255,255,255,0.7)',
                                margin: 0,
                            }}>
                                Você gasta{' '}
                                <strong style={{ color: '#FFFFFF' }}>
                                    {formatBRL(results.totalCost)}
                                </strong>{' '}
                                para fazer este produto. Com seus custos fixos e margem de{' '}
                                <strong style={{ color: '#FFF176' }}>
                                    {form.desiredMargin}%
                                </strong>
                                , o preço ideal é{' '}
                                <strong style={{ color: '#FFFFFF' }}>
                                    {formatBRL(results.suggestedPrice)}
                                </strong>.
                                {results.netMargin < 0 && (
                                    <span style={{ color: '#FF6B6B' }}>
                                        {' '}Se vender por menos, você perde dinheiro.
                                    </span>
                                )}
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12,
                            padding: '32px 0',
                            opacity: 0.5,
                        }}>
                            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                                <rect x="4" y="2" width="16" height="20" rx="3" stroke="white" strokeWidth="1.5" />
                                <path d="M8 7h8M8 11h5M8 15h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <p style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.6)',
                                textAlign: 'center',
                                lineHeight: 1.5,
                                margin: 0,
                            }}>
                                Preencha os custos do produto<br />para ver o preço ideal.
                            </p>
                        </div>
                    )}
                </div>

                {/* Bloco 5 — Botão de salvar */}
                {!isMobile && (
                    <div>
                        <button
                            onClick={handleSave}
                            style={{
                                width: '100%',
                                background: '#FFF176',
                                color: '#1A5C3A',
                                border: 'none',
                                borderRadius: 12,
                                padding: '16px 24px',
                                fontSize: 15,
                                fontWeight: 800,
                                fontFamily: "'Fraunces', serif",
                                letterSpacing: '-0.01em',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                marginBottom: 12,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#F5E60A'; e.currentTarget.style.transform = 'scale(1.01)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#FFF176'; e.currentTarget.style.transform = 'scale(1)' }}
                        >
                            Salvar como produto →
                        </button>
                        <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 16, cursor: "pointer", width: "100%" }}>
                            Simular outros cenários <span style={{ fontSize: 9, background: C.coral, color: C.branco, padding: "2px 6px", borderRadius: 4, marginLeft: 4 }}>PRO</span>
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 4px solid #1A5C3A;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
        </div>
    );
}

function Grid({ children }) {
    return <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 1024 ? "1fr" : "1fr 1fr", gap: 24 }}>{children}</div>;
}

function InputGroup({ label, val, name, onChange, desc, isPercent = false }) {
    const [focused, setFocused] = useState(false);
    const formatValue = (v) => isPercent ? v : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div>
            <label style={{ display: "flex", justifyContent: "space-between", fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 6 }}>
                {label}
                {isPercent && <span style={{ color: C.textoMuted }}>%</span>}
            </label>
            <input
                type="text"
                value={formatValue(val)}
                onChange={(e) => onChange(name, e.target.value, isPercent)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `1px solid ${focused ? C.verdePrimary : C.borda}`,
                    boxShadow: focused ? `0 0 0 3px rgba(26,92,58,0.12)` : "none",
                    backgroundColor: C.branco,
                    fontFamily: F.mono,
                    fontSize: 15,
                    color: C.ink,
                    outline: "none",
                    transition: "all 0.2s"
                }}
            />
            <p style={{ fontSize: 11, color: C.textoMuted, marginTop: 6, margin: 0 }}>{desc}</p>
        </div>
    );
}
