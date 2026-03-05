import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { C } from "../tokens/colors";
import Markapometro from "../components/dashboard/Precificometro";
import SimuladorModal from "../components/dashboard/SimuladorModal";

const margemTrend = [
    { m: "SET", v: 18 }, { m: "OUT", v: 21 }, { m: "NOV", v: 17 },
    { m: "DEZ", v: 24 }, { m: "JAN", v: 22 }, { m: "FEV", v: 28 }, { m: "MAR", v: 31 },
];

const produtosInit = [
    { id: 1, nome: "Bolsa Couro Artesanal", preco: 127.90, margem: 30, custo: 89.50, status: "ok" },
    { id: 2, nome: "Cinto Trançado", preco: 89.00, margem: 22, custo: 45.00, status: "ok" },
    { id: 3, nome: "Carteira Slim", preco: 65.00, margem: 8, custo: 58.00, status: "atencao" },
    { id: 4, nome: "Mochila Urban", preco: 210.00, margem: 34, custo: 138.00, status: "ok" },
    { id: 5, nome: "Porta-documentos", preco: 45.00, margem: 4, custo: 42.00, status: "risco" },
];

const benchmarkData = [
    { seg: "Artesanato couro SP", media: 35, voce: 23 },
    { seg: "Acessórios femininos", media: 29, voce: 23 },
    { seg: "Artigos presentes", media: 26, voce: 23 },
];

