import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { C } from '../../tokens/colors';

const requirements = [
    { id: 'length', text: 'Mínimo de 8 caracteres', regex: /.{8,}/ },
    { id: 'uppercase', text: 'Pelo menos uma letra maiúscula', regex: /[A-Z]/ },
    { id: 'lowercase', text: 'Pelo menos uma letra minúscula', regex: /[a-z]/ },
    { id: 'number', text: 'Pelo menos um número', regex: /[0-9]/ },
    { id: 'special', text: 'Pelo menos um caractere especial (!@#$%, etc.)', regex: /[^A-Za-z0-9]/ }
];

export function PasswordInput({ label, value, onChange, placeholder, styleOverrides = {}, showStrength = true }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Calculate strength logic
    const meetsRequirement = (reqRegex) => reqRegex.test(value);
    const score = requirements.filter(req => meetsRequirement(req.regex)).length;

    // Config colors for strength bar
    let strengthColor = C.border;
    if (score > 0 && score < 3) strengthColor = C.redMid;
    else if (score >= 3 && score < 5) strengthColor = C.yellow;
    else if (score === 5) strengthColor = C.greenFresh;

    return (
        <div style={{ marginBottom: 16 }}>
            {label && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.inkMid, fontFamily: "'Plus Jakarta Sans', sans-serif", ...styleOverrides.label }}>
                        {label}
                    </label>
                </div>
            )}

            <div style={{ position: 'relative' }}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required
                    style={{
                        width: '100%',
                        padding: '12px 14px',
                        paddingRight: '40px',
                        borderRadius: 10,
                        border: `1.5px solid ${C.border}`,
                        background: C.white,
                        color: C.ink,
                        fontSize: 15,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        outline: 'none',
                        transition: 'all 0.15s',
                        boxSizing: 'border-box',
                        ...styleOverrides.input
                    }}
                    onFocus={e => {
                        e.target.style.borderColor = C.green;
                        e.target.style.boxShadow = `0 0 0 3px rgba(26,92,58,0.12)`;
                        setIsFocused(true);
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = C.border;
                        e.target.style.boxShadow = 'none';
                        setIsFocused(false);
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.inkMuted, padding: 0 }}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Password Strength Indicator */}
            {showStrength && (value.length > 0 || isFocused) && (
                <div style={{ marginTop: 12, padding: '12px', background: C.paperWarm, borderRadius: 8, transition: 'all 0.2s', opacity: (value.length > 0 || isFocused) ? 1 : 0 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                        {[1, 2, 3, 4, 5].map(index => {
                            let barColor = C.border;
                            if (index <= score) barColor = strengthColor;
                            return (
                                <div key={index} style={{ height: 4, flex: 1, background: barColor, borderRadius: 2, transition: 'background-color 0.3s' }} />
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                        {requirements.map((req, i) => {
                            const isMet = meetsRequirement(req.regex);
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: isMet ? C.greenMid : C.inkMuted, transition: 'color 0.2s' }}>
                                    {isMet ? <Check size={14} color={C.greenMid} /> : <X size={14} color={C.border} />}
                                    <span style={{ fontWeight: 500 }}>{req.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
