import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export default function ForgotPassword() {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(null);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    function getPasswordStrength(pass) {
        if (pass.length === 0) return null;
        let score = 0;

        // Comprimento
        if (pass.length >= 8) score++;
        if (pass.length >= 12) score++;

        // Variedade de caracteres
        if (/[a-z]/.test(pass)) score++;        // minúscula
        if (/[A-Z]/.test(pass)) score++;        // maiúscula  
        if (/[0-9]/.test(pass)) score++;        // número
        if (/[^a-zA-Z0-9]/.test(pass)) score++; // especial (!@#$...)

        // Penalidades — senhas comuns/sequenciais
        const commonPatterns = [
            /^12345/,           // sequência numérica
            /^abcde/i,          // sequência alfabética
            /(.)\1{3,}/,        // caractere repetido 4x seguidos (aaaa)
            /^(password|senha|markap|qwerty|123456|111111)/i,
        ];
        const hasPenalty = commonPatterns.some(p => p.test(pass));
        if (hasPenalty) score = Math.min(score, 1); // força máx "fraca" se padrão comum

        // Resultado
        if (score <= 2) return { level: 'fraca', color: '#DC2626', width: '33%', text: 'Senha fraca — evite sequências óbvias' };
        if (score <= 4) return { level: 'media', color: '#EAB308', width: '66%', text: 'Razoável — adicione maiúsculas ou símbolos' };
        return { level: 'forte', color: '#22C55E', width: '100%', text: 'Senha forte ✓' };
    }

    // Validação de força de senha em tempo real
    useEffect(() => {
        setPasswordStrength(getPasswordStrength(newPassword));
    }, [newPassword]);

    // STEP 1 — enviar e-mail
    const handleSendCode = async (e) => {
        e.preventDefault();
        setIsLoading(true); setError('');
        try {
            await fetch(`${API}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setStep('code'); // sempre avança — não revelar se e-mail existe
        } catch {
            setError('Erro ao enviar. Tente novamente.');
        } finally { setIsLoading(false); }
    };

    // STEP 2 — verificar código
    // Input de 6 dígitos: ao digitar em cada box, avança para o próximo automaticamente
    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`)?.focus();
        }
    };
    const handleCodeKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            document.getElementById(`code-${index - 1}`)?.focus();
        }
    };
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setIsLoading(true); setError('');
        try {
            const res = await fetch(`${API}/api/auth/verify-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: code.join('') })
            });
            if (!res.ok) { setError('Código inválido ou expirado.'); return; }
            setStep('newPassword');
        } catch {
            setError('Erro ao verificar. Tente novamente.');
        } finally { setIsLoading(false); }
    };

    // STEP 3 — nova senha
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { setError('As senhas não coincidem.'); return; }
        if (newPassword.length < 8) { setError('Senha deve ter no mínimo 8 caracteres.'); return; }
        setIsLoading(true); setError('');
        try {
            const res = await fetch(`${API}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: code.join(''), newPassword })
            });
            if (!res.ok) { setError('Erro ao redefinir. Solicite novo código.'); return; }
            navigate('/login?reset=success');
        } catch {
            setError('Erro ao redefinir. Tente novamente.');
        } finally { setIsLoading(false); }
    };

    // Estilos compartilhados
    const inputStyle = {
        width: '100%', background: '#F7F7F7',
        border: '1.5px solid rgba(15,14,12,0.1)', borderRadius: '10px',
        padding: '12px 16px', fontSize: '14px', color: '#0F0E0C',
        outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxSizing: 'border-box',
    };
    const btnStyle = {
        width: '100%', height: '52px', background: '#1A5C3A', color: '#fff',
        border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
        fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        boxShadow: '0 4px 20px rgba(26,92,58,0.25)', transition: 'all 0.2s',
        opacity: isLoading ? 0.7 : 1,
    };
    const labelStyle = {
        fontSize: '11px', fontWeight: 700, color: 'rgba(15,14,12,0.45)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>

                {/* Logo */}
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <Link to="/"><Logo style={{ height: '32px', width: 'auto' }} /></Link>
                </div>

                {/* STEP 1 — E-mail */}
                {step === 'email' && (
                    <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '32px', fontWeight: 900, letterSpacing: '-0.03em', color: '#0F0E0C', marginBottom: '8px' }}>
                                Recuperar senha
                            </h1>
                            <p style={{ fontSize: '14px', color: 'rgba(15,14,12,0.5)', margin: 0 }}>
                                Enviaremos um código de 6 dígitos para seu e-mail.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={labelStyle}>E-mail</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = '#1A5C3A'; e.target.style.background = '#fff'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(15,14,12,0.1)'; e.target.style.background = '#F7F7F7'; }}
                            />
                        </div>
                        {error && <div style={{ padding: '12px 16px', background: '#FFF0F0', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', color: '#DC2626', fontSize: '13px' }}>⚠ {error}</div>}
                        <button type="submit" disabled={isLoading} style={btnStyle}>
                            {isLoading ? 'Enviando...' : <>Enviar código <ArrowRight size={16} /></>}
                        </button>
                        <Link to="/login" style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(15,14,12,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <ArrowLeft size={14} /> Voltar para o login
                        </Link>
                    </form>
                )}

                {/* STEP 2 — Código */}
                {step === 'code' && (
                    <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '32px', fontWeight: 900, letterSpacing: '-0.03em', color: '#0F0E0C', marginBottom: '8px' }}>
                                Digite o código
                            </h1>
                            <p style={{ fontSize: '14px', color: 'rgba(15,14,12,0.5)', margin: 0 }}>
                                Enviamos um código para <strong style={{ color: '#0F0E0C' }}>{email}</strong>. Válido por 15 minutos.
                            </p>
                        </div>
                        {/* 6 inputs de 1 dígito */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            {code.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`code-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleCodeChange(i, e.target.value)}
                                    onKeyDown={e => handleCodeKeyDown(i, e)}
                                    style={{
                                        width: '52px', height: '60px', textAlign: 'center',
                                        fontSize: '24px', fontWeight: 700, fontFamily: "'DM Mono', monospace",
                                        background: digit ? '#DCFCE7' : '#F7F7F7',
                                        border: digit ? '2px solid #1A5C3A' : '2px solid rgba(15,14,12,0.1)',
                                        borderRadius: '10px', outline: 'none', color: '#1A5C3A',
                                        transition: 'all 0.15s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#1A5C3A'; e.target.style.background = '#F0FDF4'; }}
                                    onBlur={e => { if (!digit) { e.target.style.borderColor = 'rgba(15,14,12,0.1)'; e.target.style.background = '#F7F7F7'; } }}
                                />
                            ))}
                        </div>
                        {error && <div style={{ padding: '12px 16px', background: '#FFF0F0', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', color: '#DC2626', fontSize: '13px' }}>⚠ {error}</div>}
                        <button type="submit" disabled={isLoading || code.join('').length < 6} style={{ ...btnStyle, opacity: (isLoading || code.join('').length < 6) ? 0.5 : 1 }}>
                            {isLoading ? 'Verificando...' : <>Verificar código <ArrowRight size={16} /></>}
                        </button>
                        <button type="button" onClick={() => { setStep('email'); setCode(['', '', '', '', '', '']); setError(''); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'rgba(15,14,12,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Não recebi o código — tentar novamente
                        </button>
                    </form>
                )}

                {/* STEP 3 — Nova senha */}
                {step === 'newPassword' && (
                    <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '32px', fontWeight: 900, letterSpacing: '-0.03em', color: '#0F0E0C', marginBottom: '8px' }}>
                                Nova senha
                            </h1>
                            <p style={{ fontSize: '14px', color: 'rgba(15,14,12,0.5)', margin: 0 }}>
                                Escolha uma senha forte para sua conta.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={labelStyle}>Nova senha</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPassword ? 'text' : 'password'} required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" style={{ ...inputStyle, paddingRight: '44px' }}
                                    onFocus={e => { e.target.style.borderColor = '#1A5C3A'; e.target.style.background = '#fff'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(15,14,12,0.1)'; e.target.style.background = '#F7F7F7'; }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(15,14,12,0.4)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {passwordStrength && (
                                <div style={{ marginTop: '2px' }}>
                                    <div style={{ height: '3px', borderRadius: '2px', background: '#F0F0F0', marginTop: '6px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: '2px', transition: 'all 0.3s', background: passwordStrength.color, width: passwordStrength.width }} />
                                    </div>
                                    <div style={{ fontSize: '11px', marginTop: '4px', fontWeight: 600, color: passwordStrength.color }}>
                                        {passwordStrength.text}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={labelStyle}>Confirmar senha</label>
                            <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repita a senha" style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = '#1A5C3A'; e.target.style.background = '#fff'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(15,14,12,0.1)'; e.target.style.background = '#F7F7F7'; }}
                            />
                        </div>
                        {error && <div style={{ padding: '12px 16px', background: '#FFF0F0', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', color: '#DC2626', fontSize: '13px' }}>⚠ {error}</div>}
                        <button type="submit" disabled={isLoading} style={btnStyle}>
                            {isLoading ? 'Salvando...' : <>Redefinir senha <ArrowRight size={16} /></>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
