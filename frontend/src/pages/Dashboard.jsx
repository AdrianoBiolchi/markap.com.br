// Dashboard.jsx — DESIGN ORIGINAL RESTAURADO
// Visual idêntico ao aprovado + AppShell (sem sidebar duplicada) + API real

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import AppShell from "../components/AppShell";
import { C } from "../tokens/colors";
import Markapometro from "../components/dashboard/Precificometro";
import SimuladorModal from "../components/dashboard/SimuladorModal";
import { getProductStatus, getHealthScore, SEGMENT_BENCHMARKS } from '../data/segmentBenchmarks';

export default function Dashboard() {
    const navigate = useNavigate();

    // ── Estado real (sem mockups) ──────────────────────────────────────────
    const [produtos, setProdutos] = useState([]);
    const [businessProfile, setBusinessProfile] = useState(null);
    const [margemTrend, setMargemTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [simulador, setSimulador] = useState(null);
    const [proBenchmark, setProBenchmark] = useState(false);
    const [alertaDismissed, setAlertaDismissed] = useState(false);
    const [editingId, setEditingId] = useState(null)
    const [editValues, setEditValues] = useState({})
    const [savingId, setSavingId] = useState(null)

    // ── Helpers de Formatação ──────────────────────────────────────────────
    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
    const parseCurrency = (s) => parseFloat(String(s).replace(/[^\d,]/g, '').replace(',', '.')) || 0;

    // ── Carregar dados reais da API ────────────────────────────────────────
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");

                const [prodRes, profRes] = await Promise.all([
                    fetch("/api/products", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("/api/business-profile", { headers: { Authorization: `Bearer ${token}` } })
                ]);

                let profile = null;
                if (profRes.ok) {
                    profile = await profRes.json();
                    setBusinessProfile(profile);
                }

                if (prodRes.ok) {
                    const data = await prodRes.json();
                    const raw = data.products || data || [];

                    const normalized = raw.map(p => {
                        const segment = profile?.segment || "outro"
                        const customMargin = profile?.customMarketMargin || 0
                        const margem = p.netMargin > 1 ? p.netMargin : (p.netMargin || 0) * 100
                        const status = getProductStatus(margem, segment, customMargin)
                        const hs = getHealthScore(margem, segment, customMargin)

                        return {
                            ...p,
                            nome: p.name || p.nome || 'Produto sem nome',
                            preco: p.suggestedPrice || p.preco || 0,
                            margem: Math.round(margem * 10) / 10,
                            custo: (p.productionCost || 0) + (p.laborCost || 0) + (p.packagingCost || 0) + (p.shippingCost || 0),
                            status,
                            healthScore: hs,
                        }
                    });
                    setProdutos(normalized);
                }
            } catch (e) {
                console.error("ERRO:", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // ── Salvar preço editado ───────────────────────────────────────────────
    const handleSavePrice = async (produto) => {
        setSavingId(produto.id)
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`/api/products/${produto.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...produto,
                    suggestedPrice: parseFloat(editValues.preco) || produto.preco,
                    desiredMargin: parseFloat(editValues.margem) || produto.desiredMargin,
                }),
            })
            if (res.ok) {
                const updated = await res.json()
                const segment = businessProfile?.segment || "outro"
                const customMargin = businessProfile?.customMarketMargin || 0
                const updatedNetMargin = updated.netMargin || (parseFloat(editValues.margem) / 100) || p.margem
                const newStatus = getProductStatus(updatedNetMargin * 100, segment, customMargin)
                const newHS = getHealthScore(updatedNetMargin * 100, segment, customMargin)

                setProdutos(prev => prev.map(p => p.id === produto.id ? {
                    ...p,
                    preco: updated.suggestedPrice || parseFloat(editValues.preco) || p.preco,
                    margem: Math.round(updatedNetMargin * 1000) / 10,
                    status: newStatus,
                    healthScore: newHS,
                } : p))
                setEditingId(null)
                setEditValues({})
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSavingId(null)
        }
    }

    // ── Atualizar produto após simulação ───────────────────────────────────
    const handleApply = (id, novoPreco, novaMargem) => {
        setProdutos(prev => prev.map(p => {
            if (p.id !== id) return p;
            const segment = businessProfile?.segment || "outro"
            const customMargin = businessProfile?.customMarketMargin || 0
            const s = getProductStatus(novaMargem, segment, customMargin);
            const hs = getHealthScore(novaMargem, segment, customMargin);
            return { ...p, preco: novoPreco, margem: parseFloat(novaMargem.toFixed(1)), status: s, healthScore: hs };
        }));
    };

    // ── Cálculos dinâmicos ─────────────────────────────────────────────────
    const score = produtos.length > 0
        ? Math.min(Math.round(
            (produtos.filter(p => p.status === 'ok').length / produtos.length) * 70 +
            (produtos.reduce((a, p) => a + Math.min(p.margem, 40), 0) / produtos.length / 40) * 30
        ), 100)
        : 0;

    const metaLucro = businessProfile?.monthlyRevenueGoal || 3000;

    const lucroAtual = produtos.reduce((a, p) => {
        const margemValor = p.preco * (Math.max(p.margem, 0) / 100)
        const volume = p.expectedVolume || p.monthlySales || 20
        const fator = p.status === "ok" ? 1 : p.status === "atencao" ? 0.7 : 0.3
        return a + margemValor * volume * fator
    }, 0);

    const metaPct = Math.min(Math.round((lucroAtual / metaLucro) * 100), 100);

    const perdido = produtos
        .filter(p => p.status !== 'ok')
        .reduce((a, p) => {
            const segment = businessProfile?.segment || "outro"
            const customMargin = businessProfile?.customMarketMargin || 0
            const target = customMargin > 0 ? customMargin : (SEGMENT_BENCHMARKS[segment]?.marketAvg || 25)
            const margemIdeal = p.preco * (target / 100)
            const margemAtual = p.preco * (p.margem / 100)
            const diff = margemIdeal - margemAtual
            return a + (diff > 0 ? diff * (p.expectedVolume || 20) : 0)
        }, 0);

    // Calcular breakEven do produto com maior risco
    const produtoDestaque = produtos.find(p => p.status === 'risco')
        || produtos.find(p => p.status === 'atencao')
        || produtos[0]

    const breakEvenDisplay = produtoDestaque?.breakEven
        || (produtoDestaque ? Math.ceil(
            ((produtoDestaque.custo || produtoDestaque.preco * 0.6) * 10) /
            Math.max(produtoDestaque.preco * (produtoDestaque.margem / 100), 1)
        ) : null)

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

    // ── Dashboard completo — DESIGN ORIGINAL ──────────────────────────────
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
        .mk-pc:hover{background:${C.paperWarm}!important;}
        .mk-sim:hover{background:${C.greenMid}!important;color:${C.paper}!important;}
        .mk-blink{animation:blink 1.8s ease infinite;}
        .mk-btn{cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;border:none;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(14,24,16,.12);border-radius:4px;}
      `}</style>

            {simulador && (
                <SimuladorModal produto={simulador} onClose={() => setSimulador(null)} onApply={handleApply} />
            )}

            {/* HEADER EDITORIAL */}
            <div className="mk-a1" style={{ borderBottom: `3px solid ${C.ink}`, paddingBottom: 24, marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
                        EDIÇÃO DIÁRIA · PRECIFICAÇÃO INTELIGENTE
                    </p>
                    <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.05, color: C.ink }}>
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

                    {perdido > 0 && (
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 14,
                            marginTop: 16,
                            background: C.redPale,
                            border: `1.5px solid rgba(214,40,40,0.18)`,
                            borderRadius: 12,
                            padding: "14px 20px",
                        }}>
                            <div>
                                <p style={{ fontSize: 10, color: C.redMid, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>
                                    DINHEIRO DEIXADO NA MESA ESTE MÊS
                                </p>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 800, color: C.redMid, letterSpacing: "-0.02em", lineHeight: 1 }}>
                                        R$ {Math.round(perdido).toLocaleString("pt-BR")}
                                    </span>
                                    <span style={{ fontSize: 11, color: C.redMid, opacity: .7 }}>por preços abaixo do ideal</span>
                                </div>
                            </div>
                            <button
                                className="mk-btn"
                                onClick={() => setSimulador(produtos.find(p => p.status === "risco") || produtos.find(p => p.status === "atencao"))}
                                style={{ background: C.redMid, color: C.white, borderRadius: 9, padding: "10px 18px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}
                            >
                                Corrigir agora →
                            </button>
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, alignSelf: "flex-start", marginTop: 4 }}>
                    <button className="mk-btn" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", fontSize: 12, fontWeight: 500, color: C.inkLight }}>
                        Ver relatório
                    </button>
                    <button className="mk-btn" onClick={() => navigate("/calculator")} style={{ background: C.green, borderRadius: 9, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: C.paper }}>
                        Ajustar preços →
                    </button>
                </div>
            </div>

            {/* GRID 3 COLUNAS — idêntico ao original */}
            <div style={{ display: "grid", gridTemplateColumns: "250px 1fr 280px", gap: 24, alignItems: "start" }}>

                {/* COL 1 — Markapômetro + Meta */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    <div className="mk-a2" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px 24px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start", marginBottom: 2 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.yellow, border: `1.5px solid ${C.yellowDeep}` }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Markapômetro™</span>
                        </div>
                        <Markapometro score={Number(score)} />
                        <div style={{ width: "100%", background: C.paperWarm, borderRadius: 10, padding: "10px 12px", borderLeft: `3px solid ${score >= 70 ? C.greenFresh : C.orange}`, marginTop: 4 }}>
                            <p style={{ fontSize: 11, color: C.inkLight, lineHeight: 1.55 }}>
                                {score >= 70
                                    ? <><strong style={{ color: C.ink }}>Boa saúde!</strong> Continue monitorando seus custos.</>
                                    : <><strong style={{ color: C.ink }}>Zona amarela.</strong> Ajuste {produtos.filter(p => p.status !== "ok").length} produto(s) para melhorar.</>
                                }
                            </p>
                        </div>

                        {businessProfile?.segment && SEGMENT_BENCHMARKS[businessProfile.segment] && (
                            <div style={{
                                width: "100%",
                                background: C.paperWarm,
                                borderRadius: 8,
                                padding: "8px 12px",
                                marginTop: 8,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                                <span style={{ fontSize: 10, color: C.inkMuted, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                                    {SEGMENT_BENCHMARKS[businessProfile.segment].icon} {SEGMENT_BENCHMARKS[businessProfile.segment].label}
                                </span>
                                <span style={{ fontSize: 10, color: C.greenMid, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>
                                    {businessProfile.customMarketMargin > 0
                                        ? `meta custom ${businessProfile.customMarketMargin}%`
                                        : `média ${SEGMENT_BENCHMARKS[businessProfile.segment].marketAvg}%`
                                    }
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Meta do Mês */}
                    <div className="mk-a3" style={{ background: C.green, borderRadius: 20, padding: "24px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", border: "1px solid rgba(232,245,66,.08)" }} />
                        <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,245,66,.55)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Meta do Mês</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
                            <div>
                                <p style={{ fontSize: 9, color: "rgba(255,255,255,.38)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Lucro estimado</p>
                                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 800, color: C.yellow, letterSpacing: "-0.02em", lineHeight: 1 }}>
                                    R$ {Math.round(lucroAtual).toLocaleString("pt-BR")}
                                </span>
                            </div>
                            <div style={{ textAlign: "right", paddingBottom: 4 }}>
                                <p style={{ fontSize: 9, color: "rgba(255,255,255,.38)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Meta</p>
                                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,.5)" }}>
                                    R$ {metaLucro.toLocaleString("pt-BR")}
                                </span>
                            </div>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,.1)", overflow: "hidden", marginBottom: 7 }}>
                            <div style={{ width: `${metaPct}%`, height: "100%", background: `linear-gradient(to right,${C.greenFresh},${C.yellow})`, borderRadius: 99, transition: "width 1.2s ease" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.yellow }}>{metaPct}% da meta</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>
                                faltam R$ {Math.max(0, metaLucro - Math.round(lucroAtual)).toLocaleString("pt-BR")}
                            </span>
                        </div>
                        <div style={{ marginTop: 14, height: 42 }}>
                            {margemTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={margemTrend} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="yg" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={C.yellow} stopOpacity={.3} />
                                                <stop offset="100%" stopColor={C.yellow} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="v" stroke={C.yellow} strokeWidth={2} fill="url(#yg)" dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'Plus Jakarta Sans',sans-serif", textAlign: "center", paddingTop: 14 }}>
                                    Histórico disponível após 30 dias
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* COL 2 — Produtos + Equilíbrio */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Lista de produtos */}
                    <div className="mk-a2" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>Meus Produtos</h2>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 10, color: C.inkMuted, background: C.paperWarm, borderRadius: 99, padding: "3px 10px" }}>
                                    {produtos.length} cadastrado{produtos.length !== 1 ? "s" : ""}
                                </span>
                                <button
                                    className="mk-btn"
                                    onClick={() => navigate("/calculator")}
                                    style={{ background: C.green, color: C.white, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700 }}
                                >
                                    + Novo
                                </button>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                            {produtos.map(p => {
                                const bc = p.status === "ok" ? C.greenFresh : p.status === "risco" ? C.redMid : C.orange;
                                const isEditing = editingId === p.id;
                                const pillStyle = {
                                    ok: { l: "Saudável", bg: C.greenPale, c: C.greenMid },
                                    atencao: { l: "Atenção", bg: C.orangePale, c: C.orange },
                                    risco: { l: "Risco", bg: C.redPale, c: C.redMid },
                                };
                                const pill = pillStyle[p.status];
                                return (
                                    <div key={p.id} style={{
                                        background: C.paper,
                                        border: `1px solid ${isEditing ? '#1A5C3A' : C.border}`,
                                        borderLeft: `3px solid ${bc}`,
                                        borderRadius: "0 12px 12px 0",
                                        padding: "14px 16px",
                                        transition: "all .2s ease",
                                        boxShadow: isEditing ? "0 0 0 3px rgba(26,92,58,0.08)" : "none",
                                    }}>
                                        {/* Linha principal — sempre visível */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 12 }}>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{p.nome}</span>
                                                    {p.category && (
                                                        <span style={{ fontSize: 10, color: C.inkMuted, background: C.paperWarm, borderRadius: 99, padding: "2px 7px" }}>
                                                            {p.category}
                                                        </span>
                                                    )}
                                                    <span style={{ background: pill.bg, color: pill.c, fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", borderRadius: 99, padding: "3px 8px" }}>
                                                        {pill.l}
                                                    </span>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ flex: 1, height: 4, borderRadius: 99, background: C.paperDeep, overflow: "hidden" }}>
                                                        <div style={{ width: `${Math.min(p.margem * 2.5, 100)}%`, height: "100%", background: bc, borderRadius: 99, transition: "width .6s ease" }} />
                                                    </div>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: C.ink, minWidth: 36 }}>{p.margem.toFixed(1)}%</span>
                                                </div>
                                                {/* Metadados adicionais */}
                                                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                                                    <span style={{ fontSize: 10, color: C.inkMuted }}>
                                                        Custo: <strong style={{ color: C.inkLight, fontFamily: "'DM Mono', monospace" }}>
                                                            R$ {p.custo.toFixed(2).replace(".", ",")}
                                                        </strong>
                                                    </span>
                                                    <span style={{ fontSize: 10, color: C.inkMuted }}>
                                                        Margem ideal: <strong style={{ color: C.greenMid, fontFamily: "'DM Mono', monospace" }}>
                                                            {((p.desiredMargin || 30))}%
                                                        </strong>
                                                    </span>
                                                    {p.breakEven && (
                                                        <span style={{ fontSize: 10, color: C.inkMuted }}>
                                                            Equilíbrio: <strong style={{ color: C.inkLight, fontFamily: "'DM Mono', monospace" }}>
                                                                {Math.ceil(p.breakEven)} un/mês
                                                            </strong>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ textAlign: "right" }}>
                                                <p style={{ fontSize: 9, color: C.inkMuted, marginBottom: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>Preço</p>
                                                <p style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 800, color: C.ink }}>
                                                    R$ {p.preco.toFixed(2).replace(".", ",")}
                                                </p>
                                            </div>

                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button
                                                    onClick={() => {
                                                        if (isEditing) {
                                                            setEditingId(null)
                                                            setEditValues({})
                                                        } else {
                                                            setEditingId(p.id)
                                                            setEditValues({ preco: p.preco.toFixed(2), margem: p.desiredMargin || 30 })
                                                        }
                                                    }}
                                                    style={{
                                                        background: isEditing ? C.paperWarm : C.paperDeep,
                                                        border: `1px solid ${isEditing ? C.border : 'transparent'}`,
                                                        borderRadius: 9, padding: "8px 11px",
                                                        fontSize: 11, fontWeight: 600,
                                                        color: isEditing ? C.inkMuted : C.inkMid,
                                                        cursor: "pointer", whiteSpace: "nowrap",
                                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                    }}
                                                >
                                                    {isEditing ? "✕ Cancelar" : "✎ Editar"}
                                                </button>
                                                <button
                                                    className="mk-btn mk-sim"
                                                    onClick={() => setSimulador(p)}
                                                    style={{
                                                        background: C.paperDeep, borderRadius: 9, padding: "8px 11px",
                                                        fontSize: 11, fontWeight: 600, color: C.inkMid,
                                                        cursor: "pointer", whiteSpace: "nowrap", border: "none",
                                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                        transition: "all .15s",
                                                    }}
                                                >
                                                    ⟷ Simular
                                                </button>
                                            </div>
                                        </div>

                                        {/* Painel de edição — expande quando isEditing */}
                                        {isEditing && (
                                            <div style={{
                                                marginTop: 14,
                                                paddingTop: 14,
                                                borderTop: `1px solid ${C.border}`,
                                                display: "flex",
                                                gap: 12,
                                                alignItems: "end",
                                                flexWrap: "wrap",
                                            }}>
                                                <div style={{ flex: 2, minWidth: 140 }}>
                                                    <label style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                                        Novo preço de venda
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <span style={{ position: 'absolute', left: 12, top: 10, color: C.inkMuted, fontSize: 12 }}>R$</span>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={editValues.preco || ""}
                                                            onChange={e => {
                                                                const newPreco = e.target.value;
                                                                // Re-calcular margem baseada no novo preço e custos atuais
                                                                const netMargin = (Number(newPreco) > 0) ? ((Number(newPreco) - p.custo) / Number(newPreco)) * 100 : 0;
                                                                setEditValues(v => ({ ...v, preco: newPreco, margem: Math.round(netMargin * 10) / 10 }));
                                                            }}
                                                            style={{
                                                                width: "100%", padding: "9px 12px 9px 32px",
                                                                fontFamily: "'DM Mono', monospace", fontSize: 14,
                                                                color: C.ink, background: C.white,
                                                                border: `1.5px solid #1A5C3A`, borderRadius: 8,
                                                                outline: "none", boxShadow: "0 0 0 3px rgba(26,92,58,0.08)",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ flex: 1.5, minWidth: 120 }}>
                                                    <label style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                                        Margem (%)
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={editValues.margem || ""}
                                                            onChange={e => {
                                                                const newMargem = e.target.value;
                                                                // Re-calcular preço baseado na nova margem
                                                                // P = C / (1 - M/100)
                                                                const mVal = Number(newMargem) / 100;
                                                                const newPreco = mVal < 1 ? (p.custo / (1 - mVal)) : 0;
                                                                setEditValues(v => ({ ...v, margem: newMargem, preco: newPreco.toFixed(2) }));
                                                            }}
                                                            style={{
                                                                width: "100%", padding: "9px 12px",
                                                                fontFamily: "'DM Mono', monospace", fontSize: 14,
                                                                color: C.ink, background: C.paperPale,
                                                                border: `1.5px solid ${C.border}`, borderRadius: 8,
                                                                outline: "none",
                                                            }}
                                                        />
                                                        <span style={{ position: 'absolute', right: 12, top: 10, color: C.inkMuted, fontSize: 12 }}>%</span>
                                                    </div>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 100 }}>
                                                    <button
                                                        onClick={() => handleSavePrice(p)}
                                                        disabled={savingId === p.id}
                                                        style={{
                                                            background: "#1A5C3A", color: "#FFFFFF",
                                                            border: "none", borderRadius: 9,
                                                            padding: "10px 18px", fontSize: 12, fontWeight: 700,
                                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                            cursor: savingId === p.id ? "not-allowed" : "pointer",
                                                            opacity: savingId === p.id ? 0.7 : 1,
                                                            width: "100%",
                                                            height: 40,
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                        }}
                                                    >
                                                        {savingId === p.id ? "..." : "Salvar →"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Ponto de equilíbrio + Composição */}
                    <div className="mk-a3" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                        <div>
                            <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Ponto de Equilíbrio</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 10 }}>
                                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>
                                    {breakEvenDisplay || '—'}
                                </span>
                                {breakEvenDisplay && <span style={{ fontSize: 11, color: C.inkMuted }}>und./mês</span>}
                            </div>
                            <div style={{ height: 6, borderRadius: 99, marginBottom: 4, position: "relative", background: `linear-gradient(to right,${C.redMid},${C.orange} 44%,${C.greenFresh})` }}>
                                <div style={{ position: "absolute", top: "50%", left: "62%", transform: "translate(-50%,-50%)", width: 13, height: 13, borderRadius: "50%", background: C.green, border: "2.5px solid #fff", boxShadow: "0 2px 5px rgba(0,0,0,.2)" }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                <span style={{ fontSize: 9, color: C.inkMuted }}>Prejuízo</span>
                                <span style={{ fontSize: 9, color: C.inkMuted }}>Lucro</span>
                            </div>
                        </div>
                        {/* Direita — Composição do preço do produto destaque */}
                        <div>
                            <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                                Composição do Preço
                            </p>

                            {produtoDestaque ? (() => {
                                const p = produtoDestaque
                                const total = p.preco || 1
                                const custoDir = p.custo || (p.productionCost + p.laborCost + p.packagingCost + p.shippingCost) || 0
                                const imposto = total * ((p.taxRate || 0) / 100)
                                const taxas = total * (((p.cardFee || 0) + (p.marketplaceFee || 0) + (p.commission || 0)) / 100)
                                const lucro = total * ((p.margem || 0) / 100)
                                const cf = total - custoDir - imposto - taxas - lucro

                                return (
                                    <>
                                        <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", gap: 1.5, marginBottom: 12 }}>
                                            {[
                                                { v: custoDir / total * 100, c: C.redMid },
                                                { v: Math.max(cf, 0) / total * 100, c: C.orange },
                                                { v: (imposto + taxas) / total * 100, c: C.greenSage },
                                                { v: lucro / total * 100, c: C.greenFresh },
                                            ].map((s, i) => (
                                                <div key={i} style={{ width: `${Math.max(s.v, 0)}%`, height: "100%", background: s.c, borderRadius: 4, transition: "width .6s ease" }} />
                                            ))}
                                        </div>
                                        {[
                                            { l: "Custo direto", v: `R$ ${custoDir.toFixed(2).replace(".", ",")}`, c: C.redMid },
                                            { l: "Custo fixo", v: `R$ ${Math.max(cf, 0).toFixed(2).replace(".", ",")}`, c: C.orange },
                                            { l: "Impostos/Taxas", v: `R$ ${(imposto + taxas).toFixed(2).replace(".", ",")}`, c: C.greenSage },
                                            { l: "Lucro", v: `R$ ${lucro.toFixed(2).replace(".", ",")}`, c: C.greenFresh },
                                        ].map(item => (
                                            <div key={item.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: item.c }} />
                                                    <span style={{ fontSize: 11, color: C.inkLight }}>{item.l}</span>
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{item.v}</span>
                                            </div>
                                        ))}
                                        <div style={{ marginTop: 8, background: C.paperWarm, borderRadius: 8, padding: "6px 10px" }}>
                                            <p style={{ fontSize: 10, color: C.inkMuted, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                                                Referência: <strong style={{ color: C.ink }}>{p.nome}</strong>
                                            </p>
                                        </div>
                                    </>
                                )
                            })() : (
                                <p style={{ fontSize: 11, color: C.inkMuted }}>Nenhum produto disponível</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* COL 3 — Benchmark + Diagnóstico IA */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    <div className="mk-a2" style={{
                        background: C.white,
                        border: `1px solid ${C.border}`,
                        borderRadius: 20,
                        padding: "24px",
                        position: "relative",
                        overflow: "hidden",
                        minHeight: 220,
                    }}>
                        {/* Conteúdo base — sempre renderizado */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.ink, flexShrink: 0 }}>✦</div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Benchmark Brasil</p>
                                <p style={{ fontSize: 10, color: C.inkMuted, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>PRO · Dados reais de mercado</p>
                            </div>
                        </div>
                        <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.6, marginBottom: 16, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                            Compare sua margem com negócios similares em todo o Brasil. Não precifique no escuro.
                        </p>
                        <p style={{ fontSize: 10, color: C.inkMuted, marginBottom: 16, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                            Dados de <strong>+2.400 empresas brasileiras</strong>
                        </p>

                        {/* Overlay PRO — cobre o card quando não desbloqueado */}
                        {!proBenchmark && (
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 10,
                                background: "rgba(247,245,239,0.88)",
                                backdropFilter: "blur(3px)",
                                borderRadius: 20,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "24px",
                                textAlign: "center",
                                gap: 12,
                            }}>
                                <div style={{ width: 44, height: 44, borderRadius: 14, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✦</div>
                                <div>
                                    <p style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 6, lineHeight: 1.2 }}>
                                        Benchmark Brasil
                                    </p>
                                    <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.6, maxWidth: 200 }}>
                                        Compare sua margem com negócios similares em todo o Brasil.
                                    </p>
                                </div>
                                <button
                                    className="mk-btn"
                                    onClick={() => navigate("/upgrade")}
                                    style={{
                                        background: C.green, color: C.paper,
                                        borderRadius: 10, padding: "12px 20px",
                                        fontSize: 13, fontWeight: 700, width: "100%",
                                        maxWidth: 220,
                                    }}
                                >
                                    Assinar PRO — ver agora
                                </button>
                                <p style={{ fontSize: 10, color: C.inkMuted }}>Dados de +2.400 empresas brasileiras</p>
                            </div>
                        )}
                    </div>

                    {/* Diagnóstico IA */}
                    <div className="mk-a3" style={{ background: C.ink, borderRadius: 20, padding: "24px", marginTop: 4, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -40, right: -40, width: 130, height: 130, borderRadius: "50%", background: "rgba(82,183,136,.05)" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                            <div style={{ width: 24, height: 24, background: C.yellow, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.ink }}>✦</div>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: C.white }}>Diagnóstico IA</p>
                                <p style={{ fontSize: 9, color: "rgba(255,255,255,.32)" }}>baseado nos seus produtos</p>
                            </div>
                        </div>

                        {/* Diagnóstico IA dinâmico */}
                        {(() => {
                            const pior = [...produtos].sort((a, b) => a.margem - b.margem)[0]
                            if (!pior) return null
                            return (
                                <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, padding: "10px 12px", marginBottom: 7, display: "flex", gap: 9 }}>
                                    <span style={{ fontSize: 13, flexShrink: 0 }}>
                                        {pior.status === 'risco' ? '⚠️' : pior.status === 'atencao' ? '💡' : '↑'}
                                    </span>
                                    <p style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
                                        <strong style={{ color: C.white }}>{pior.nome}</strong> tem a menor margem ({pior.margem.toFixed(1)}%).
                                        {pior.status === 'risco' && (
                                            <strong style={{ color: C.yellow, display: "block", marginTop: 2 }}>
                                                Sugerimos revisar o preço para R$ {(pior.preco * 1.15).toFixed(2).replace(".", ",")}.
                                            </strong>
                                        )}
                                    </p>
                                </div>
                            )
                        })()}

                        {!businessProfile?.fixedCostPercentage && (
                            <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, padding: "10px 12px", marginBottom: 7, display: "flex", gap: 9 }}>
                                <span style={{ fontSize: 13, flexShrink: 0 }}>↑</span>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
                                    Custos fixos não configurados.
                                    <strong style={{ color: C.yellow, display: "block", marginTop: 2 }}>
                                        Seus preços podem estar subestimados.
                                    </strong>
                                </p>
                            </div>
                        )}

                        {produtos.filter(p => p.status === 'ok').length > 0 && (
                            <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, padding: "10px 12px", marginBottom: 7, display: "flex", gap: 9 }}>
                                <span style={{ fontSize: 13, flexShrink: 0 }}>💡</span>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
                                    {produtos.filter(p => p.status === 'ok').length} produto(s) com margem saudável.
                                    <strong style={{ color: C.yellow, display: "block", marginTop: 2 }}>
                                        Continue monitorando os custos mensalmente.
                                    </strong>
                                </p>
                            </div>
                        )}

                        <button className="mk-btn" onClick={() => navigate("/upgrade")} style={{ marginTop: 6, width: "100%", background: C.yellow, color: C.ink, borderRadius: 10, padding: "11px", fontSize: 12, fontWeight: 700 }}>
                            Ver análise completa PRO →
                        </button>
                    </div>

                    {/* Metodologia Sebrae */}
                    <div className="mk-a4" style={{ background: C.yellowWarm, border: `1px solid rgba(196,207,0,.25)`, borderRadius: 14, padding: "13px 15px" }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "#7A8C00", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>✦ Metodologia Sebrae</p>
                        <p style={{ fontSize: 11, color: C.inkLight, lineHeight: 1.55 }}>
                            Seus cálculos seguem a metodologia oficial validada pelo Sebrae, usada por{" "}
                            <strong style={{ color: C.inkMid }}>+2.400 empresários</strong> no Brasil.
                        </p>
                    </div>
                </div>
            </div>
        </AppShell >
    );
}