import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Logo } from '../components/ui/Logo';

// Mini dashboard preview data
const PREVIEW_ITEMS = [
    { name: 'Bolsa de Couro', price: 'R$179,42', margin: '22%', status: 'ok' },
    { name: 'Camiseta Slim', price: 'R$89,90', margin: '8%', status: 'warn' },
    { name: 'Calça Jeans', price: 'R$145,00', margin: '-3%', status: 'bad' },
];

const STATUS_COLORS = {
    ok: { bg: 'bg-[#DCFCE7]', text: 'text-[#1A5C3A]' },
    warn: { bg: 'bg-[#FFF176]', text: 'text-[#92400E]' },
    bad: { bg: 'bg-[#FFF0F0]', text: 'text-[#DC2626]' },
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
        <div style={{ position: 'fixed', inset: 0, display: 'flex', overflow: 'auto' }}>

            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex lg:w-[52%] bg-[#1A5C3A] flex-col justify-between p-12 relative overflow-hidden">

                {/* Background texture */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/[0.03] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/[0.04] translate-y-1/3 -translate-x-1/4" />
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                        }}
                    />
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Link to="/">
                        <Logo className="w-36 h-9 brightness-0 invert" />
                    </Link>
                </div>

                {/* Center: mini dashboard preview */}
                <div className="relative z-10 space-y-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                            <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">Painel ao vivo</span>
                        </div>
                        <h2
                            className="text-white leading-[0.97] tracking-tight"
                            style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 3vw, 46px)', fontWeight: 900 }}
                        >
                            Bem-vindo de volta.<br />
                            <em className="text-[#FFF176]">Seus números esperam.</em>
                        </h2>
                    </div>

                    {/* Mini product list */}
                    <div className="bg-white/[0.07] border border-white/10 rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">Seus produtos</span>
                            <span className="text-white/40 text-xs">Margem</span>
                        </div>
                        {/* Items */}
                        {PREVIEW_ITEMS.map((item, i) => {
                            const s = STATUS_COLORS[item.status];
                            return (
                                <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-white/[0.06] last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                                            <BarChart3 className="w-3 h-3 text-white/60" />
                                        </div>
                                        <div>
                                            <div className="text-white/90 text-xs font-semibold">{item.name}</div>
                                            <div className="text-white/40 text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>{item.price}</div>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                                        {item.margin}
                                    </div>
                                </div>
                            );
                        })}
                        {/* Alert footer */}
                        <div className="px-4 py-2.5 bg-[rgba(255,107,107,0.12)] border-t border-white/10 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-[#FF6B6B] flex-shrink-0" />
                            <span className="text-[#FF9999] text-xs">Calça Jeans está abaixo do preço mínimo.</span>
                        </div>
                    </div>

                    {/* Score card */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/[0.07] border border-white/10 rounded-xl p-4">
                            <div className="text-white/40 text-xs mb-1">Score do negócio</div>
                            <div
                                className="text-white leading-none"
                                style={{ fontFamily: "'DM Mono', monospace", fontSize: '28px', letterSpacing: '-0.04em' }}
                            >
                                72<span className="text-white/30 text-base">/100</span>
                            </div>
                        </div>
                        <div className="bg-white/[0.07] border border-white/10 rounded-xl p-4">
                            <div className="text-white/40 text-xs mb-1">Margem média</div>
                            <div
                                className="text-[#22C55E] leading-none"
                                style={{ fontFamily: "'DM Mono', monospace", fontSize: '28px', letterSpacing: '-0.04em' }}
                            >
                                17%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="relative z-10 border-t border-white/10 pt-6">
                    <p className="text-white/30 text-xs">
                        © 2026 Markap · Precificação inteligente para quem trabalha de verdade.
                    </p>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-16 bg-white">

                {/* Mobile logo */}
                <div className="lg:hidden mb-8">
                    <Link to="/"><Logo className="w-32 h-8" /></Link>
                </div>

                <div className="w-full max-w-md space-y-8">

                    {/* Header */}
                    <div className="space-y-1.5">
                        <h1
                            className="text-[#0F0E0C] leading-tight tracking-tight"
                            style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 900 }}
                        >
                            Entrar no painel
                        </h1>
                        <p className="text-[rgba(15,14,12,0.5)] text-sm">
                            Ainda não tem conta?{' '}
                            <Link to="/register" className="text-[#1A5C3A] font-bold hover:underline">
                                Criar conta grátis
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-[rgba(15,14,12,0.5)] uppercase tracking-wide">
                                E-mail
                            </label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#F7F7F7] border border-[rgba(15,14,12,0.1)] rounded-xl px-4 py-3 text-[#0F0E0C] text-sm placeholder:text-[rgba(15,14,12,0.3)] outline-none transition-all focus:border-[#1A5C3A] focus:bg-white focus:ring-3 focus:ring-[rgba(26,92,58,0.08)]"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-[rgba(15,14,12,0.5)] uppercase tracking-wide">
                                    Senha
                                </label>
                                <button
                                    type="button"
                                    className="text-xs font-medium text-[#1A5C3A] hover:underline"
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#F7F7F7] border border-[rgba(15,14,12,0.1)] rounded-xl px-4 py-3 text-[#0F0E0C] text-sm placeholder:text-[rgba(15,14,12,0.3)] outline-none transition-all focus:border-[#1A5C3A] focus:bg-white focus:ring-3 focus:ring-[rgba(26,92,58,0.08)]"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-[#1A5C3A] hover:bg-[#2E7D52] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(26,92,58,0.25)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                <>Entrar no painel <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    {/* Trust signals */}
                    <div className="flex items-center justify-center gap-6 pt-2">
                        {[
                            '🔒 Dados criptografados',
                            '🇧🇷 Feito no Brasil',
                        ].map((t, i) => (
                            <span key={i} className="text-xs text-[rgba(15,14,12,0.3)]">{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}