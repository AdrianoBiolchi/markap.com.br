import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Receipt,
    Package,
    Target,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

const questions = [
    {
        id: 'businessType',
        question: 'Qual o tipo do seu negócio?',
        icon: Briefcase,
        options: ['E-commerce', 'Loja Física', 'Serviços', 'Indústria/Produção', 'Outro'],
    },
    {
        id: 'taxRegime',
        question: 'Qual o seu regime tributário?',
        icon: Receipt,
        options: ['Simples Nacional', 'Lucro Presumido', 'MEI', 'Não sei informar'],
    },
    {
        id: 'volume',
        question: 'Qual seu volume médio de produtos/mês?',
        icon: Package,
        options: ['Até 10', '11 a 50', '51 a 200', 'Mais de 200'],
    },
    {
        id: 'goal',
        question: 'Qual seu principal objetivo com o Markap?',
        icon: Target,
        options: ['Aumentar Margem', 'Descobrir Preço Ideal', 'Organizar Custos', 'Comparar com Concorrentes'],
    },
];

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    const completeOnboarding = useAuthStore(state => state.completeOnboarding);

    const handleSelect = (id, value) => {
        setAnswers({ ...answers, [id]: value });
        if (step < questions.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        }
    };

    const handleFinish = async () => {
        await completeOnboarding();
        navigate('/business-profile');
    };

    const currentQ = questions[step];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="max-w-2xl w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-light border border-green-border text-green-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Configuração Inicial
                    </div>
                    <h1 className="text-4xl font-display font-bold text-text-primary">
                        Vamos preparar seu <span className="text-green-primary">Markap</span>
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Responda a estas 4 perguntas para personalizarmos sua experiência.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 h-1.5 w-full bg-border rounded-full overflow-hidden">
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 transition-all duration-500",
                                i <= step ? "bg-green-primary" : "bg-transparent"
                            )}
                        />
                    ))}
                </div>

                {/* Question Card */}
                <Card className="p-8 shadow-xl border-t-4 border-t-green-primary">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-light rounded-2xl flex items-center justify-center text-green-primary">
                                <currentQ.icon className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-semibold text-text-primary">
                                {currentQ.question}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQ.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleSelect(currentQ.id, option)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all group",
                                        answers[currentQ.id] === option
                                            ? "border-green-primary bg-green-light/30 text-green-primary ring-2 ring-green-primary/10"
                                            : "border-border hover:border-green-border hover:bg-background text-text-secondary hover:text-text-primary"
                                    )}
                                >
                                    <span className="font-medium">{option}</span>
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                        answers[currentQ.id] === option
                                            ? "border-green-primary bg-green-primary text-white"
                                            : "border-border group-hover:border-green-border"
                                    )}>
                                        {answers[currentQ.id] === option && <CheckCircle2 className="w-3 h-3" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="pt-6 flex items-center justify-between">
                            <button
                                onClick={() => setStep(Math.max(0, step - 1))}
                                className={cn(
                                    "text-text-secondary hover:text-text-primary font-medium transition-colors",
                                    step === 0 && "opacity-0 pointer-events-none"
                                )}
                            >
                                Voltar
                            </button>

                            {step === questions.length - 1 && answers[currentQ.id] ? (
                                <Button onClick={handleFinish} className="gap-2">
                                    Concluir Setup <ArrowRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <div className="text-sm text-text-secondary font-medium">
                                    Passo {step + 1} de {questions.length}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
