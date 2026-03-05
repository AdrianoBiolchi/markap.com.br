import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Logo } from '../components/ui/Logo';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(email, password, name);
        if (success) navigate('/onboarding');
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
                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(rgba(255,255,255,0.06), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(rgba(255,255,255,0.04), transparent 70%)', pointerEvents: 'none' }} />

                {/* Logo */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <Logo style={{ color: 'white', height: '32px', width: 'auto' }} />
                    </Link>
                </div>

                {/* Conteúdo central */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '36px' }}>

                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 14px', width: 'fit-content' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFF176' }} />
                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Grátis para começar</span>
                    </div>

                    {/* Headline */}
                    <div>
                        <h2 style={{
                            fontFamily: "'Fraunces', serif",
                            fontSize: 'clamp(36px, 3.5vw, 52px)',
                            fontWeight: 900,
                            lineHeight: 0.97,
                            letterSpacing: '-0.03em',
                            color: '#FFFFFF',
                            margin: 0,
                        }}>
                            Seu preço está certo<br />
                            ou te custando<br />
                            <em style={{ fontStyle: 'italic', color: '#FFF176' }}>dinheiro?</em>
                        </h2>
                        <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.65, maxWidth: '380px' }}>
                            Descubra em 3 minutos. Sem cartão de crédito.
                        </p>
                    </div>

                    {/* Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { icon: '⚡', text: 'Preço ideal calculado em 3 minutos' },
                            { icon: '📈', text: 'Diagnóstico de margem com IA' },
                            { icon: '🛡️', text: 'Metodologia SEBRAE, sem erro de cálculo' },
                        ].map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
                                    {f.icon}
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Depoimento */}
                    <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px 24px' }}>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                            {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#EAB308', fontSize: '13px' }}>★</span>)}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '16px' }}>
                            "Descobri que vendia com margem de 3%. No primeiro mês recuperei R$1.200."
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 800 }}>MC</div>
                            <div>
                                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>Marina C.</div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Artesã de bolsas · SP</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats rodapé */}
                <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {[
                        { v: '+2.400', l: 'Empresários' },
                        { v: 'R$890k', l: 'Recuperados' },
                        { v: '4.8 ★', l: 'Avaliação' },
                    ].map((s, i) => (
                        <div key={i}>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '22px', letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, marginBottom: '4px' }}>{s.v}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{s.l}</div>
                        </div>
                    ))}
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
                            Criar conta grátis
                        </h1>
                        <p style={{ fontSize: '14px', color: 'rgba(15,14,12,0.5)', margin: 0 }}>
                            Já tem uma conta?{' '}
                            <Link to="/login" style={{ color: '#1A5C3A', fontWeight: 700, textDecoration: 'none' }}>
                                Fazer login
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Campo */}
                        {[
                            { label: 'Nome completo', id: 'name', type: 'text', placeholder: 'Seu nome ou da empresa', value: name, onChange: (e) => setName(e.target.value) },
                            { label: 'E-mail', id: 'email', type: 'email', placeholder: 'seu@email.com', value: email, onChange: (e) => setEmail(e.target.value) },
                            { label: 'Senha', id: 'password', type: 'password', placeholder: 'Mínimo 8 caracteres', value: password, onChange: (e) => setPassword(e.target.value) },
                        ].map((f) => (
                            <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label htmlFor={f.id} style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(15,14,12,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {f.label}
                                </label>
                                <input
                                    id={f.id}
                                    type={f.type}
                                    placeholder={f.placeholder}
                                    required
                                    value={f.value}
                                    onChange={f.onChange}
                                    style={{
                                        width: '100%',
                                        background: '#F7F7F7',
                                        border: '1.5px solid rgba(15,14,12,0.1)',
                                        borderRadius: '10px',
                                        padding: '12px 16px',
                                        fontSize: '14px',
                                        color: '#0F0E0C',
                                        outline: 'none',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.15s, background 0.15s',
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#1A5C3A'; e.target.style.background = '#fff'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(15,14,12,0.1)'; e.target.style.background = '#F7F7F7'; }}
                                />
                            </div>
                        ))}

                        {/* Micro-benefits */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {['Plano Free incluído — até 5 produtos', 'Sem cartão de crédito necessário'].map((t, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: '#22C55E', fontSize: '15px' }}>✓</span>
                                    <span style={{ fontSize: '13px', color: 'rgba(15,14,12,0.5)' }}>{t}</span>
                                </div>
                            ))}
                        </div>

                        {/* Erro */}
                        {error && (
                            <div style={{ padding: '12px 16px', background: '#FFF0F0', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', color: '#DC2626', fontSize: '13px', fontWeight: 500 }}>
                                {error}
                            </div>
                        )}

                        {/* Botão */}
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
                                transition: 'all 0.2s',
                                opacity: isLoading ? 0.7 : 1,
                                boxShadow: '0 4px 20px rgba(26,92,58,0.25)',
                            }}
                            onMouseEnter={(e) => { if (!isLoading) { e.target.style.background = '#2E7D52'; e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 28px rgba(26,92,58,0.3)'; } }}
                            onMouseLeave={(e) => { e.target.style.background = '#1A5C3A'; e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 20px rgba(26,92,58,0.25)'; }}
                        >
                            {isLoading ? 'Criando conta...' : <>Começar agora <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    {/* Footer */}
                    <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'rgba(15,14,12,0.3)', lineHeight: 1.6 }}>
                        Ao criar uma conta você concorda com nossos{' '}
                        <Link to="/terms" style={{ color: 'rgba(15,14,12,0.4)', textDecoration: 'underline' }}>Termos</Link>
                        {' '}e{' '}
                        <Link to="/privacy" style={{ color: 'rgba(15,14,12,0.4)', textDecoration: 'underline' }}>Privacidade</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}