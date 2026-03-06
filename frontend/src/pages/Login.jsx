import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

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

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error: backendError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) navigate('/dashboard');
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
                        Bem-vindo de volta.<br />
                        <span style={{ color: C.yellow, fontStyle: 'italic' }}>Seus números esperam.</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, maxWidth: 380 }}>
                        Acesse seu painel para monitorar margens, ajustar preços e garantir a saúde do seu negócio.
                    </p>
                </div>

                <p style={{ marginTop: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                    Dados seguros e privados. Só você tem acesso.
                </p>
            </div>

            {/* PAINEL DIREITO — formulário */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>

                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 800, color: C.ink, marginBottom: 8 }}>Entrar</h1>
                        <p style={{ fontSize: 14, color: C.inkLight }}>
                            Não tem uma conta? <Link to="/register" style={{ color: C.green, fontWeight: 700, textDecoration: 'none' }}>Criar conta grátis</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        <div>
                            <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.inkMid, display: 'block', marginBottom: 6 }}>E-mail</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                style={{
                                    width: '100%', padding: '12px 14px', fontSize: 15, color: C.ink, background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10, outline: 'none', transition: 'all 0.15s'
                                }}
                                onFocus={e => { e.target.style.borderColor = C.green; e.target.style.boxShadow = `0 0 0 3px rgba(26,92,58,0.12)` }}
                                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.inkMid }}>Senha</label>
                                <Link to="/forgot-password" style={{ fontSize: 12, color: C.green, fontWeight: 600, textDecoration: 'none' }}>Esqueci minha senha</Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%', padding: '12px 14px', fontSize: 15, color: C.ink, background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10, outline: 'none', transition: 'all 0.15s'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = C.green; e.target.style.boxShadow = `0 0 0 3px rgba(26,92,58,0.12)` }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.inkMuted }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {backendError && (
                            <div style={{ padding: '12px', background: C.redPale, border: `1px solid ${C.redMid}20`, borderRadius: 10, color: C.redMid, fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
                                <AlertCircle size={16} />
                                <span>{backendError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                background: C.green, color: C.white, borderRadius: 12, padding: '14px 24px', fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { if (!isLoading) e.target.style.background = C.greenMid }}
                            onMouseLeave={e => { if (!isLoading) e.target.style.background = C.green }}
                        >
                            {isLoading ? 'Entrando...' : 'Entrar no painel'}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}