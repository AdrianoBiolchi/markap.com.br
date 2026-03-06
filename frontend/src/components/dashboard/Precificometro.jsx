import { useState, useEffect } from "react";
import { C } from "../../tokens/colors";

/*
  MARKAPÔMETRO™ v4
  
  O número percentual fica ABAIXO do pivô da agulha,
  no espaço vazio que o arco abre na base — exatamente
  como o velocímetro de um carro posiciona a velocidade.
  
  Layout vertical:
  ┌─────────────────────────┐
  │      ╭───────╮          │  ← arco (topo)
  │    ╭─┤       ├─╮        │
  │   /  │       │  \       │  ← agulha aponta aqui
  │  ●───┼───────┼───●      │  ← pivô central
  │      │  65%  │          │  ← número ABAIXO do pivô
  └─────────────────────────┘
  Saúde dos Preços           ← HTML externo
  ● Risco  ● Atenção  ● Saudável
*/

const CX = 130, CY = 108, R = 88;
const START_DEG = 130;
const TOTAL_DEG = 280;

const toRad = (d) => (d * Math.PI) / 180;
const pt = (deg, r) => ({
    x: CX + r * Math.cos(toRad(deg)),
    y: CY + r * Math.sin(toRad(deg)),
});
const arc = (from, sweep, r) => {
    const s = pt(from, r), e = pt(from + sweep, r);
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
};

// size="small" reduz o gauge para caber no painel lateral (width 272px)
export default function Markapometro({ score, size = "default" }) {
    const [anim, setAnim] = useState(0);

    useEffect(() => {
        let t0 = null;
        const dur = 1600;
        const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const run = (ts) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            setAnim(Math.round(ease(p) * Number(score)));
            if (p < 1) requestAnimationFrame(run);
        };
        const id = setTimeout(() => requestAnimationFrame(run), 300);
        return () => clearTimeout(id);
    }, [score]);

    const isSmall = size === "small";
    const svgW = isSmall ? 210 : 260;
    const svgH = isSmall ? 155 : 190;
    const scale = isSmall ? 210 / 260 : 1;

    const filled = (anim / 100) * TOTAL_DEG;
    const tip = pt(START_DEG + filled, R - 14);
    const color = anim <= 40 ? C.redMid : anim <= 65 ? C.orange : C.greenFresh;

    const zones = [
        { from: START_DEG, sweep: TOTAL_DEG * 0.34, c: C.redMid },
        { from: START_DEG + TOTAL_DEG * 0.34, sweep: TOTAL_DEG * 0.33, c: C.orange },
        { from: START_DEG + TOTAL_DEG * 0.67, sweep: TOTAL_DEG * 0.33, c: C.greenFresh },
    ];

    const ticks = [0, 25, 50, 75, 100].map((v) => ({
        i: pt(START_DEG + (v / 100) * TOTAL_DEG, R - 22),
        o: pt(START_DEG + (v / 100) * TOTAL_DEG, R - 10),
    }));

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <svg
                width={svgW}
                height={svgH}
                viewBox="0 0 260 190"
                style={{ overflow: "visible", display: "block", transform: `scale(${scale})`, transformOrigin: "top center" }}
            >
                {/* Trilha */}
                <path d={arc(START_DEG, TOTAL_DEG, R)} fill="none" stroke={C.paperDeep} strokeWidth={14} strokeLinecap="round" />
                {/* Zonas */}
                {zones.map((z, i) => (
                    <path key={i} d={arc(z.from, z.sweep, R)} fill="none" stroke={z.c} strokeWidth={14} strokeLinecap="round" opacity={0.22} />
                ))}
                {/* Progresso */}
                {filled > 0 && (
                    <path d={arc(START_DEG, filled, R)} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" />
                )}
                {/* Ticks */}
                {ticks.map((tk, i) => (
                    <line key={i}
                        x1={tk.i.x.toFixed(2)} y1={tk.i.y.toFixed(2)}
                        x2={tk.o.x.toFixed(2)} y2={tk.o.y.toFixed(2)}
                        stroke={C.inkMuted} strokeWidth={1.5}
                    />
                ))}
                {/* Agulha */}
                <line
                    x1={CX} y1={CY}
                    x2={tip.x.toFixed(2)} y2={tip.y.toFixed(2)}
                    stroke={C.ink} strokeWidth={3.5} strokeLinecap="round"
                />
                <circle cx={CX} cy={CY} r={9} fill={C.ink} />
                <circle cx={CX} cy={CY} r={4} fill={C.paper} />
                {/* NÚMERO — abaixo do pivô */}
                <text
                    x={CX}
                    y={CY + 52}
                    textAnchor="middle"
                    style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 800, fill: C.ink }}
                >
                    {anim}%
                </text>
            </svg>
        </div>
    );
}
