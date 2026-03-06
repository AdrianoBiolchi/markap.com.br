// Dashboard.jsx — DESIGN ORIGINAL RESTAURADO
// Visual idêntico ao aprovado + AppShell (sem sidebar duplicada) + API real

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SEGMENT_BENCHMARKS } from "../data/segmentBenchmarks";
import AppShell from "../components/AppShell";
import { C } from "../tokens/colors";
import Markapometro from "../components/dashboard/Precificometro";
import SimuladorModal from "../components/dashboard/SimuladorModal";
import EditProductModal from "../components/dashboard/EditProductModal";

export default function Dashboard() {
    const navigate = useNavigate();

    // ── Estado real (sem mockups) ──────────────────────────────────────────
    const [produtos, setProdutos] = useState([]);
    const [businessProfile, setBusinessProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [simulador, setSimulador] = useState(null);
    const [alertaDismissed, setAlertaDismissed] = useState(false);
    const [editando, setEditando] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [salvando, setSalvando] = useState(false);

    // ── Carregar dados reais da API ────────────────────────────────────────
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const [prodRes, profileRes] = await Promise.all([
                    fetch("/api/products", { headers }),
                    fetch("/api/business-profile", { headers }),
                ]);

                let bpData = null;
                if (profileRes.ok) {
                    bpData = await profileRes.json();
                    setBusinessProfile(bpData);
                }

                // Meta de margem: fonte única de verdade
                const seg = bpData?.segment;
                const marginTarget = bpData?.customMarginGoal > 0
                    ? bpData.customMarginGoal
                    : (seg && SEGMENT_BENCHMARKS?.[seg]?.thresholds?.atencao) || 22;

                if (prodRes.ok) {
                    const data = await prodRes.json();
                    const raw = Array.isArray(data) ? data : (data.products || data.data || []);

                    const normalized = raw.map(p => {
                        // Recalcula margem em tempo real com os dados ATUAIS do perfil.
                        // Não confia no netMargin do DB (pode estar desatualizado se CF% mudou).
                        const custo = (p.productionCost || 0) + (p.laborCost || 0) + (p.packagingCost || 0) + (p.shippingCost || 0);
                        const varDedPct = (p.taxRate || 0) + (p.cardFee || 0) + (p.marketplaceFee || 0) + (p.commission || 0);
                        const cfPctLocal = bpData?.fixedCostPercentage || 0;
                        const price = p.suggestedPrice || 0;
                        const margem = price > 0
                            ? Math.round((((price - custo) / price * 100) - (varDedPct + cfPctLocal)) * 10) / 10
                            : 0;

                        // Status baseado em margem real vs meta real
                        const status = margem >= marginTarget ? "ok"
                            : margem >= marginTarget * 0.6 ? "atencao"
                                : "risco";

                        return {
                            ...p,
                            nome: p.name || p.nome || "Produto sem nome",
                            preco: p.suggestedPrice || p.preco || 0,
                            margem,
                            custo,
                            status,
                            taxRate: p.taxRate || 0,
                            cardFee: p.cardFee || 0,
                            commission: p.commission || 0,
                            marketplaceFee: p.marketplaceFee || 0,
                        };
                    });
                    setProdutos(normalized);
                }
            } catch (e) {
                console.error("Erro ao carregar dashboard:", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // ── Atualizar produto após simulação ───────────────────────────────────
    const handleApply = async (id, novoPreco, novaMargem) => {
        // Atualiza estado local imediatamente (otimista)
        setProdutos(prev => prev.map(p => {
            if (p.id !== id) return p;
            const margem = parseFloat(novaMargem.toFixed(1));
            const status = margem >= marginTarget ? "ok"
                : margem >= marginTarget * 0.6 ? "atencao"
                    : "risco";
            return { ...p, preco: novoPreco, margem, status };
        }));
        // Persiste no servidor
        try {
            const token = localStorage.getItem("token");
            await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ suggestedPrice: novoPreco }),
            });
        } catch (e) {
            console.error("Erro ao salvar preço:", e);
        }
    };

    // ── Edição inline de produto ───────────────────────────────────────────
    const openEdit = (p) => {
        const isSimple = businessProfile?.pricingMode === 'SIMPLE';
        setEditando(p);
        setEditForm({
            suggestedPrice: p.preco || 0,
            expectedVolume: p.expectedVolume || 20,
            productionCost: p.productionCost || 0,
            laborCost: p.laborCost || 0,
            packagingCost: p.packagingCost || 0,
            shippingCost: p.shippingCost || 0,
            // Se for Simples, usamos os valores do perfil, senão os do produto
            taxRate: isSimple ? (businessProfile.taxRate || 0) : (p.taxRate || 0),
            cardFee: isSimple ? (businessProfile.cardFee || 0) : (p.cardFee || 0),
            commission: isSimple ? (businessProfile.commission || 0) : (p.commission || 0),
            marketplaceFee: isSimple ? (businessProfile.marketplaceFee || 0) : (p.marketplaceFee || 0),
        });
    };

    const saveEdit = async () => {
        if (!editando) return;
        setSalvando(true);
        try {
            const token = localStorage.getItem("token");
            const isSimple = businessProfile?.pricingMode === 'SIMPLE';

            // Se for modo simples, não enviamos as taxas para a API de produtos
            // para garantir que o backend use as taxas globais do perfil.
            const payload = { ...editForm };
            if (isSimple) {
                delete payload.taxRate;
                delete payload.cardFee;
                delete payload.commission;
                delete payload.marketplaceFee;
            }

            const res = await fetch(`/api/products/${editando.id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const updated = await res.json();
                // Recalcula métricas com dados atuais do perfil
                const custo = (updated.productionCost || 0) + (updated.laborCost || 0) + (updated.packagingCost || 0) + (updated.shippingCost || 0);
                const varDedPct = (updated.taxRate || 0) + (updated.cardFee || 0) + (updated.marketplaceFee || 0) + (updated.commission || 0);
                const cfPctLocal = businessProfile?.fixedCostPercentage || 0;
                const price = updated.suggestedPrice || 0;
                const margem = price > 0
                    ? Math.round((((price - custo) / price * 100) - (varDedPct + cfPctLocal)) * 10) / 10
                    : 0;
                const status = margem >= marginTarget ? "ok"
                    : margem >= marginTarget * 0.6 ? "atencao"
                        : "risco";
                setProdutos(prev => prev.map(p => p.id !== editando.id ? p : {
                    ...p, ...updated,
                    nome: updated.name || p.nome,
                    preco: updated.suggestedPrice || p.preco,
                    custo, margem, status,
                }));
                setEditando(null);
            }
        } catch (e) {
            console.error("Erro ao salvar produto:", e);
        } finally {
            setSalvando(false);
        }
    };

    // ── Meta de margem: fonte única de verdade ─────────────────────────────
    const seg = businessProfile?.segment;
    const marginTarget = businessProfile?.customMarginGoal > 0
        ? businessProfile.customMarginGoal
        : (seg && SEGMENT_BENCHMARKS?.[seg]?.thresholds?.atencao) || 22;

    // ── Cálculos dinâmicos ─────────────────────────────────────────────────

    // Score: média de quanto cada produto atingiu da meta (0–100)
    const score = produtos.length === 0 ? 0 : Math.min(
        Math.round(
            produtos.reduce((acc, p) => {
                const pct = p.margem >= marginTarget
                    ? 100
                    : Math.max(0, (p.margem / marginTarget) * 100);
                return acc + pct;
            }, 0) / produtos.length
        ),
        100
    );

    const metaLucro = businessProfile?.monthlyProfitGoal
        || businessProfile?.monthlyRevenueGoal
        || 3000;

    // Lucro real por peça: deduz custo fixo + todas as taxas variáveis
    const lucroPeca = (p) => {
        const cfRate = (businessProfile?.fixedCostPercentage || 0) / 100;
        const dedRate = cfRate
            + (p.taxRate || 0) / 100
            + (p.cardFee || 0) / 100
            + (p.commission || 0) / 100
            + (p.marketplaceFee || 0) / 100;
        return p.preco - p.custo - (p.preco * dedRate);
    };

    // Lucro estimado mensal: usa expectedVolume de cada produto (fallback: 20 un)
    const lucroAtual = Math.max(0,
        produtos.reduce((acc, p) => acc + lucroPeca(p) * (p.expectedVolume || 20), 0)
    );

    const metaPct = Math.min(Math.round((lucroAtual / metaLucro) * 100), 100);

    // Dinheiro perdido: (preço ideal - preço atual) × volume/mês
    // Preço ideal = custo / (1 - CF% - taxas% - meta%)
    const perdido = produtos
        .filter(p => p.status !== "ok")
        .reduce((acc, p) => {
            const cfRate = (businessProfile?.fixedCostPercentage || 0) / 100;
            const dedRate = cfRate
                + (p.taxRate || 0) / 100
                + (p.cardFee || 0) / 100
                + (p.commission || 0) / 100
                + (p.marketplaceFee || 0) / 100;
            const totalDed = dedRate + marginTarget / 100;
            if (totalDed >= 1 || p.custo <= 0) return acc;
            const precoIdeal = p.custo / (1 - totalDed);
            const diff = precoIdeal - p.preco;
            return acc + (diff > 0 ? diff * (p.expectedVolume || 20) : 0);
        }, 0);

    // ── Conteúdo extra da barra amarela ───────────────────────────────────
    const topBarContent = !alertaDismissed && produtos.some(p => p.status !== "ok") && (
        <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(14,24,16,0.09)", borderRadius: 99, padding: "3px 10px",
        }}>
            <div className="mk-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: C.redMid }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: C.inkMid }}>
                {produtos.filter(p => p.status !== "ok").length} produto(s) com margem abaixo do ideal
            </span>
            <button
                onClick={() => setAlertaDismissed(true)}
                style={{ background: C.ink, color: C.yellow, borderRadius: 5, padding: "1px 7px", fontSize: 9, fontWeight: 700, border: "none", cursor: "pointer" }}
            >
                Ver →
            </button>
        </div>
    );

    // ── Loading ────────────────────────────────────────────────────────────
    if (loading) return (
        <AppShell>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 16 }}>
                <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.green, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: C.inkLight }}>Carregando dashboard...</p>
            </div>
        </AppShell>
    );

    // ── Estado vazio ───────────────────────────────────────────────────────
    if (!loading && produtos.length === 0) return (
        <AppShell topBarContent={topBarContent}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 20, textAlign: "center" }}>
                <div style={{ width: 72, height: 72, background: C.greenLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🏷️</div>
                <div>
                    <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 26, color: C.ink, marginBottom: 8, letterSpacing: "-0.02em" }}>
                        Nenhum produto ainda
                    </h2>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: C.inkLight, maxWidth: 380, lineHeight: 1.65 }}>
                        Cadastre seu primeiro produto na calculadora e veja a saúde dos seus preços em tempo real.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/calculator")}
                    style={{ background: C.green, color: C.white, border: "none", borderRadius: 12, padding: "14px 28px", fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 15, cursor: "pointer" }}
                >
                    Calcular meu primeiro produto →
                </button>
                {!businessProfile?.fixedCostPercentage && (
                    <button
                        onClick={() => navigate("/business-profile")}
                        style={{ background: "transparent", color: C.inkLight, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 20px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    >
                        Antes, configure seus custos fixos →
                    </button>
                )}
            </div>
        </AppShell>
    );

    // ── Quick Wins: produtos com maior potencial de lucro perdido ─────────
    const quickWins = produtos
        .filter(p => p.status !== "ok")
        .map(p => {
            const cfRate = (businessProfile?.fixedCostPercentage || 0) / 100;
            const dedRate = cfRate
                + (p.taxRate || 0) / 100
                + (p.cardFee || 0) / 100
                + (p.commission || 0) / 100
                + (p.marketplaceFee || 0) / 100;
            const totalDed = dedRate + marginTarget / 100;
            if (totalDed >= 1 || p.custo <= 0) return null;
            const precoIdeal = p.custo / (1 - totalDed);
            const gain = Math.max(0, (precoIdeal - p.preco) * (p.expectedVolume || 20));
            return { ...p, precoIdeal, gain };
        })
        .filter(Boolean)
        .sort((a, b) => b.gain - a.gain)
        .slice(0, 3);

    // ── Dashboard completo — REDESIGN ──────────────────────────────────────
    return (
        <AppShell topBarContent={topBarContent}>
            <style>{`
        @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
        .mk-a1{animation:up .5s cubic-bezier(.22,1,.36,1) .05s both}
        .mk-a2{animation:up .5s cubic-bezier(.22,1,.36,1) .14s both}
        .mk-a3{animation:up .5s cubic-bezier(.22,1,.36,1) .23s both}
        .mk-a4{animation:up .5s cubic-bezier(.22,1,.36,1) .32s both}
        .mk-nb{transition:all .15s;cursor:pointer;border:none;background:transparent;font-family:inherit;}
        .mk-nb:hover{background:${C.paperWarm}!important;color:${C.ink}!important;}
        .mk-pc{transition:box-shadow .15s,background .15s;}
        .mk-pc:hover{background:${C.paperWarm}!important;box-shadow:0 2px 12px rgba(14,24,16,.07)!important;}
        .mk-sim:hover{background:${C.green}!important;color:${C.white}!important;}
        .mk-blink{animation:blink 1.8s ease infinite;}
        .mk-btn{cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;border:none;}
        .mk-kpi:hover{border-color:${C.green}!important;box-shadow:0 0 0 3px rgba(26,92,58,.07)!important;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(14,24,16,.12);border-radius:4px;}
      `}</style>

            {simulador && (
                <SimuladorModal produto={simulador} businessProfile={businessProfile} onClose={() => setSimulador(null)} onApply={handleApply} />
            )}

            {editando && (
                <EditProductModal
                    produto={editando}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    businessProfile={businessProfile}
                    marginTarget={marginTarget}
                    onSave={saveEdit}
                    onClose={() => setEditando(null)}
                    salvando={salvando}
                />
            )}

            {/* HEADER EDITORIAL */}
            <div className="mk-a1" style={{ borderBottom: `3px solid ${C.ink}`, paddingBottom: 18, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
                        EDIÇÃO DIÁRIA · PRECIFICAÇÃO INTELIGENTE
                    </p>
                    <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.05, color: C.ink }}>
                        {produtos.filter(p => p.status !== "ok").length > 0 ? (
                            <>Você está{" "}
                                <span style={{ position: "relative", display: "inline-block" }}>
                                    <span style={{ position: "absolute", bottom: 2, left: -2, right: -2, height: "36%", background: C.yellow, zIndex: 0, borderRadius: 2 }} />
                                    <span style={{ position: "relative", zIndex: 1 }}>deixando escapar</span>
                                </span>{" "}dinheiro.</>
                        ) : (
                            <>Seus preços estão{" "}
                                <span style={{ position: "relative", display: "inline-block" }}>
                                    <span style={{ position: "absolute", bottom: 2, left: -2, right: -2, height: "36%", background: C.yellow, zIndex: 0, borderRadius: 2 }} />
                                    <span style={{ position: "relative", zIndex: 1 }}>no caminho certo.</span>
                                </span></>
                        )}
                    </h1>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button className="mk-btn" onClick={() => navigate("/business-profile")} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", fontSize: 12, fontWeight: 500, color: C.inkLight }}>
                        Meu perfil
                    </button>
                    <button className="mk-btn" onClick={() => navigate("/calculator")} style={{ background: C.green, borderRadius: 9, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: C.paper }}>
                        + Novo produto
                    </button>
                </div>
            </div>

            {/* KPI ROW — 4 métricas principais */}
            <div className="mk-a2" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
                {/* Score */}
                <div className="mk-kpi" style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "16px 18px", transition: "border-color .15s, box-shadow .15s" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Score Markap</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 800, color: score >= 70 ? C.greenMid : score >= 40 ? C.orange : C.redMid, letterSpacing: "-0.02em", lineHeight: 1 }}>
                            {score}
                        </span>
                        <span style={{ fontSize: 14, color: C.inkMuted, fontWeight: 600 }}>/100</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 99, background: C.paperDeep, overflow: "hidden" }}>
                        <div style={{ width: `${score}%`, height: "100%", background: score >= 70 ? C.greenFresh : score >= 40 ? C.orange : C.redMid, borderRadius: 99, transition: "width 1s ease" }} />
                    </div>
                </div>

                {/* Lucro estimado */}
                <div className="mk-kpi" style={{ background: C.green, border: `1.5px solid transparent`, borderRadius: 16, padding: "16px 18px", position: "relative", overflow: "hidden", transition: "border-color .15s, box-shadow .15s" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(255,255,255,.07)" }} />
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,245,66,.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Lucro est./mês</p>
                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 800, color: C.yellow, letterSpacing: "-0.02em", lineHeight: 1, display: "block", marginBottom: 8 }}>
                        R$ {Math.round(lucroAtual).toLocaleString("pt-BR")}
                    </span>
                    <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,.15)", overflow: "hidden" }}>
                        <div style={{ width: `${metaPct}%`, height: "100%", background: `linear-gradient(to right,${C.greenFresh},${C.yellow})`, borderRadius: 99, transition: "width 1.2s ease" }} />
                    </div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,.5)", marginTop: 5 }}>{metaPct}% da meta · R$ {metaLucro.toLocaleString("pt-BR")}</p>
                </div>

                {/* Produtos em risco */}
                <div className="mk-kpi" style={{ background: C.white, border: `1.5px solid ${produtos.filter(p => p.status === "risco").length > 0 ? "rgba(214,40,40,0.2)" : C.border}`, borderRadius: 16, padding: "16px 18px", transition: "border-color .15s, box-shadow .15s" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Em risco</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 800, color: produtos.filter(p => p.status === "risco").length > 0 ? C.redMid : C.greenMid, letterSpacing: "-0.02em", lineHeight: 1 }}>
                            {produtos.filter(p => p.status !== "ok").length}
                        </span>
                        <span style={{ fontSize: 13, color: C.inkMuted }}>/{produtos.length} prod.</span>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                        {[
                            { v: produtos.filter(p => p.status === "ok").length, c: C.greenFresh },
                            { v: produtos.filter(p => p.status === "atencao").length, c: C.orange },
                            { v: produtos.filter(p => p.status === "risco").length, c: C.redMid },
                        ].map((s, i) => (
                            s.v > 0 && <div key={i} style={{ flex: s.v, height: 4, borderRadius: 99, background: s.c }} />
                        ))}
                    </div>
                </div>

                {/* Dinheiro perdido */}
                <div className="mk-kpi" style={{ background: perdido > 0 ? C.redPale : C.white, border: `1.5px solid ${perdido > 0 ? "rgba(214,40,40,0.2)" : C.border}`, borderRadius: 16, padding: "16px 18px", transition: "border-color .15s, box-shadow .15s" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: perdido > 0 ? C.redMid : C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                        {perdido > 0 ? "Deixado na mesa" : "Potencial perdido"}
                    </p>
                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: perdido > 0 ? 26 : 32, fontWeight: 800, color: perdido > 0 ? C.redMid : C.greenMid, letterSpacing: "-0.02em", lineHeight: 1, display: "block", marginBottom: 8 }}>
                        {perdido > 0 ? `R$ ${Math.round(perdido).toLocaleString("pt-BR")}` : "Ótimo!"}
                    </span>
                    {perdido > 0 ? (
                        <button
                            className="mk-btn"
                            onClick={() => setSimulador(produtos.find(p => p.status === "risco") || produtos.find(p => p.status === "atencao"))}
                            style={{ background: C.redMid, color: C.white, borderRadius: 7, padding: "5px 10px", fontSize: 10, fontWeight: 700 }}
                        >
                            Corrigir agora →
                        </button>
                    ) : (
                        <p style={{ fontSize: 10, color: C.greenMid, fontWeight: 600 }}>Todos os produtos no alvo</p>
                    )}
                </div>
            </div>

            {/* GRID PRINCIPAL: 2 colunas */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" }}>

                {/* COL ESQUERDA — Produtos + Break-even */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Lista de produtos — redesenhada com waterfall inline */}
                    <div className="mk-a3" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "22px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                            <div>
                                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>Meus Produtos</h2>
                                <p style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>
                                    Meta de margem: <strong style={{ color: C.ink }}>{marginTarget}%</strong>
                                    {businessProfile?.segment && (
                                        <span style={{ marginLeft: 6, color: C.inkMuted }}>
                                            · {SEGMENT_BENCHMARKS?.[businessProfile.segment]?.icon || "🏪"} {SEGMENT_BENCHMARKS?.[businessProfile.segment]?.label || businessProfile.segment}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <button
                                className="mk-btn"
                                onClick={() => navigate("/calculator")}
                                style={{ background: C.green, color: C.white, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, flexShrink: 0 }}
                            >
                                + Novo produto
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {produtos.map(p => {
                                const bc = p.status === "ok" ? C.greenFresh : p.status === "risco" ? C.redMid : C.orange;
                                const pillStyle = {
                                    ok: { l: "Saudável", bg: C.greenPale, c: C.greenMid },
                                    atencao: { l: "Atenção", bg: C.orangePale, c: C.orange },
                                    risco: { l: "Risco", bg: C.redPale, c: C.redMid },
                                };
                                const pill = pillStyle[p.status];

                                // Waterfall: fatias como % do preço de venda
                                const custoPct = p.preco > 0 ? (p.custo / p.preco) * 100 : 0;
                                const taxasPct = (p.taxRate || 0) + (p.cardFee || 0) + (p.commission || 0) + (p.marketplaceFee || 0);
                                const cfPct = businessProfile?.fixedCostPercentage || 0;
                                const margemPct = Math.max(0, 100 - custoPct - taxasPct - cfPct);
                                const metaPct100 = Math.min((p.margem / marginTarget) * 100, 100);

                                return (
                                    <div key={p.id} className="mk-pc" style={{ background: C.paper, border: `1px solid ${C.border}`, borderLeft: `3px solid ${bc}`, borderRadius: "0 14px 14px 0", padding: "14px 16px", transition: "background .15s, box-shadow .15s" }}>
                                        {/* Linha 1: nome + badge + preço + botões */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nome}</span>
                                                <span style={{ background: pill.bg, color: pill.c, fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", borderRadius: 99, padding: "3px 8px", flexShrink: 0 }}>
                                                    {pill.l}
                                                </span>
                                            </div>
                                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                <p style={{ fontSize: 9, color: C.inkMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Preço</p>
                                                <p style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 800, color: C.ink, lineHeight: 1.2 }}>
                                                    R$ {p.preco.toFixed(2).replace(".", ",")}
                                                </p>
                                            </div>
                                            <button
                                                className="mk-btn"
                                                onClick={() => openEdit(p)}
                                                style={{ background: C.paperDeep, borderRadius: 9, padding: "8px 12px", fontSize: 11, fontWeight: 600, color: C.inkMid, whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0 }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="mk-btn mk-sim"
                                                onClick={() => setSimulador(p)}
                                                style={{ background: C.green, borderRadius: 9, padding: "8px 12px", fontSize: 11, fontWeight: 600, color: C.white, whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0 }}
                                            >
                                                Simular
                                            </button>
                                        </div>

                                        {/* Linha 2: waterfall visual */}
                                        <div>
                                            {/* Barra segmentada */}
                                            <div style={{ display: "flex", height: 6, borderRadius: 99, overflow: "hidden", gap: 1, marginBottom: 7 }}>
                                                <div style={{ width: `${Math.min(custoPct, 100)}%`, background: C.inkMuted, borderRadius: "99px 0 0 99px", minWidth: custoPct > 1 ? 2 : 0 }} title={`Custo: ${custoPct.toFixed(0)}%`} />
                                                <div style={{ width: `${Math.min(taxasPct, 100 - custoPct)}%`, background: C.orange, minWidth: taxasPct > 1 ? 2 : 0 }} title={`Taxas: ${taxasPct.toFixed(0)}%`} />
                                                <div style={{ width: `${Math.min(cfPct, 100 - custoPct - taxasPct)}%`, background: "#94A3B8", minWidth: cfPct > 1 ? 2 : 0 }} title={`CF: ${cfPct.toFixed(0)}%`} />
                                                <div style={{ flex: 1, background: bc, minWidth: 2, borderRadius: "0 99px 99px 0" }} title={`Margem: ${p.margem.toFixed(1)}%`} />
                                            </div>
                                            {/* Legenda + margem vs meta */}
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <div style={{ display: "flex", gap: 10 }}>
                                                    {[
                                                        { l: "Custo", pct: custoPct, c: C.inkMuted },
                                                        { l: "Taxas", pct: taxasPct, c: C.orange },
                                                        { l: "CF%", pct: cfPct, c: "#94A3B8" },
                                                        { l: "Margem", pct: margemPct, c: bc },
                                                    ].filter(f => f.pct > 0.5).map(f => (
                                                        <span key={f.l} style={{ fontSize: 9, color: C.inkMuted, display: "flex", alignItems: "center", gap: 3 }}>
                                                            <span style={{ width: 6, height: 6, borderRadius: 2, background: f.c, display: "inline-block" }} />
                                                            {f.l} {f.pct.toFixed(0)}%
                                                        </span>
                                                    ))}
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    {/* Barra de progresso até a meta */}
                                                    <div style={{ width: 60, height: 4, borderRadius: 99, background: C.paperDeep, overflow: "hidden" }}>
                                                        <div style={{ width: `${metaPct100}%`, height: "100%", background: bc, borderRadius: 99, transition: "width .6s ease" }} />
                                                    </div>
                                                    <span style={{ fontSize: 10, fontWeight: 700, color: bc, minWidth: 32, textAlign: "right" }}>
                                                        {p.margem.toFixed(1)}%
                                                    </span>
                                                    {p.status === "ok"
                                                        ? <span style={{ fontSize: 10, color: C.greenMid, fontWeight: 700 }}>✓ meta</span>
                                                        : <span style={{ fontSize: 10, color: C.inkMuted }}>meta {marginTarget}%</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {/* Linha 3: métricas absolutas */}
                                        {(() => {
                                            const lucro = lucroPeca(p);
                                            const lucroMes = lucro * (p.expectedVolume || 20);
                                            const fmtR = (v) => `R$ ${Math.abs(v).toFixed(2).replace(".", ",")}`;
                                            return (
                                                <div style={{ display: "flex", gap: 0, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.paperDeep}` }}>
                                                    {[
                                                        { label: "Custo direto", value: fmtR(p.custo), color: C.inkMid },
                                                        { label: "Lucro/peça", value: (lucro < 0 ? "− " : "") + fmtR(lucro), color: lucro >= 0 ? C.greenMid : C.redMid },
                                                        { label: `Volume/mês`, value: `${p.expectedVolume || 20} un.`, color: C.inkMid },
                                                        { label: "Lucro/mês", value: (lucroMes < 0 ? "− " : "") + `R$ ${Math.abs(Math.round(lucroMes)).toLocaleString("pt-BR")}`, color: lucroMes >= 0 ? C.greenMid : C.redMid },
                                                        ...(p.breakEven > 0 ? [{ label: "Break-even", value: `${p.breakEven} un.`, color: p.expectedVolume >= p.breakEven ? C.greenMid : C.orange }] : []),
                                                        ...(p.competitorPrice > 0 ? [{ label: "Concorrente", value: fmtR(p.competitorPrice), color: p.preco <= p.competitorPrice ? C.greenMid : C.orange }] : []),
                                                    ].map((m, i) => (
                                                        <div key={m.label} style={{ flex: 1, textAlign: "center", borderLeft: i > 0 ? `1px solid ${C.paperDeep}` : "none", paddingLeft: i > 0 ? 8 : 0, paddingRight: 8 }}>
                                                            <p style={{ fontSize: 9, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2, whiteSpace: "nowrap" }}>{m.label}</p>
                                                            <p style={{ fontSize: 11, fontWeight: 700, color: m.color, whiteSpace: "nowrap" }}>{m.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Ponto de equilíbrio + Distribuição */}
                    <div className="mk-a4" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div>
                            <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Ponto de Equilíbrio</p>
                            {(() => {
                                const cfPct = (businessProfile?.fixedCostPercentage || 0) / 100;
                                const estRevenue = produtos.reduce((a, p) => a + p.preco * (p.expectedVolume || 20), 0);
                                const estFixedCosts = estRevenue * cfPct;
                                const avgContrib = produtos.length > 0
                                    ? produtos.reduce((a, p) => {
                                        const varRate = ((p.taxRate || 0) + (p.cardFee || 0) + (p.commission || 0) + (p.marketplaceFee || 0)) / 100;
                                        return a + Math.max(0, p.preco - p.custo - (p.preco * varRate));
                                    }, 0) / produtos.length
                                    : 0;
                                const beUnits = avgContrib > 0 ? Math.ceil(estFixedCosts / avgContrib) : 0;
                                const totalUnits = produtos.reduce((a, p) => a + (p.expectedVolume || 20), 0);
                                const dotPct = beUnits > 0
                                    ? Math.max(5, Math.min(92, Math.round((totalUnits / (beUnits * 2)) * 100)))
                                    : 62;
                                const superou = beUnits > 0 && totalUnits >= beUnits;
                                return (
                                    <>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 10 }}>
                                            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 800, color: superou ? C.greenMid : C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>
                                                {beUnits > 0 ? beUnits : "—"}
                                            </span>
                                            {beUnits > 0 && <span style={{ fontSize: 11, color: C.inkMuted }}>und./mês</span>}
                                        </div>
                                        {beUnits === 0 && (
                                            <p style={{ fontSize: 10, color: C.inkMuted, marginBottom: 8, lineHeight: 1.5 }}>
                                                Configure os custos fixos no <strong style={{ color: C.ink }}>Perfil</strong> para calcular.
                                            </p>
                                        )}
                                        <div style={{ height: 6, borderRadius: 99, marginBottom: 4, position: "relative", background: `linear-gradient(to right,${C.redMid},${C.orange} 44%,${C.greenFresh})` }}>
                                            <div style={{ position: "absolute", top: "50%", left: `${dotPct}%`, transform: "translate(-50%,-50%)", width: 13, height: 13, borderRadius: "50%", background: superou ? C.greenMid : C.green, border: "2.5px solid #fff", boxShadow: "0 2px 5px rgba(0,0,0,.2)", transition: "left .8s ease" }} />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                            <span style={{ fontSize: 9, color: C.inkMuted }}>Prejuízo</span>
                                            <span style={{ fontSize: 9, color: C.inkMuted }}>Lucro</span>
                                        </div>
                                        {beUnits > 0 && (
                                            <p style={{ fontSize: 10, color: superou ? C.greenMid : C.orange, fontWeight: 600 }}>
                                                {superou
                                                    ? `✓ Acima do equilíbrio (${totalUnits} und. estimadas)`
                                                    : `Faltam ${beUnits - totalUnits} und. para cobrir fixos`
                                                }
                                            </p>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                        <div>
                            <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Distribuição</p>
                            <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", gap: 1.5, marginBottom: 12 }}>
                                {[
                                    { p: (produtos.filter(p => p.status === "ok").length / Math.max(produtos.length, 1)) * 100, c: C.greenFresh },
                                    { p: (produtos.filter(p => p.status === "atencao").length / Math.max(produtos.length, 1)) * 100, c: C.orange },
                                    { p: (produtos.filter(p => p.status === "risco").length / Math.max(produtos.length, 1)) * 100, c: C.redMid },
                                ].map((s, i) => (
                                    <div key={i} style={{ width: `${s.p}%`, height: "100%", background: s.c, borderRadius: 4, transition: "width .6s ease" }} />
                                ))}
                            </div>
                            {[
                                { l: "Saudáveis", v: produtos.filter(p => p.status === "ok").length, c: C.greenFresh },
                                { l: "Atenção", v: produtos.filter(p => p.status === "atencao").length, c: C.orange },
                                { l: "Risco", v: produtos.filter(p => p.status === "risco").length, c: C.redMid },
                            ].map(item => (
                                <div key={item.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: 2, background: item.c }} />
                                        <span style={{ fontSize: 11, color: C.inkLight }}>{item.l}</span>
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{item.v} produto{item.v !== 1 ? "s" : ""}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COL DIREITA — Markapômetro + Meta + Quick Wins + Diagnóstico */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Markapômetro */}
                    <div className="mk-a2" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "18px 14px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start", marginBottom: 2 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.yellow, border: `1.5px solid ${C.yellowDeep}` }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Markapômetro™</span>
                        </div>
                        <Markapometro score={Number(score)} size="small" />
                        <div style={{ display: "flex", gap: 10, marginTop: -2, marginBottom: 10 }}>
                            {[{ c: C.redMid, l: "Risco" }, { c: C.orange, l: "Atenção" }, { c: C.greenFresh, l: "Saudável" }].map(i => (
                                <div key={i.l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: i.c }} />
                                    <span style={{ fontSize: 9, color: C.inkMuted }}>{i.l}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ width: "100%", background: C.paperWarm, borderRadius: 10, padding: "9px 12px", borderLeft: `3px solid ${score >= 70 ? C.greenFresh : C.orange}` }}>
                            <p style={{ fontSize: 11, color: C.inkLight, lineHeight: 1.5 }}>
                                {score >= 70
                                    ? <><strong style={{ color: C.ink }}>Boa saúde!</strong> Continue monitorando.</>
                                    : <><strong style={{ color: C.ink }}>Zona amarela.</strong> Ajuste {produtos.filter(p => p.status !== "ok").length} produto(s).</>
                                }
                            </p>
                        </div>
                    </div>

                    {/* Meta do Mês */}
                    <div className="mk-a3" style={{ background: C.green, borderRadius: 20, padding: "18px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(232,245,66,.08)" }} />
                        <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,245,66,.55)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Meta do Mês</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                            <div>
                                <p style={{ fontSize: 9, color: "rgba(255,255,255,.38)", marginBottom: 1 }}>Lucro estimado</p>
                                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 800, color: C.yellow, letterSpacing: "-0.02em" }}>
                                    R$ {Math.round(lucroAtual).toLocaleString("pt-BR")}
                                </span>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ fontSize: 9, color: "rgba(255,255,255,.38)", marginBottom: 1 }}>Meta</p>
                                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.45)" }}>
                                    R$ {metaLucro.toLocaleString("pt-BR")}
                                </span>
                            </div>
                        </div>
                        <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,.1)", overflow: "hidden", marginBottom: 6 }}>
                            <div style={{ width: `${metaPct}%`, height: "100%", background: `linear-gradient(to right,${C.greenFresh},${C.yellow})`, borderRadius: 99, transition: "width 1.2s ease" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.yellow }}>{metaPct}% da meta</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>
                                faltam R$ {Math.max(0, metaLucro - Math.round(lucroAtual)).toLocaleString("pt-BR")}
                            </span>
                        </div>
                    </div>

                    {/* Quick Wins */}
                    {quickWins.length > 0 && (
                        <div className="mk-a3" style={{ background: C.white, border: `1.5px solid ${C.yellow}`, borderRadius: 20, padding: "18px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 9, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.ink, flexShrink: 0 }}>⚡</div>
                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>Quick Wins</p>
                                    <p style={{ fontSize: 10, color: C.inkMuted }}>Corrija e recupere lucro agora</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {quickWins.map(p => (
                                    <div key={p.id} style={{ background: C.paperWarm, borderRadius: 12, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{p.nome}</p>
                                            <p style={{ fontSize: 10, color: C.greenMid, fontWeight: 700 }}>
                                                +R$ {Math.round(p.gain).toLocaleString("pt-BR")}/mês
                                            </p>
                                        </div>
                                        <button
                                            className="mk-btn"
                                            onClick={() => setSimulador(p)}
                                            style={{ background: C.green, color: C.white, borderRadius: 8, padding: "6px 10px", fontSize: 10, fontWeight: 700, flexShrink: 0 }}
                                        >
                                            Simular →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Diagnóstico */}
                    <div className="mk-a4" style={{ background: C.ink, borderRadius: 20, padding: "18px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(82,183,136,.05)" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 24, height: 24, background: C.yellow, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.ink }}>✦</div>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: C.white }}>Diagnóstico</p>
                                <p style={{ fontSize: 9, color: "rgba(255,255,255,.32)" }}>baseado nos seus produtos</p>
                            </div>
                        </div>
                        {produtos.filter(p => p.status === "risco").length > 0 && (
                            <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, padding: "9px 12px", marginBottom: 6, display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <span style={{ fontSize: 12, flexShrink: 0 }}>⚠️</span>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
                                    {produtos.filter(p => p.status === "risco").length} em risco.{" "}
                                    <strong style={{ color: C.yellow }}>Corrija antes de escalar.</strong>
                                </p>
                            </div>
                        )}
                        {produtos.filter(p => p.status === "ok").length > 0 && (
                            <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, padding: "9px 12px", marginBottom: 6, display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <span style={{ fontSize: 12, flexShrink: 0 }}>💡</span>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
                                    {produtos.filter(p => p.status === "ok").length} produto(s) saudável(is).{" "}
                                    <strong style={{ color: C.yellow }}>Monitore os custos.</strong>
                                </p>
                            </div>
                        )}
                        {!businessProfile?.fixedCostPercentage && (
                            <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, padding: "9px 12px", marginBottom: 6, display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <span style={{ fontSize: 12, flexShrink: 0 }}>↑</span>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
                                    Custos fixos não configurados.{" "}
                                    <strong style={{ color: C.yellow }}>Preços podem estar errados.</strong>
                                </p>
                            </div>
                        )}
                        <button className="mk-btn" onClick={() => navigate("/upgrade")} style={{ marginTop: 8, width: "100%", background: C.yellow, color: C.ink, borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: 700 }}>
                            Análise completa PRO →
                        </button>
                    </div>

                    {/* Metodologia Sebrae */}
                    <div style={{ background: C.yellowWarm, border: `1px solid rgba(196,207,0,.25)`, borderRadius: 14, padding: "12px 14px" }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "#7A8C00", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>✦ Metodologia Sebrae</p>
                        <p style={{ fontSize: 11, color: C.inkLight, lineHeight: 1.55 }}>
                            Cálculos validados pelo Sebrae, usados por <strong style={{ color: C.inkMid }}>+2.400 empresários</strong> no Brasil.
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}