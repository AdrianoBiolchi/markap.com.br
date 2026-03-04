import { useNavigate } from 'react-router-dom';
import {
    Check,
    Zap,
    Rocket,
    Building2,
    ArrowRight,
    ShieldCheck,
    Smartphone,
    BarChart4,
    Users2
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import { cn } from '../lib/utils';

const plans = [
    {
        id: 'free',
        name: 'Plano Free',
        price: 'R$ 0',
        desc: 'Essencial para quem está começando o negócio.',
        features: ['Até 5 produtos', 'Diagnóstico parcial', 'Simulador de preço', 'Suporte via comunidade'],
        cta: 'Seu plano atual',
        variant: 'outline',
        current: true
    },
    {
        id: 'pro',
        name: 'Plano Pro',
        price: 'R$ 29',
        period: '/mês',
        desc: 'Tudo o que você precisa para escalar com lucro.',
        features: [
            'Produtos ilimitados',
            'Diagnóstico completo IA',
            'Relatórios em PDF/XLS',
            'Análise de mercado',
            'Alertas de risco real'
        ],
        cta: 'Assinar Plano Pro',
        variant: 'primary',
        highlight: true
    },
    {
        id: 'business',
        name: 'Business',
        price: 'R$ 89',
        period: '/mês',
        desc: 'Para empresas com equipe e processos maduros.',
        features: [
            'Multi-usuários',
            'Integrações ERP/Vendas',
            'API de Precificação',
            'Gerente de conta',
            'Suporte prioritário 24/7'
        ],
        cta: 'Falar com Consultor',
        variant: 'secondary'
    }
];

export default function Upgrade() {
    const navigate = useNavigate();

    return (
        <div className="py-20 px-8 max-w-7xl mx-auto space-y-16">
            {/* Hero */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <Badge variant="warning" className="px-4 py-1.5 uppercase tracking-widest font-black">
                    Pare de Deixar Dinheiro na Mesa
                </Badge>
                <h1 className="text-5xl font-display font-bold text-text-primary leading-tight">
                    A precisão que seu caixa precisa, <br />
                    <span className="text-green-primary">no preço que você pode pagar.</span>
                </h1>
                <p className="text-xl text-text-secondary">
                    Escolha o plano ideal para a fase atual do seu negócio e comece a lucrar mais hoje mesmo.
                </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {plans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                ))}
            </div>

            {/* Trust Badges */}
            <div className="pt-20 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <TrustItem icon={ShieldCheck} title="Segurança Total" desc="Seus dados financeiros são criptografados." />
                <TrustItem icon={Rocket} title="Ativação Imediata" desc="Pague e comece a usar as funções Pro na hora." />
                <TrustItem icon={Smartphone} title="Multiplataforma" desc="Acesse pelo celular, tablet ou computador." />
                <TrustItem icon={Users2} title="+2.000 Empresas" desc="Junte-se à maior comunidade de precificação." />
            </div>

            {/* FAQ Preview */}
            <div className="bg-green-light rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md space-y-4">
                    <h3 className="text-3xl font-display font-bold text-green-primary">Ainda com dúvida?</h3>
                    <p className="text-green-primary/80">Nossa equipe de especialistas em finanças está pronta para te ajudar a escolher o melhor caminho.</p>
                </div>
                <Button size="lg" className="h-16 px-10 gap-3 text-lg shadow-xl shadow-green-primary/20">
                    Chamar no WhatsApp <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}

function PlanCard({ plan }) {
    return (
        <Card className={cn(
            "relative p-8 transition-all hover:-translate-y-2 duration-300",
            plan.highlight ? "border-2 border-green-primary shadow-2xl shadow-green-primary/10 ring-8 ring-green-primary/5 scale-105 z-10" : ""
        )}>
            {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-primary text-white text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg">
                    Recomendado
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-text-primary">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-4">
                        <span className="text-4xl font-display font-bold text-text-primary">{plan.price}</span>
                        <span className="text-text-secondary font-medium">{plan.period}</span>
                    </div>
                    <p className="text-text-secondary mt-4 text-sm leading-relaxed">{plan.desc}</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                    {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-light flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-green-primary stroke-[3px]" />
                            </div>
                            <span className="text-sm font-medium text-text-primary">{feature}</span>
                        </div>
                    ))}
                </div>

                <Button
                    variant={plan.variant}
                    className={cn(
                        "w-full h-14 text-lg gap-2",
                        plan.current && "opacity-50 cursor-default"
                    )}
                    disabled={plan.current}
                >
                    {plan.cta} {!plan.current && <ArrowRight className="w-4 h-4" />}
                </Button>
            </div>
        </Card>
    );
}

function TrustItem({ icon: Icon, title, desc }) {
    return (
        <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-text-secondary">
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-text-primary">{title}</h4>
            <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
        </div>
    );
}

function Badge({ children, variant, className }) {
    const styles = {
        warning: 'bg-amber text-white border-none',
        default: 'bg-gray-100 text-gray-700',
    };
    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block", styles[variant] || styles.default, className)}>
            {children}
        </span>
    );
}
