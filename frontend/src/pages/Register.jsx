import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Logo } from '../components/ui/Logo';

const FEATURES = [
    { icon: <Zap className="w-4 h-4" />, text: 'Preço ideal calculado em 3 minutos' },
    { icon: <TrendingUp className="w-4 h-4" />, text: 'Diagnóstico de margem com IA' },
    { icon: <ShieldCheck className="w-4 h-4" />, text: 'Metodologia SEBRAE, sem erro de cálculo' },
];

const TESTIMONIAL = {
    quote: 'Descobri que vendia com margem de 3%. No primeiro mês recuperei R$1.200.',
    name: 'Marina C.',
    role: 'Artesã de bolsas · SP',
    initials: 'MC',
};

const STATS = [
    { value: '+2.400', label: 'Empresários' },
    { value: 'R$890k', label: 'Recuperados' },
    { value: '4.8 ★', label: 'Avaliação' },
];

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
        <div style={{ position: 'fixed', inset: 0, display: 'flex', overflow: 'auto' }}>

            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex lg:w-[52%] bg-[#1A5C3A] flex-col justify-between p-12 relative overflow-hidden">

                {/* Background texture */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/[0.03] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/[0.04] translate-y-1/3 -translate-x-1/4" />
                    <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] -translate-x-1/2 -translate-y-1/2" />
                    {/* Grid pattern */}
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

                {/* Center content */}
                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFF176] animate-pulse" />
                            <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">Grátis para começar</span>
                        </div>
                        <h2
                            className="text-white leading-[0.97] tracking-tight"
                            style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(36px, 3.5vw, 52px)', fontWeight: 900 }}
                        >
                            Seu preço está certo<br />
                            ou te custando<br />
                            <em className="text-[#FFF176]">dinheiro?</em>
                        </h2>
                        <p className="text-white/60 text-base leading-relaxed max-w-sm">
                            Descubra em 3 minutos. Sem cartão de crédito.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#FFF176] flex-shrink-0">
                                    {f.icon}
                                </div>
                                <span className="text-white/80 text-sm">{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-5 space-y-3">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => <span key={i} className="text-[#EAB308] text-sm">★</span>)}
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed italic">"{TESTIMONIAL.quote}"</p>
                        <div className="flex items-center gap-2 pt-1">
                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                                {TESTIMONIAL.initials}
                            </div>
                            <div>
                                <div className="text-white text-xs font-bold">{TESTIMONIAL.name}</div>
                                <div className="text-white/50 text-xs">{TESTIMONIAL.role}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats bottom */}
                <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                    {STATS.map((s, i) => (
                        <div key={i}>
                            <div
                                className="text-white leading-none mb-1"
                                style={{ fontFamily: "'DM Mono', monospace", fontSize: '22px', letterSpacing: '-0.04em' }}
                            >
                                {s.value}
                            </div>
                            <div className="text-white/40 text-xs">{s.label}</div>
                        </div>
                    ))}
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
                            Criar conta grátis
                        </h1>
                        <p className="text-[rgba(15,14,12,0.5)] text-sm">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="text-[#1A5C3A] font-bold hover:underline">
                                Fazer login
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-[rgba(15,14,12,0.5)] uppercase tracking-wide">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                placeholder="Seu nome ou da empresa"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#F7F7F7] border border-[rgba(15,14,12,0.1)] rounded-xl px-4 py-3 text-[#0F0E0C] text-sm placeholder:text-[rgba(15,14,12,0.3)] outline-none transition-all focus:border-[#1A5C3A] focus:bg-white focus:ring-3 focus:ring-[rgba(26,92,58,0.08)]"
                            />
                        </div>

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
                            <label className="block text-xs font-semibold text-[rgba(15,14,12,0.5)] uppercase tracking-wide">
                                Senha
                            </label>
                            <input
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#F7F7F7] border border-[rgba(15,14,12,0.1)] rounded-xl px-4 py-3 text-[#0F0E0C] text-sm placeholder:text-[rgba(15,14,12,0.3)] outline-none transition-all focus:border-[#1A5C3A] focus:bg-white focus:ring-3 focus:ring-[rgba(26,92,58,0.08)]"
                            />
                        </div>

                        {/* Micro-benefits */}
                        <div className="flex flex-col gap-2 py-1">
                            {[
                                'Plano Free incluído — até 5 produtos',
                                'Sem cartão de crédito necessário',
                            ].map((t, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-[rgba(15,14,12,0.5)]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" />
                                    {t}
                                </div>
                            ))}
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
                                    Criando conta...
                                </span>
                            ) : (
                                <>Começar agora <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-[rgba(15,14,12,0.3)]">
                        Ao criar uma conta você concorda com nossos{' '}
                        <Link to="/terms" className="underline hover:text-[#1A5C3A]">Termos</Link>
                        {' '}e{' '}
                        <Link to="/privacy" className="underline hover:text-[#1A5C3A]">Privacidade</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}