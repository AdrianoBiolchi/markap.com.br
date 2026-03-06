import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

const C = {
    green: '#1A5C3A',
    greenMid: '#2E7D52',
    greenFresh: '#22C55E',
    greenLight: '#DCFCE7',
    greenPale: '#F0FDF4',
    ink: '#0F0E0C',
    inkMid: '#374151',
    inkLight: '#64748B',
    inkMuted: '#9CA3AF',
    white: '#FFFFFF',
    paper: '#F7F7F7',
    paperWarm: '#F4F3EF',
    border: '#E2E8F0',
    yellow: '#FFF176',
    yellowDeep: '#E8F542',
    yellowWarm: '#FEFCE8',
    redMid: '#D62828',
    redPale: '#FEF2F2',
    orange: '#F59E0B',
    orangePale: '#FFFBEB',
};

export default function ForgotPassword() {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const handleSendCode = async (e) => {
        e.preventDefault();
        setIsLoading(true); setError('');
        try {
            await fetch(`${API}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setStep('code');
        } catch {
            setError('Erro ao enviar. Tente novamente.');
        } finally { setIsLoading(false); }
    };

    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`)?.focus();
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

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { setError('As senhas não coincidem.'); return; }
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

    return (
        <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.paper }}>

            {/* PAINEL ESQUERDO — verde, 42%, sticky */}
            <div style={{
                width: '42%', minWidth: 340,
                background: C.green,
                position: 'sticky', top: 0, height: '100vh',
                display: 'flex', flexDirection: 'column',
                padding: '40px 44px',
            }}>
                <div style={{ marginBottom: 48 }}>
                    <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 26, color: C.white }}>
                        Mark<em style={{ fontStyle: 'italic', color: C.yellow }}>ap</em>
                    </span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: 'clamp(32px, 3vw, 42px)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        color: C.white,
                        marginBottom: 24,
                    }}>
                        Recupere sua conta.<br />
                        <span style={{ color: C.yellow, fontStyle: 'italic' }}>Volte ao controle.</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, maxWidth: 380 }}>
                        Não se preocupe, acontece com os melhores. Siga os passos para redefinir sua senha com segurança.
                    </p>
                </div>

                <p style={{ marginTop: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                    Dados seguros e privados. Só você tem acesso.
                </p>
            </div>

            {/* PAINEL DIREITO — formulário */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>

                    <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.inkLight, fontSize: 14, fontWeight: 600, textDecoration: 'none', marginBottom: 32 }}>
                        <ArrowLeft size={16} /> Voltar ao login
                    </Link>

                    {step === 'email' && (
                        <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div>
                                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 800, color: C.ink, marginBottom: 8 }}>Recuperar senha</h1>
                                <p style={{ fontSize: 14, color: C.inkLight }}>Digite seu e-mail para receber o código de verificação.</p>
                            </div>
                            <div>
                                <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.inkMid, display: 'block', marginBottom: 6 }}>E-mail</label>
                                <input
                                    type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 15, color: C.ink, background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10, outline: 'none' }}
                                    onFocus={e => { e.target.style.borderColor = C.green; e.target.style.boxShadow = `0 0 0 3px rgba(26,92,58,0.12)` }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                                />
                            </div>
                            {error && <div style={{ padding: '12px', background: C.redPale, borderRadius: 10, color: C.redMid, fontSize: 13 }}>{error}</div>}
                            <button disabled={isLoading} style={{ background: C.green, color: C.white, borderRadius: 12, padding: '14px 24px', fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer' }}>
                                {isLoading ? 'Enviando...' : 'Enviar código'}
                            </button>
                        </form>
                    )}

                    {step === 'code' && (
                        <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div>
                                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 800, color: C.ink, marginBottom: 8 }}>Digite o código</h1>
                                <p style={{ fontSize: 14, color: C.inkLight }}>Enviamos um código de 6 dígitos para <strong>{email}</strong>.</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                {code.map((digit, i) => (
                                    <input
                                        key={i} id={`code-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                                        onChange={e => handleCodeChange(i, e.target.value)}
                                        style={{ width: 52, height: 64, textAlign: 'center', fontSize: 24, fontWeight: 700, fontFamily: "'DM Mono', monospace", background: digit ? C.greenPale : C.white, border: digit ? `2px solid ${C.green}` : `2px solid ${C.border}`, borderRadius: 12, outline: 'none', color: C.green }}
                                        onFocus={e => { e.target.style.borderColor = C.green; e.target.style.background = C.greenPale }}
                                    />
                                ))}
                            </div>
                            {error && <div style={{ padding: '12px', background: C.redPale, borderRadius: 10, color: C.redMid, fontSize: 13 }}>{error}</div>}
                            <button disabled={isLoading || code.join('').length < 6} style={{ background: C.green, color: C.white, borderRadius: 12, padding: '14px 24px', fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer', opacity: (isLoading || code.join('').length < 6) ? 0.6 : 1 }}>
                                {isLoading ? 'Verificando...' : 'Verificar código'}
                            </button>
                        </form>
                    )}

                    {step === 'newPassword' && (
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div>
                                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 800, color: C.ink, marginBottom: 8 }}>Nova senha</h1>
                                <p style={{ fontSize: 14, color: C.inkLight }}>Escolha uma senha forte para proteger sua conta.</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.inkMid, display: 'block', marginBottom: 6 }}>Nova senha</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'} required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres"
                                            style={{ width: '100%', padding: '12px 14px', fontSize: 15, color: C.ink, background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10, outline: 'none' }}
                                            onFocus={e => { e.target.style.borderColor = C.green; e.target.style.boxShadow = `0 0 0 3px rgba(26,92,58,0.12)` }}
                                            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.inkMuted }}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.inkMid, display: 'block', marginBottom: 6 }}>Confirmar senha</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repita a senha"
                                        style={{ width: '100%', padding: '12px 14px', fontSize: 15, color: C.ink, background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10, outline: 'none' }}
                                        onFocus={e => { e.target.style.borderColor = C.green; e.target.style.boxShadow = `0 0 0 3px rgba(26,92,58,0.12)` }}
                                        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                                    />
                                </div>
                            </div>
                            {error && <div style={{ padding: '12px', background: C.redPale, borderRadius: 10, color: C.redMid, fontSize: 13 }}>{error}</div>}
                            <button disabled={isLoading} style={{ background: C.green, color: C.white, borderRadius: 12, padding: '14px 24px', fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer' }}>
                                {isLoading ? 'Salvando...' : 'Redefinir senha'}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}
