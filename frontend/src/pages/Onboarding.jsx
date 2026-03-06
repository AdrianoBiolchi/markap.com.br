import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Check, ArrowRight } from 'lucide-react';

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

const QUESTIONS = [
    { id: 'type', q: 'Qual o tipo do seu negócio?', opts: ['E-commerce', 'Loja Física', 'Serviços', 'Indústria'] },
    { id: 'regime', q: 'Qual o seu regime tributário?', opts: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Não sei'] },
    { id: 'goal', q: 'Qual seu principal objetivo?', opts: ['Aumentar Margem', 'Organizar Custos', 'Preço Ideal', 'Comparar Mercado'] },
];

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    const completeOnboarding = useAuthStore(state => state.completeOnboarding);

    const handleSelect = (val) => {
        setAnswers({ ...answers, [QUESTIONS[step].id]: val });
        if (step < QUESTIONS.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        }
    };

    const handleFinish = async () => {
        await completeOnboarding(answers);
        navigate('/business-profile');
    };

    const handleSkip = async () => {
        await completeOnboarding(null);
        navigate('/dashboard');
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
                    <div style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
                        {QUESTIONS.map((_, i) => (
                            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? C.yellow : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                        ))}
                    </div>
                    <h2 style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: 'clamp(32px, 3vw, 42px)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        color: C.white,
                        marginBottom: 24,
                    }}>
                        Vamos configurar sua<br />
                        <span style={{ color: C.yellow, fontStyle: 'italic' }}>experiência.</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, maxWidth: 380 }}>
                        Responda 3 perguntas rápidas para que possamos personalizar as ferramentas para o seu modelo de negócio.
                    </p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                        Configuração rápida · 1 min
                    </p>
                    <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Pular por agora
                    </button>
                </div>
            </div>

            {/* PAINEL DIREITO — Pergunta */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: 520 }}>

                    <div style={{ marginBottom: 40 }}>
                        <span style={{ display: 'inline-block', background: C.greenLight, color: C.green, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Passo {step + 1} de {QUESTIONS.length}
                        </span>
                        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 800, color: C.ink, lineHeight: 1.1 }}>
                            {QUESTIONS[step].q}
                        </h1>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
                        {QUESTIONS[step].opts.map(opt => {
                            const isActive = answers[QUESTIONS[step].id] === opt;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => handleSelect(opt)}
                                    style={{
                                        padding: '20px', textAlign: 'left', background: isActive ? C.greenPale : C.white, border: `2px solid ${isActive ? C.green : C.border}`, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}
                                >
                                    <span style={{ fontSize: 16, fontWeight: 600, color: isActive ? C.green : C.ink }}>{opt}</span>
                                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isActive ? C.green : C.border}`, background: isActive ? C.green : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {isActive && <Check size={12} color={C.white} strokeWidth={3} />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            onClick={() => step > 0 && setStep(step - 1)}
                            style={{ background: 'none', border: 'none', color: C.inkMuted, fontSize: 15, fontWeight: 600, cursor: 'pointer', visibility: step > 0 ? 'visible' : 'hidden' }}
                        >
                            ← Voltar
                        </button>

                        {step === QUESTIONS.length - 1 && answers[QUESTIONS[step].id] && (
                            <button
                                onClick={handleFinish}
                                style={{ background: C.green, color: C.white, borderRadius: 12, padding: '14px 28px', fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 18, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                            >
                                Concluir setup <ArrowRight size={20} />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
