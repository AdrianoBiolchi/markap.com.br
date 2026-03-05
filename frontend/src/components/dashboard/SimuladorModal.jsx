import { useState } from "react";
import { C } from "../../tokens/colors";

export default function SimuladorModal({ produto, onClose, onApply }) {
    const [novo, setNovo] = useState(produto.preco);
    const margem = ((novo - produto.custo) / novo * 100).toFixed(1);
    const lucroMes = (novo - produto.custo) * 30;
    const diff = novo - produto.preco;
    const mn = parseFloat(margem);
    const mc = mn < 10 ? C.redMid : mn < 20 ? C.orange : C.greenFresh;

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(14,24,16,0.6)", backdropFilter: "blur(5px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
            <div style={{ background: C.white, borderRadius: 24, padding: "32px", width: 440, boxShadow: "0 32px 80px rgba(14,24,16,0.3)", animation: "popIn .3s cubic-bezier(.22,1,.36,1)" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div>
                        <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Simulador de Preço</p>
                        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 21, fontWeight: 700, color: C.ink }}>{produto.nome}</h3>
                    </div>
                    <button onClick={onClose} style={{ background: C.paperWarm, border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, color: C.inkMuted, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
                <div style={{ background: C.paperWarm, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: C.inkLight }}>Preço atual: <strong style={{ color: C.ink }}>R$ {produto.preco.toFixed(2).replace(".", ",")}</strong></span>
                        <span style={{ fontSize: 12, color: C.inkLight }}>Custo: <strong style={{ color: C.ink }}>R$ {produto.custo.toFixed(2).replace(".", ",")}</strong></span>
                    </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Arraste para simular</p>
                    <input type="range" min={produto.custo * 1.02} max={produto.preco * 2.2} step={0.5} value={novo} onChange={e => setNovo(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.green, cursor: "pointer" }} />
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 48, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", textAlign: "center", marginTop: 8, lineHeight: 1 }}>
                        R$ {novo.toFixed(2).replace(".", ",")}
                    </div>
                    {diff !== 0 && (
                        <p style={{ textAlign: "center", fontSize: 13, color: diff > 0 ? C.greenMid : C.redMid, fontWeight: 600, marginTop: 6 }}>
                            {diff > 0 ? "↑" : "↓"} R$ {Math.abs(diff).toFixed(2).replace(".", ",")} vs. preço atual
                        </p>
                    )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[
                        ["Nova Margem", `${margem}%`, mc],
                        ["Lucro/mês (30 un.)", `R$ ${Math.round(lucroMes).toLocaleString("pt-BR")}`, mn >= 20 ? C.greenMid : C.orange],
                    ].map(([l, v, c]) => (
                        <div key={l} style={{ background: C.paperWarm, borderRadius: 12, padding: "14px", textAlign: "center" }}>
                            <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{l}</p>
                            <p style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 800, color: c }}>{v}</p>
                        </div>
                    ))}
                </div>
                <div style={{ background: mn < 10 ? C.redPale : mn < 20 ? C.orangePale : C.greenPale, borderRadius: 10, padding: "11px 14px", marginBottom: 16, fontSize: 12, color: C.inkMid, lineHeight: 1.55 }}>
                    {mn < 10 ? "⚠️ Margem crítica. Com impostos e imprevistos, você pode ter prejuízo real." : mn < 20 ? "💛 Margem razoável, mas abaixo do ideal. Tente chegar a 25%." : "✅ Ótima margem! Esse preço cobre seus custos com segurança e gera lucro real."}
                </div>
                <button onClick={() => { onApply(produto.id, novo, mn); onClose(); }} style={{ width: "100%", background: C.green, color: C.paper, border: "none", borderRadius: 12, padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Aplicar R$ {novo.toFixed(2).replace(".", ",")} →
                </button>
            </div>
        </div>
    );
}