function Pill({ s }) {
    const m = {
        ok: { l: "Saudável", bg: C.greenPale, c: C.greenMid },
        atencao: { l: "Atenção", bg: C.orangePale, c: C.orange },
        risco: { l: "Risco", bg: C.redPale, c: C.redMid },
    };
    return <span style={{ background: m[s].bg, color: m[s].c, fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", borderRadius: 99, padding: "3px 8px" }}>{m[s].l}</span>;
}

const navIcons = [
    { t: "Dashboard", i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" /><rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" /><rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" /><rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" /></svg> },
    { t: "Calculadora", i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M9 7h6M9 11h4M9 15h2M13 15h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
    { t: "Produtos", i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.8" /></svg> },
    { t: "Relatórios", i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
];

export default function Dashboard() {
    const [nav, setNav] = useState(0);
    const [produtos, setProdutos] = useState(produtosInit);
    const [simulador, setSimulador] = useState(null);
    const [proBenchmark, setProBenchmark] = useState(false);
    const [alertaDismissed, setAlertaDismissed] = useState(false);

    const score = Math.min(Math.round(
        (produtos.filter(p => p.status === "ok").length / produtos.length) * 100 +
        produtos.reduce((a, p) => a + p.margem, 0) / produtos.length / 4
    ), 100);
    const metaLucro = 3000;
    const lucroAtual = produtos.reduce((a, p) => {
        const s = p.status === "ok" ? 1 : p.status === "atencao" ? .5 : 0;
        return a + (p.preco - p.custo) * 20 * s;
    }, 0);
    const metaPct = Math.min(Math.round((lucroAtual / metaLucro) * 100), 100);
    const perdido = produtos
        .filter(p => p.status !== "ok")
        .reduce((a, p) => {
            const margemIdeal = p.preco * 0.25;
            const margemAtual = p.preco - p.custo;
            const diff = margemIdeal - margemAtual;
            return a + (diff > 0 ? diff * 10 : 0);
        }, 0);

    const handleApply = (id, novoPreco, novaMargem) => {
        setProdutos(prev => prev.map(p => {
            if (p.id !== id) return p;
            const s = novaMargem >= 20 ? "ok" : novaMargem >= 10 ? "atencao" : "risco";
            return { ...p, preco: novoPreco, margem: parseFloat(novaMargem.toFixed(1)), status: s };
        }));
    };

    return (
        <div style={{ minHeight: "100vh", background: C.paper, display: "flex", fontFamily: "'Instrument Sans',sans-serif", color: C.ink }}>
            <style>{`
        @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
        .mk-a1{animation:up .5s cubic-bezier(.22,1,.36,1) .05s both}
        .mk-a2{animation:up .5s cubic-bezier(.22,1,.36,1) .14s both}
        .mk-a3{animation:up .5s cubic-bezier(.22,1,.36,1) .23s both}
        .mk-a4{animation:up .5s cubic-bezier(.22,1,.36,1) .32s both}
        .mk-nb{transition:all .15s;cursor:pointer;border:none;background:transparent;font-family:inherit;}
        .mk-nb:hover{background:${C.paperWarm}!important;color:${C.ink}!important;}
        .mk-nb.on{background:${C.ink}!important;color:${C.paper}!important;}
        .mk-pc:hover{background:${C.paperWarm}!important;}
        .mk-sim:hover{background:${C.greenMid}!important;color:${C.paper}!important;}
        .mk-blink{animation:blink 1.8s ease infinite;}
        .mk-btn{cursor:pointer;font-family:'Instrument Sans',sans-serif;border:none;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(14,24,16,.12);border-radius:4px;}
      `}</style>

            {simulador && <SimuladorModal produto={simulador} onClose={() => setSimulador(null)} onApply={handleApply} />}

            {/* SIDEBAR */}
            <aside style={{ width: 68, background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22, paddingBottom: 22, position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 10 }}>
                <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 800, color: C.green, letterSpacing: "0.05em", marginBottom: 28, userSelect: "none" }}>
                    Mark<em style={{ fontStyle: "italic", color: C.greenMid }}>ap</em>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
                    {navIcons.map((item, i) => (
                        <button key={i} title={item.t} className={`mk-nb${nav === i ? " on" : ""}`} onClick={() => setNav(i)}
                            style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: nav === i ? C.paper : C.inkMuted }}>
                            {item.i}
                        </button>
                    ))}
                </div>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.yellow }}>AN</div>
            </aside>

            {/* MAIN */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

                {/* YELLOW STRIPE */}
                <div style={{ background: C.yellow, borderBottom: `2px solid ${C.yellowDeep}`, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 42, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: "0.07em" }}>QUI · 05 MAR 2026</span>
                        <span style={{ width: 1, height: 14, background: "rgba(14,24,16,.18)" }} />
                        {!alertaDismissed && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(14,24,16,0.09)", borderRadius: 99, padding: "3px 10px" }}>
                                <div className="mk-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: C.redMid }} />
                                <span style={{ fontSize: 10, fontWeight: 600, color: C.inkMid }}>Custos subiram 6% em 30 dias — preços não foram reajustados</span>
                                <button onClick={() => setAlertaDismissed(true)} className="mk-btn" style={{ background: C.ink, color: C.yellow, borderRadius: 5, padding: "1px 7px", fontSize: 9, fontWeight: 700 }}>Ver →</button>
                            </div>
                        )}
                    </div>
                    <button className="mk-btn" style={{ background: C.ink, color: C.paper, borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700 }}>+ Novo Cálculo</button>
                </div>

                {/* SCROLL AREA */}
                <main style={{ flex: 1, padding: "24px 28px 36px", overflowY: "auto" }}>

                    {/* HEADER EDITORIAL */}
                    <div className="mk-a1" style={{ borderBottom: `3px solid ${C.ink}`, paddingBottom: 18, marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>EDIÇÃO DIÁRIA · PRECIFICAÇÃO INTELIGENTE</p>
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
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 12, background: C.redPale, border: `1.5px solid rgba(214,40,40,0.18)`, borderRadius: 12, padding: "11px 18px" }}>
                                    <div>
                                        <p style={{ fontSize: 10, color: C.redMid, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 2 }}>Dinheiro deixado na mesa este mês</p>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 800, color: C.redMid, letterSpacing: "-0.02em", lineHeight: 1 }}>R$ {Math.round(perdido).toLocaleString("pt-BR")}</span>
                                            <span style={{ fontSize: 11, color: C.redMid, opacity: .7 }}>por preços abaixo do ideal</span>
                                        </div>
                                    </div>
                                    <button className="mk-btn" onClick={() => setSimulador(produtos.find(p => p.status === "risco") || produtos.find(p => p.status === "atencao"))}
                                        style={{ background: C.redMid, color: C.white, borderRadius: 9, padding: "9px 16px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>Corrigir agora →</button>
                                </div>
                            )}
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                            <button className="mk-btn" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", fontSize: 12, fontWeight: 500, color: C.inkLight }}>Ver relatório</button>
                            <button className="mk-btn" style={{ background: C.green, borderRadius: 9, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: C.paper }}>Ajustar preços →</button>
                        </div>
                    </div>

                    {/* GRID 3 COLUNAS */}
                    <div style={{ display: "grid", gridTemplateColumns: "270px 1fr 260px", gap: 16, alignItems: "start" }}>

                        {/* COL 1 — Precificômetro + Meta */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div className="mk-a2" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 14px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start", marginBottom: 2 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.yellow, border: `1.5px solid ${C.yellowDeep}` }} />
                                    <span style={{ fontSize: 10, fontWeight: 700, color: C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Markapômetro™</span>
                                </div>
                                <Markapometro score={Number(score)} />
                                <div style={{ width: "100%", background: C.paperWarm, borderRadius: 10, padding: "10px 12px", borderLeft: `3px solid ${score >= 70 ? C.greenFresh : C.orange}`, marginTop: 4 }}>
                                    <p style={{ fontSize: 11, color: C.inkLight, lineHeight: 1.55 }}>
                                        {score >= 70
                                            ? <><strong style={{ color: C.ink }}>Boa saúde!</strong> Continue monitorando seus custos.</>
                                            : <><strong style={{ color: C.ink }}>Zona amarela.</strong> Ajuste {produtos.filter(p => p.status !== "ok").length} produtos para melhorar.</>}
                                    </p>
                                </div>
                            </div>

                            <div className="mk-a3" style={{ background: C.green, borderRadius: 20, padding: "20px", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", border: "1px solid rgba(232,245,66,.08)" }} />
                                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,245,66,.55)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Meta do Mês</p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                                    <div>
                                        <p style={{ fontSize: 9, color: "rgba(255,255,255,.38)", marginBottom: 2 }}>Lucro atual</p>
                                        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: C.yellow, letterSpacing: "-0.02em" }}>R$ {Math.round(lucroAtual).toLocaleString("pt-BR")}</span>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ fontSize: 9, color: "rgba(255,255,255,.38)", marginBottom: 2 }}>Meta</p>
                                        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,.45)" }}>R$ {metaLucro.toLocaleString("pt-BR")}</span>
                                    </div>
                                </div>
                                <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,.1)", overflow: "hidden", marginBottom: 7 }}>
                                    <div style={{ width: `${metaPct}%`, height: "100%", background: `linear-gradient(to right,${C.greenFresh},${C.yellow})`, borderRadius: 99, transition: "width 1.2s ease" }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: C.yellow }}>{metaPct}% da meta</span>
                                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>faltam R$ {Math.max(0, metaLucro - Math.round(lucroAtual)).toLocaleString("pt-BR")}</span>
                                </div>
                                <div style={{ marginTop: 14, height: 42 }}>
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
                                </div>
                            </div>
                        </div>

                        {/* COL 2 — Produtos + Equilíbrio */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div className="mk-a2" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "22px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                    <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>Meus Produtos</h2>
                                    <span style={{ fontSize: 10, color: C.inkMuted, background: C.paperWarm, borderRadius: 99, padding: "3px 10px" }}>{produtos.length} cadastrados</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    {produtos.map(p => {
                                        const bc = p.status === "ok" ? C.greenFresh : p.status === "risco" ? C.redMid : C.orange;
                                        return (
                                            <div key={p.id} className="mk-pc" style={{ background: C.paper, border: `1px solid ${C.border}`, borderLeft: `3px solid ${bc}`, borderRadius: "0 12px 12px 0", padding: "13px 15px", display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 12, transition: "background .15s" }}>
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                                                        <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{p.nome}</span>
                                                        <Pill s={p.status} />
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <div style={{ flex: 1, height: 4, borderRadius: 99, background: C.paperDeep, overflow: "hidden" }}>
                                                            <div style={{ width: `${Math.min(p.margem * 2.5, 100)}%`, height: "100%", background: bc, borderRadius: 99, transition: "width .6s ease" }} />
                                                        </div>
                                                        <span style={{ fontSize: 11, fontWeight: 700, color: C.ink, minWidth: 28 }}>{p.margem}%</span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <p style={{ fontSize: 9, color: C.inkMuted, marginBottom: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>Preço</p>
                                                    <p style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 800, color: C.ink }}>R$ {p.preco.toFixed(2).replace(".", ",")}</p>
                                                </div>
                                                <button className="mk-btn mk-sim" onClick={() => setSimulador(p)} style={{ background: C.paperDeep, borderRadius: 9, padding: "8px 11px", fontSize: 11, fontWeight: 600, color: C.inkMid, whiteSpace: "nowrap", transition: "all .15s" }}>⟷ Simular</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mk-a3" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <div>
                                    <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Ponto de Equilíbrio</p>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 10 }}>
                                        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>47</span>
                                        <span style={{ fontSize: 11, color: C.inkMuted }}>und./mês</span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 99, marginBottom: 4, position: "relative", background: `linear-gradient(to right,${C.redMid},${C.orange} 44%,${C.greenFresh})` }}>
                                        <div style={{ position: "absolute", top: "50%", left: "62%", transform: "translate(-50%,-50%)", width: 13, height: 13, borderRadius: "50%", background: C.green, border: "2.5px solid #fff", boxShadow: "0 2px 5px rgba(0,0,0,.2)" }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                        <span style={{ fontSize: 9, color: C.inkMuted }}>Prejuízo</span>
                                        <span style={{ fontSize: 9, color: C.inkMuted }}>Lucro</span>
                                    </div>
                                    <div style={{ background: C.greenPale, borderRadius: 8, padding: "8px 10px", display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 11, color: C.greenMid, fontWeight: 500 }}>Você vendeu</span>
                                        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 800, color: C.greenMid }}>68 und. <span style={{ fontSize: 11, color: C.greenFresh }}>+21</span></span>
                                    </div>
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Composição do Preço</p>
                                    <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", gap: 1.5, marginBottom: 12 }}>
                                        {[{ p: 35, c: C.redMid }, { p: 15, c: C.orange }, { p: 20, c: C.greenSage }, { p: 30, c: C.greenFresh }].map((s, i) => (
                                            <div key={i} style={{ width: `${s.p}%`, height: "100%", background: s.c, borderRadius: 4 }} />
                                        ))}
                                    </div>
                                    {[
                                        { l: "Custos", v: "R$ 45", c: C.redMid },
                                        { l: "Impostos", v: "R$ 19", c: C.orange },
                                        { l: "Despesas", v: "R$ 25", c: C.greenSage },
                                        { l: "Lucro", v: "R$ 38", c: C.greenFresh },
                                    ].map(item => (
                                        <div key={item.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: 2, background: item.c }} />
                                                <span style={{ fontSize: 11, color: C.inkLight }}>{item.l}</span>
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{item.v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* COL 3 — Benchmark + IA + Sebrae */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div className="mk-a2" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px", position: "relative", overflow: "hidden" }}>
                                {!proBenchmark && (
                                    <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(247,245,239,0.9)", backdropFilter: "blur(4px)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "22px", textAlign: "center" }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 13, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>✦</div>
                                        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 7, lineHeight: 1.2 }}>Benchmark Brasil</p>
                                        <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.6, marginBottom: 16, maxWidth: 190 }}>Compare sua margem com negócios similares em todo o Brasil.</p>
                                        <button className="mk-btn" onClick={() => setProBenchmark(true)} style={{ background: C.green, color: C.paper, borderRadius: 10, padding: "11px 20px", fontSize: 12, fontWeight: 700, width: "100%" }}>Assinar PRO — ver agora</button>
                                        <p style={{ fontSize: 10, color: C.inkMuted, marginTop: 10 }}>Dados de +2.400 empresas brasileiras</p>
                                    </div>
                                )}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                    <div style={{ width: 26, height: 26, borderRadius: 7, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.ink }}>✦</div>
                                    <div>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>Benchmark Brasil</p>
                                        <p style={{ fontSize: 9, color: C.inkMuted }}>PRO · Dados reais de mercado</p>
                                    </div>
                                </div>
                                {benchmarkData.map((b, i) => (
                                    <div key={i} style={{ marginBottom: 14 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                            <span style={{ fontSize: 11, color: C.inkLight }}>{b.seg}</span>
                                            <span style={{ fontSize: 9, fontWeight: 700, color: C.redMid, background: C.redPale, borderRadius: 99, padding: "2px 6px" }}>+{b.media - b.voce}pp acima</span>
                                        </div>
                                        <div style={{ height: 6, borderRadius: 99, background: C.paperWarm, position: "relative" }}>
                                            <div style={{ position: "absolute", left: 0, top: 0, width: `${(b.voce / 40) * 100}%`, height: "100%", background: C.greenSage, borderRadius: 99 }} />
                                            <div style={{ position: "absolute", top: -2, left: `${(b.media / 40) * 100}%`, transform: "translateX(-50%)", width: 2.5, height: 10, background: C.green, borderRadius: 99 }} />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                                            <span style={{ fontSize: 9, color: C.inkMuted }}>Você: {b.voce}%</span>
                                            <span style={{ fontSize: 9, fontWeight: 600, color: C.greenMid }}>Média: {b.media}%</span>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ background: C.yellowWarm, border: `1px solid rgba(196,207,0,.3)`, borderRadius: 10, padding: "10px 12px", marginTop: 2 }}>
                                    <p style={{ fontSize: 11, color: C.inkMid, lineHeight: 1.55 }}>💡 <strong>Artesanato couro SP</strong> tem margem 12pp acima de você. Bolsa Couro a R$ 149 ainda estaria na média do mercado.</p>
                                </div>
                            </div>

                            <div className="mk-a3" style={{ background: C.ink, borderRadius: 20, padding: "20px", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: -40, right: -40, width: 130, height: 130, borderRadius: "50%", background: "rgba(82,183,136,.05)" }} />
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                    <div style={{ width: 24, height: 24, background: C.yellow, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.ink }}>✦</div>
                                    <div>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: C.white }}>Diagnóstico IA</p>
                                        <p style={{ fontSize: 9, color: "rgba(255,255,255,.32)" }}>atualizado há 3 min</p>
                                    </div>
                                </div>
                                {[
                                    { t: "\u2191", text: "Preço 5% abaixo da média do mercado.", val: "Subir para R$ 135" },
                                    { t: "\uD83D\uDCA1", text: "Reduzir embalagem em R$2 = lucro anual de", val: "R$ 1.200 a mais" },
                                    { t: "\u26A0\uFE0F", text: "Porta-documentos: risco de prejuízo com impostos.", val: null },
                                ].map((ins, i) => (
                                    <div key={i} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, padding: "10px 12px", marginBottom: 7, display: "flex", gap: 9, alignItems: "flex-start" }}>
                                        <span style={{ fontSize: 13, flexShrink: 0, fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" }}>
                                            {ins.t}
                                        </span>
                                        <p style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
                                            {ins.text}
                                            {ins.val && <strong style={{ color: C.yellow, display: "block", marginTop: 2 }}>{ins.val}</strong>}
                                        </p>
                                    </div>
                                ))}
                                <button className="mk-btn" style={{ marginTop: 6, width: "100%", background: C.yellow, color: C.ink, borderRadius: 10, padding: "11px", fontSize: 12, fontWeight: 700 }}>Ver análise completa PRO →</button>
                            </div>

                            <div className="mk-a4" style={{ background: C.yellowWarm, border: `1px solid rgba(196,207,0,.25)`, borderRadius: 14, padding: "13px 15px" }}>
                                <p style={{ fontSize: 9, fontWeight: 700, color: "#7A8C00", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>✦ Metodologia Sebrae</p>
                                <p style={{ fontSize: 11, color: C.inkLight, lineHeight: 1.55 }}>
                                    Seus cálculos seguem a methodology oficial validada pelo Sebrae, usada por{" "}
                                    <strong style={{ color: C.inkMid }}>+2.400 empresários</strong> no Brasil.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
