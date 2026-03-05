import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowRight, BarChart3, AlertTriangle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Logo } from '../components/ui/Logo';

const PREVIEW_ITEMS = [
    { name: 'Bolsa de Couro', price: 'R$179,42', margin: '22%', status: 'ok' },
    { name: 'Camiseta Slim', price: 'R$89,90', margin: '8%', status: 'warn' },
    { name: 'Calça Jeans', price: 'R$145,00', margin: '-3%', status: 'bad' },
];

const STATUS = {
    ok: { bg: '#DCFCE7', color: '#1A5C3A' },
    warn: { bg: '#FFF176', color: '#92400E' },
    bad: { bg: '#FFF0F0', color: '#DC2626' },
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { login, isLoading, error: backendError } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const resetSuccess = new URLSearchParams(location.search).get('reset') === 'success';

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Este campo é obrigatório';
        if (!password.trim()) newErrors.password = 'Este campo é obrigatório';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const success = await login(email, password);
        if (success) navigate('/dashboard');
    };

    // Mensagens amigáveis baseadas em status ou keywords do erro
    let displayError = backendError;
    if (backendError) {
        if (backendError.includes('401') || backendError.toLowerCase().includes('invalid') || backendError.toLowerCase().includes('unauthorized')) {
            displayError = 'E-mail ou senha incorretos. Tente novamente.';
        } else if (backendError.includes('429') || backendError.toLowerCase().includes('too many attempts') || backendError.toLowerCase().includes('muitas tentativas')) {
            displayError = 'Muitas tentativas. Aguarde alguns minutos.';
        }
    }

    const inputStyle = (fieldId) => ({
        width: '100%',
        background: '#F7F7F7',
        border: errors[fieldId]
            ? '1.5px solid #DC2626'
            : '1.5px solid rgba(15,14,12,0.1)',
        borderRadius: '10px',
        padding: '12px 16px',
        paddingRight: fieldId === 'password' ? '48px' : '16px',
        fontSize: '14px',
        color: '#0F0E0C',
        outline: 'none',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxSizing: 'border-box',
        transition: 'border-color 0.15s, background 0.15s',
    });

    const errorTextStyle = {
        fontSize: '12px',
        color: '#DC2626',
        marginTop: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>

            {/* PAINEL ESQUERDO */}
            <div style={{
                width: '52%',
                flexShrink: 0,
                background: '#1A5C3A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Grid pattern */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }} />
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(rgba(255,255,255,0.06), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(rgba(255,255,255,0.04), transparent 70%)', pointerEvents: 'none' }} />

                {/* Logo */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <Logo style={{ color: 'white', height: '32px', width: 'auto' }} />
                    </Link>
                </div>

                {/* Conteúdo central */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '28px' }}>

                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 14px', width: 'fit-content' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Painel ao vivo</span>
                    </div>

                    {/* Headline */}
                    <h2 style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: 'clamp(32px, 3vw, 46px)',
                        fontWeight: 900,
                        lineHeight: 0.97,
                        letterSpacing: '-0.03em',
                        color: '#FFFFFF',
                        margin: 0,
                    }}>
                        Bem-vindo de volta.<br />
                        <em style={{ fontStyle: 'italic', color: '#FFF176' }}>Seus números esperam.</em>
                    </h2>

                    {/* Mini dashboard */}
                    <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Seus produtos</span>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Margem</span>
                        </div>
                        {PREVIEW_ITEMS.map((item, i) => (
                            <div key={i} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < PREVIEW_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BarChart3 size={12} color="rgba(255,255,255,0.6)" />
                                    </div>
                                    <div>
                                        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>{item.price}</div>
                                    </div>
                                </div>
                                <div style={{ padding: '3px 10px', borderRadius: '100px', background: STATUS[item.status].bg, color: STATUS[item.status].color, fontSize: '11px', fontWeight: 700 }}>
                                    {item.margin}
                                </div>
                            </div>
                        ))}
                        <div style={{ padding: '10px 16px', background: 'rgba(255,107,107,0.12)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={12} color="#FF6B6B" />
                            <span style={{ color: '#FF9999', fontSize: '12px' }}>Calça Jeans está abaixo do price mínimo.</span>
                        </div>
                    </div>

                    {/* Score cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                            { label: 'Score do negócio', value: '72', suffix: '/100', color: '#fff' },
                            { label: 'Margem média', value: '17%', color: '#22C55E' },
                        ].map((c, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '6px' }}>{c.label}</div>
                                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '26px', letterSpacing: '-0.04em', color: c.color, lineHeight: 1 }}>
                                    {c.value}
                                    {c.suffix && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>{c.suffix}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rodapé */}
                <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', margin: 0 }}>
                        © 2026 Markap · Precificação inteligente para quem trabalha de verdade.
                    </p>
                </div>
            </div>

            <div style={{
                flex: 1,
                alignSelf: 'stretch',
                height: '100vh',
                background: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '64px 48px',
            }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>

                    {/* Header */}
                    <div style={{ marginBottom: '36px' }}>
                        <h1 style={{
                            fontFamily: "'Fraunces', serif",
                            fontSize: 'clamp(28px, 3vw, 40px)',
                            fontWeight: 900,
                            letterSpacing: '-0.035em',
                            color: '#0F0E0C',
                            lineHeight: 1.05,
                            marginBottom: '10px',
                        }}>
                            Entrar no painel
                        </h1>
                        <p style={{ fontSize: '14px', color: 'rgba(15,14,12,0.5)', margin: 0 }}>
                            Ainda não tem conta?{' '}
                            <Link to="/register" style={{ color: '#1A5C3A', fontWeight: 700, textDecoration: 'none' }}>
                                Criar conta grátis
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    {resetSuccess && (
                        <div style={{
                            padding: '12px 16px',
                            background: '#DCFCE7',
                            border: '1px solid rgba(34,197,94,0.25)',
                            borderRadius: '10px',
                            color: '#1A5C3A',
                            fontSize: '13px',
                            fontWeight: 500,
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '16px' }}>✓</span>
                            <span>Senha redefinida com sucesso! Faça login com sua nova senha.</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Campo: E-mail */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label htmlFor="email" style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(15,14,12,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                                }}
                                style={inputStyle('email')}
                                onFocus={(e) => {
                                    if (!errors.email) e.target.style.borderColor = '#1A5C3A';
                                    e.target.style.background = '#fff';
                                }}
                                onBlur={(e) => {
                                    if (!errors.email) e.target.style.borderColor = 'rgba(15,14,12,0.1)';
                                    e.target.style.background = '#F7F7F7';
                                }}
                            />
                            {errors.email && (
                                <span style={errorTextStyle}>⚠ {errors.email}</span>
                            )}
                        </div>

                        {/* Campo: Senha */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="password" style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(15,14,12,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Senha
                                </label>
                                <Link to="/forgot-password" style={{ fontSize: '12px', color: '#1A5C3A', fontWeight: 600, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                                    }}
                                    style={inputStyle('password')}
                                    onFocus={(e) => {
                                        if (!errors.password) e.target.style.borderColor = '#1A5C3A';
                                        e.target.style.background = '#fff';
                                    }}
                                    onBlur={(e) => {
                                        if (!errors.password) e.target.style.borderColor = 'rgba(15,14,12,0.1)';
                                        e.target.style.background = '#F7F7F7';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'rgba(15,14,12,0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '4px',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <span style={errorTextStyle}>⚠ {errors.password}</span>
                            )}
                        </div>

                        {/* Banner de Erro Geral */}
                        {backendError && (
                            <div style={{
                                padding: '12px 16px',
                                background: '#FFF0F0',
                                border: '1px solid rgba(220,38,38,0.2)',
                                borderRadius: '10px',
                                color: '#DC2626',
                                fontSize: '13px',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={16} />
                                <span>⚠ {displayError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                height: '52px',
                                background: isLoading ? '#2E7D52' : '#1A5C3A',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: 700,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: isLoading ? 0.7 : 1,
                                boxShadow: '0 4px 20px rgba(26,92,58,0.25)',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = '#2E7D52'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#1A5C3A'; e.currentTarget.style.transform = 'none'; }}
                        >
                            {isLoading ? 'Entrando...' : <>Entrar no painel <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    {/* Trust */}
                    <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
                        {['🔒 Dados criptografados', '🇧🇷 Feito no Brasil'].map((t, i) => (
                            <span key={i} style={{ fontSize: '12px', color: 'rgba(15,14,12,0.3)' }}>{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}