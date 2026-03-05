import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, BarChart3, AlertTriangle } from 'lucide-react';
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
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) navigate('/dashboard');
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
                            <span style={{ color: '#FF9999', fontSize: '12px' }}>Calça Jeans está abaixo do preço mínimo.</span>
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
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label htmlFor="email" style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(15,14,12,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', background: '#F7F7F7', border: '1.5px solid rgba(15,14,12,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#0F0E0C', outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: 'border-box' }}
                                onFocus={(e) => { e.target.style.borderColor = '#1A5C3A'; e.target.style.background = '#fff'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(15,14,12,0.1)'; e.target.style.background = '#F7F7F7'; }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="password" style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(15,14,12,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Senha
                                </label>
                                <button type="button" style={{ fontSize: '12px', color: '#1A5C3A', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Esqueceu a senha?
                                </button>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', background: '#F7F7F7', border: '1.5px solid rgba(15,14,12,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#0F0E0C', outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: 'border-box' }}
                                onFocus={(e) => { e.target.style.borderColor = '#1A5C3A'; e.target.style.background = '#fff'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(15,14,12,0.1)'; e.target.style.background = '#F7F7F7'; }}
                            />
                        </div>

                        {error && (
                            <div style={{ padding: '12px 16px', background: '#FFF0F0', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', color: '#DC2626', fontSize: '13px', fontWeight: 500 }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                height: '52px',
                                background: '#1A5C3A',
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