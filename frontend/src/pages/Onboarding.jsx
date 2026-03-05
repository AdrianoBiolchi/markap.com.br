import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Receipt, Package, Target, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Logo } from '../components/ui/Logo';

const QUESTIONS = [
    {
        id: 'businessType',
        icon: Briefcase,
        question: 'Qual o tipo do seu negócio?',
        options: ['E-commerce', 'Loja Física', 'Serviços', 'Indústria/Produção'],
    },
    {
        id: 'taxRegime',
        icon: Receipt,
        question: 'Qual o seu regime tributário?',
        options: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Não sei informar'],
    },
    {
        id: 'volume',
        icon: Package,
        question: 'Quantos produtos você precifica por mês?',
        options: ['Até 10', '11 a 50', '51 a 200', 'Mais de 200'],
    },
    {
        id: 'goal',
        icon: Target,
        question: 'Qual seu principal objetivo com o Markap?',
        options: ['Aumentar Margem', 'Descobrir Preço Ideal', 'Organizar Custos', 'Comparar Concorrentes'],
    },
];

const STEP_LABELS = ['Negócio', 'Tributário', 'Volume', 'Objetivo'];

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    const completeOnboarding = useAuthStore(state => state.completeOnboarding);

    const currentQ = QUESTIONS[step];
    const isLastStep = step === QUESTIONS.length - 1;
    const currentAnswer = answers[currentQ.id];

    const handleSelect = (value) => {
        const newAnswers = { ...answers, [currentQ.id]: value };
        setAnswers(newAnswers);
        if (!isLastStep) {
            setTimeout(() => setStep(step + 1), 280);
        }
    };

    const handleFinish = async () => {
        await completeOnboarding();
        navigate('/dashboard');
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: '#FFFFFF',
        }}>

            {/* PAINEL ESQUERDO — progresso */}
            <div style={{
                width: '340px',
                flexShrink: 0,
                background: '#1A5C3A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px 40px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Grid pattern */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }} />
                <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(rgba(255,255,255,0.05), transparent 70%)', pointerEvents: 'none' }} />

                {/* Logo */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Logo style={{ color: 'white', height: '30px', width: 'auto' }} />
                    </Link>
                </div>

                {/* Steps */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                        Configuração inicial
                    </p>
                    {QUESTIONS.map((q, i) => {
                        const Icon = q.icon;
                        const isDone = i < step;
                        const isActive = i === step;
                        return (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                                border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                                transition: 'all 0.25s',
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: isDone ? '#22C55E' : isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                                    border: isDone ? 'none' : isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
                                    transition: 'all 0.25s',
                                }}>
                                    {isDone
                                        ? <Check size={14} color="#fff" />
                                        : <Icon size={14} color={isActive ? '#fff' : 'rgba(255,255,255,0.35)'} />
                                    }
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : isDone ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)', transition: 'all 0.25s' }}>
                                        {STEP_LABELS[i]}
                                    </div>
                                    {isDone && (
                                        <div style={{ fontSize: '11px', color: '#22C55E', marginTop: '1px' }}>
                                            ✓ {answers[q.id]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Rodapé */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Progresso</div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                            <div style={{ height: '100%', width: `${((step + (currentAnswer ? 1 : 0)) / QUESTIONS.length) * 100}%`, background: '#22C55E', borderRadius: '2px', transition: 'width 0.4s ease' }} />
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                            Passo {step + 1} de {QUESTIONS.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* PAINEL DIREITO — pergunta */}
            <div style={{
                flex: 1,
                alignSelf: 'stretch',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '64px 48px',
                background: '#FFFFFF',
            }}>
                <div style={{ width: '100%', maxWidth: '520px' }}>

                    {/* Pergunta header */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: '#DCFCE7', border: '1px solid rgba(34,197,94,0.25)',
                            borderRadius: '100px', padding: '5px 14px', marginBottom: '20px',
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1A5C3A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                {STEP_LABELS[step]}
                            </span>
                        </div>

                        <h2 style={{
                            fontFamily: "'Fraunces', serif",
                            fontSize: 'clamp(24px, 2.8vw, 36px)',
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            color: '#0F0E0C',
                            lineHeight: 1.1,
                            margin: 0,
                        }}>
                            {currentQ.question}
                        </h2>
                    </div>

                    {/* Opções */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
                        {currentQ.options.map((option) => {
                            const selected = currentAnswer === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '16px 20px',
                                        background: selected ? '#DCFCE7' : '#F7F7F7',
                                        border: selected ? '2px solid #1A5C3A' : '2px solid transparent',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.18s',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        outline: 'none',
                                    }}
                                    onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.background = '#F0FDF4'; e.currentTarget.style.border = '2px solid rgba(26,92,58,0.2)'; } }}
                                    onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.background = '#F7F7F7'; e.currentTarget.style.border = '2px solid transparent'; } }}
                                >
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: selected ? '#1A5C3A' : '#0F0E0C' }}>
                                        {option}
                                    </span>
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                        background: selected ? '#1A5C3A' : 'transparent',
                                        border: selected ? '2px solid #1A5C3A' : '2px solid rgba(15,14,12,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.18s',
                                    }}>
                                        {selected && <Check size={11} color="#fff" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Navegação */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button
                            onClick={handleBack}
                            style={{
                                background: 'none', border: 'none', cursor: step === 0 ? 'default' : 'pointer',
                                fontSize: '14px', fontWeight: 600, color: 'rgba(15,14,12,0.4)',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                opacity: step === 0 ? 0 : 1,
                                transition: 'color 0.15s',
                                padding: '8px 0',
                            }}
                            onMouseEnter={(e) => { if (step > 0) e.currentTarget.style.color = '#0F0E0C'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(15,14,12,0.4)'; }}
                        >
                            ← Voltar
                        </button>

                        {isLastStep && currentAnswer && (
                            <button
                                onClick={handleFinish}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: '#1A5C3A', color: '#fff',
                                    border: 'none', borderRadius: '10px',
                                    padding: '13px 28px',
                                    fontSize: '15px', fontWeight: 700,
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(26,92,58,0.25)',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#2E7D52'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#1A5C3A'; e.currentTarget.style.transform = 'none'; }}
                            >
                                Concluir setup <ArrowRight size={16} />
                            </button>
                        )}

                        {!isLastStep && (
                            <div style={{ fontSize: '13px', color: 'rgba(15,14,12,0.3)', fontWeight: 500 }}>
                                Selecione uma opção para continuar
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
