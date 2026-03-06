import { useState, useEffect } from "react";
import { C } from "../../tokens/colors";

/**
 * Campo numérico premium que suporta vírgula, mantém foco e estados transitórios (como vazio ou só vírgula).
 */
export function NumericField({ label, value, onChange, prefix, suffix, style, disabled }) {
    const [localValue, setLocalValue] = useState(value === 0 ? "" : value.toString().replace(".", ","));

    useEffect(() => {
        const valStr = value === 0 ? "" : value.toString().replace(".", ",");
        if (parseFloat(localValue.replace(",", ".")) !== value) {
            setLocalValue(valStr);
        }
    }, [value]);

    const handleChange = (e) => {
        let raw = e.target.value.replace(/[^0-9,.]/g, "");
        const separators = (raw.match(/[,.]/g) || []).length;
        if (separators > 1) return;

        setLocalValue(raw);
        const numeric = parseFloat(raw.replace(",", ".")) || 0;
        onChange(numeric);
    };

    return (
        <div style={style}>
            {label && <p style={{ fontSize: 9, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</p>}
            <div style={{ display: "flex", alignItems: "center", background: disabled ? C.paperWarm : C.paper, borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.border}`, gap: 4, opacity: disabled ? 0.7 : 1 }}>
                {prefix && <span style={{ fontSize: 12, color: C.inkMuted, flexShrink: 0 }}>{prefix}</span>}
                <input
                    type="text"
                    inputMode="decimal"
                    value={localValue}
                    placeholder="0"
                    onChange={handleChange}
                    disabled={disabled}
                    style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, fontWeight: 600, color: disabled ? C.inkMuted : C.ink, outline: "none", width: "100%", minWidth: 0, cursor: disabled ? "not-allowed" : "text" }}
                />
                {suffix && <span style={{ fontSize: 12, color: C.inkMuted, flexShrink: 0 }}>{suffix}</span>}
            </div>
        </div>
    );
}

/**
 * Incrementador numérico suave
 */
export function StepperField({ label, value, onChange, min = 1, step = 5, style }) {
    return (
        <div style={style}>
            {label && <p style={{ fontSize: 9, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</p>}
            <div style={{ display: "flex", alignItems: "center", background: C.paper, borderRadius: 8, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <button
                    type="button"
                    onClick={() => onChange(Math.max(min, value - step))}
                    style={{ padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", fontSize: 16, color: C.inkMid, fontWeight: 700, borderRight: `1px solid ${C.border}`, lineHeight: 1 }}
                >−</button>
                <input
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={e => {
                        const val = parseInt(e.target.value.replace(/\D/g, "")) || min;
                        onChange(val);
                    }}
                    style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, fontWeight: 700, color: C.ink, outline: "none", textAlign: "center" }}
                />
                <button
                    type="button"
                    onClick={() => onChange(value + step)}
                    style={{ padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", fontSize: 16, color: C.inkMid, fontWeight: 700, borderLeft: `1px solid ${C.border}`, lineHeight: 1 }}
                >+</button>
            </div>
            {label && <p style={{ fontSize: 9, color: C.inkMuted, marginTop: 3 }}>un./mês — ajuste de {step} em {step}</p>}
        </div>
    );
}
