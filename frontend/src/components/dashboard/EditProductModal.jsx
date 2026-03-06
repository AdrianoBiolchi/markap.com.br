import { useState, useEffect } from "react";
import { C } from "../../tokens/colors";
import { NumericField, StepperField } from "../ui/PremiumInputs";

export default function EditProductModal({ produto, editForm, setEditForm, businessProfile, marginTarget, onSave, onClose, salvando }) {
    const ef = editForm;
    const eCusto = (ef.productionCost || 0) + (ef.laborCost || 0) + (ef.packagingCost || 0) + (ef.shippingCost || 0);
    const eVarDed = (ef.taxRate || 0) + (ef.cardFee || 0) + (ef.commission || 0) + (ef.marketplaceFee || 0);
    const eCF = businessProfile?.fixedCostPercentage || 0;
    const ePreco = ef.suggestedPrice || 0;
    const eMargem = ePreco > 0
        ? Math.round((((ePreco - eCusto) / ePreco * 100) - (eVarDed + eCF)) * 10) / 10
        : 0;
    const eLucro = Math.max(0, ePreco - eCusto - (ePreco * (eVarDed + eCF) / 100));
    const eLucroMes = eLucro * (ef.expectedVolume || 20);
    const eMc = eMargem >= marginTarget ? C.greenFresh : eMargem >= marginTarget * 0.6 ? C.orange : C.redMid;
    const fmtR = (v) => `R$ ${v.toFixed(2).replace(".", ",")}`;

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(14,24,16,0.6)", backdropFilter: "blur(5px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={onClose}
        >
            <style>{`
                @keyframes popIn{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
            `}</style>
            <div
                style={{ background: C.white, borderRadius: 24, padding: 28, width: 520, maxWidth: "calc(100vw - 32px)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(14,24,16,0.3)", animation: "popIn .3s cubic-bezier(.22,1,.36,1)" }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                        <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Editar Produto</p>
                        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: C.ink }}>{produto.nome}</h3>
                    </div>
                    <button onClick={onClose} style={{ background: C.paperWarm, border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, color: C.inkMuted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
                </div>

                {/* Preview de margem em tempo real */}
                <div style={{ background: eMargem >= marginTarget ? C.greenPale : eMargem >= marginTarget * 0.6 ? C.orangePale : C.redPale, borderRadius: 12, padding: "12px 16px", marginBottom: 20, borderLeft: `3px solid ${eMc}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                        {[
                            { l: "Margem líquida", v: `${eMargem.toFixed(1)}%`, c: eMc, big: true },
                            { l: "Lucro/peça", v: fmtR(eLucro), c: C.inkMid, big: false },
                            { l: "Lucro/mês", v: `R$ ${Math.round(eLucroMes).toLocaleString("pt-BR")}`, c: C.greenMid, big: false },
                            { l: `Meta ${marginTarget}%`, v: eMargem >= marginTarget ? "✓ Atingida" : `${(marginTarget - eMargem).toFixed(1)}% faltam`, c: eMargem >= marginTarget ? C.greenMid : C.orange, big: false },
                        ].map(kpi => (
                            <div key={kpi.l}>
                                <p style={{ fontSize: 9, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{kpi.l}</p>
                                <p style={{ fontFamily: kpi.big ? "'Fraunces',serif" : "inherit", fontSize: kpi.big ? 22 : 12, fontWeight: 700, color: kpi.c, lineHeight: 1.2 }}>{kpi.v}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preço e Volume */}
                <p style={{ fontSize: 10, color: C.inkMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Preço e Volume</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                    <NumericField label="Preço de venda" value={ef.suggestedPrice} onChange={v => setEditForm(f => ({ ...f, suggestedPrice: v }))} prefix="R$" />
                    <StepperField label="Volume esperado" value={ef.expectedVolume || 1} onChange={v => setEditForm(f => ({ ...f, expectedVolume: v }))} min={1} step={5} />
                </div>

                {/* Custos diretos */}
                <p style={{ fontSize: 10, color: C.inkMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                    Custos diretos <span style={{ color: C.inkMuted, fontWeight: 400, fontSize: 9, textTransform: "none" }}>— total: {fmtR(eCusto)}</span>
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                    <NumericField label="Aquisição / matéria-prima" value={ef.productionCost} onChange={v => setEditForm(f => ({ ...f, productionCost: v }))} prefix="R$" />
                    <NumericField label="Mão de obra" value={ef.laborCost} onChange={v => setEditForm(f => ({ ...f, laborCost: v }))} prefix="R$" />
                    <NumericField label="Embalagem" value={ef.packagingCost} onChange={v => setEditForm(f => ({ ...f, packagingCost: v }))} prefix="R$" />
                    <NumericField label="Envio / frete unitário" value={ef.shippingCost} onChange={v => setEditForm(f => ({ ...f, shippingCost: v }))} prefix="R$" disabled={businessProfile?.pricingMode === 'SIMPLE'} />
                </div>

                {/* Deduções variáveis (PRO) */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p style={{ fontSize: 10, color: C.inkMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Deduções variáveis <span style={{ color: C.inkMuted, fontWeight: 400, fontSize: 9, textTransform: "none" }}>— total: {eVarDed.toFixed(1)}%</span>
                    </p>
                    {businessProfile?.pricingMode === 'SIMPLE' && (
                        <span style={{ fontSize: 9, fontWeight: 700, background: C.paperWarm, color: C.inkMuted, padding: "2px 6px", borderRadius: 4 }}>HERDADO NO MODO SIMPLES</span>
                    )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                    <NumericField label="Impostos" value={ef.taxRate} onChange={v => setEditForm(f => ({ ...f, taxRate: v }))} suffix="%" disabled={businessProfile?.pricingMode === 'SIMPLE'} />
                    <NumericField label="Taxa cartão" value={ef.cardFee} onChange={v => setEditForm(f => ({ ...f, cardFee: v }))} suffix="%" disabled={businessProfile?.pricingMode === 'SIMPLE'} />
                    <NumericField label="Comissão" value={ef.commission} onChange={v => setEditForm(f => ({ ...f, commission: v }))} suffix="%" disabled={businessProfile?.pricingMode === 'SIMPLE'} />
                    <NumericField label="Marketplace" value={ef.marketplaceFee} onChange={v => setEditForm(f => ({ ...f, marketplaceFee: v }))} suffix="%" disabled={businessProfile?.pricingMode === 'SIMPLE'} />
                </div>

                {/* CTA */}

                <button
                    onClick={onSave}
                    disabled={salvando}
                    style={{ width: "100%", background: C.green, color: C.white, border: "none", borderRadius: 12, padding: "14px", fontSize: 13, fontWeight: 700, cursor: salvando ? "not-allowed" : "pointer", opacity: salvando ? 0.7 : 1 }}
                >
                    {salvando ? "Salvando..." : "Salvar produto →"}
                </button>
            </div>
        </div>
    );
}
