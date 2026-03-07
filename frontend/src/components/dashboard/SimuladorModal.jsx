import { useState } from "react";
import { C } from "../../tokens/colors";
import { NumericField } from "../ui/PremiumInputs";

export default function SimuladorModal({ produto, onClose, onApply, businessProfile }) {
    const [novo, setNovo] = useState(produto.preco);

    const cfPercent = businessProfile?.fixedCostPercentage || 0;
    const varDeductionsPct = (produto.taxRate || 0) + (produto.cardFee || 0) + (produto.marketplaceFee || 0) + (produto.commission || 0);
    const directCost = (produto.productionCost || 0) + (produto.laborCost || 0) + (produto.packagingCost || 0) + (produto.shippingCost || 0);

    // Margem líquida real
    const mn = novo > 0 ? (((novo - directCost) / novo) * 100) - (varDeductionsPct + cfPercent) : 0;
    const volume = produto.expectedVolume || 20;
    const lucroMes = (novo * (mn / 100)) * volume;
    const diff = novo - produto.preco;
    const mc = mn < 15 ? C.redMid : mn < 25 ? C.orange : C.greenFresh;

    // Waterfall: valores absolutos por unidade
    const custoAbs = directCost;
    const taxasAbs = novo * (varDeductionsPct / 100);
    const cfAbs = novo * (cfPercent / 100);
    const margemAbs = novo - custoAbs - taxasAbs - cfAbs;

    // Fatias como % do preço
    const custoPct = novo > 0 ? (custoAbs / novo) * 100 : 0;
    const taxasPct = varDeductionsPct;
    const cfPct = cfPercent;
    const margemPct = Math.max(0, 100 - custoPct - taxasPct - cfPct);

    const fmtBRL = (v) => `R$ ${Math.abs(v).toFixed(2).replace(".", ",")}`;

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(14,24,16,0.6)", backdropFilter: "blur(5px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={onClose}
        >
            <style>{`@keyframes popIn{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
            <div
                style={{ background: C.white, borderRadius: 24, padding: "28px", width: 460, maxWidth: "calc(100vw - 32px)", boxShadow: "0 32px 80px rgba(14,24,16,0.3)", animation: "popIn .3s cubic-bezier(.22,1,.36,1)", maxHeight: "90vh", overflowY: "auto" }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                        <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Simulador de Preço</p>
                        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: C.ink }}>{produto.nome}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: C.paperWarm, border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, color: C.inkMuted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    >
                        ✕
                    </button>
                </div>

                {/* Referências */}
                <div style={{ background: C.paperWarm, borderRadius: 12, padding: "12px 14px", marginBottom: 18, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                        ["Preço atual", fmtBRL(produto.preco)],
                        ["Custo direto", fmtBRL(directCost)],
                        [`Volume (${volume} un)`, `${volume} un/mês`],
                    ].map(([l, v]) => (
                        <div key={l} style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 9, color: C.inkMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>{l}</p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{v}</p>
                        </div>
                    ))}
                </div>

                {/* Slider e Input */}
                <div style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                        <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Simular Preço</p>
                        <div style={{ width: 120 }}>
                            <NumericField
                                value={novo}
                                onChange={setNovo}
                                prefix="R$"
                            />
                        </div>
                    </div>

                    <input
                        type="range"
                        min={Math.max(directCost * 0.5, 1)}
                        max={produto.preco * 2.5}
                        step={0.1}
                        value={novo}
                        onChange={e => setNovo(parseFloat(e.target.value))}
                        style={{ width: "100%", accentColor: C.green, cursor: "pointer", marginBottom: 12 }}
                    />

                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 44, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", textAlign: "center", marginBottom: 8, lineHeight: 1 }}>
                        {fmtBRL(novo)}
                    </div>

                    {diff !== 0 && (
                        <p style={{ textAlign: "center", fontSize: 12, color: diff > 0 ? C.greenMid : C.redMid, fontWeight: 600 }}>
                            {diff > 0 ? "↑" : "↓"} {fmtBRL(diff)} vs. preço atual
                        </p>
                    )}
                </div>

                {/* Price Waterfall */}
                <div style={{ marginBottom: 18 }}>
                    <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Onde vai o dinheiro?</p>

                    {/* Barra segmentada */}
                    <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", gap: 1, marginBottom: 12 }}>
                        <div style={{ width: `${Math.min(custoPct, 100)}%`, background: C.costDirect, minWidth: custoPct > 1 ? 3 : 0 }} title="Custo direto" />
                        <div style={{ width: `${Math.min(taxasPct, 100)}%`, background: C.fees, minWidth: taxasPct > 1 ? 3 : 0 }} title="Taxas e impostos" />
                        <div style={{ width: `${Math.min(cfPct, 100)}%`, background: C.costFixed, minWidth: cfPct > 1 ? 3 : 0 }} title="Custo fixo" />
                        <div style={{ flex: 1, background: C.margin, minWidth: 3, borderRadius: "0 99px 99px 0" }} title="Margem líquida" />
                    </div>

                    {/* Itens do waterfall */}
                    {[
                        { label: "Custo direto", valor: custoAbs, pct: custoPct, cor: C.costDirect, sinal: "-" },
                        { label: "Taxas e impostos", valor: taxasAbs, pct: taxasPct, cor: C.fees, sinal: "-" },
                        { label: "Custo fixo (CF%)", valor: cfAbs, pct: cfPct, cor: C.costFixed, sinal: "-", oculto: cfPercent === 0 },
                        { label: "Margem líquida", valor: margemAbs, pct: margemPct, cor: C.margin, sinal: margemAbs >= 0 ? "=" : "=" },
                    ].filter(i => !i.oculto).map((item, idx, arr) => (
                        <div
                            key={item.label}
                            style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "7px 10px",
                                background: idx === arr.length - 1 ? (mn < 15 ? C.redPale : mn < 25 ? C.orangePale : C.greenPale) : C.paperWarm,
                                borderRadius: 9,
                                marginBottom: 3,
                                borderLeft: idx === arr.length - 1 ? `3px solid ${mc}` : "3px solid transparent",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: item.cor, flexShrink: 0 }} />
                                <span style={{ fontSize: 12, color: idx === arr.length - 1 ? C.ink : C.inkLight, fontWeight: idx === arr.length - 1 ? 700 : 400 }}>
                                    {item.label}
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <span style={{ fontSize: 10, color: C.inkMuted }}>{item.pct.toFixed(1)}%</span>
                                <span style={{ fontSize: 13, fontWeight: idx === arr.length - 1 ? 800 : 600, color: idx === arr.length - 1 ? mc : C.inkMid, fontFamily: "'Fraunces',serif" }}>
                                    {item.sinal !== "=" ? `− ${fmtBRL(item.valor)}` : fmtBRL(margemAbs)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* KPIs: Margem + Lucro/mês */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[
                        { l: "Margem líquida", v: `${mn.toFixed(1)}%`, c: mc },
                        { l: `Lucro/mês (${volume} un.)`, v: `R$ ${Math.round(Math.max(0, lucroMes)).toLocaleString("pt-BR")}`, c: mn >= 25 ? C.greenMid : mn >= 15 ? C.orange : C.redMid },
                    ].map(({ l, v, c }) => (
                        <div key={l} style={{ background: C.paperWarm, borderRadius: 12, padding: "13px", textAlign: "center" }}>
                            <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>{l}</p>
                            <p style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 800, color: c }}>{v}</p>
                        </div>
                    ))}
                </div>

                {/* Mensagem de contexto */}
                <div style={{ background: mn < 15 ? C.redPale : mn < 25 ? C.orangePale : C.greenPale, borderRadius: 10, padding: "10px 13px", marginBottom: 16, fontSize: 12, color: C.inkMid, lineHeight: 1.55, borderLeft: `3px solid ${mc}` }}>
                    {mn < 15
                        ? "Margem critica. Mesmo vendendo bem, sobra muito pouco depois de pagar custos e impostos."
                        : mn < 25
                            ? "Margem aceitavel, mas pode ser melhorada para cobrir imprevistos e gerar mais lucro."
                            : "Excelente margem! Este preco garante sustentabilidade e lucro real para o negocio."}
                </div>

                {/* CTA */}
                <button
                    onClick={() => { onApply(produto.id, novo, mn); onClose(); }}
                    style={{ width: "100%", background: C.green, color: C.paper, border: "none", borderRadius: 12, padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                    Aplicar este preço →
                </button>
            </div>
        </div>
    );
}
