import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
        <div style={{
            padding: '48px 56px',
            backgroundColor: '#FFFFFF',
            minHeight: '100vh',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '64px'
        }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', margin: '0 auto', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                    <span style={{
                        padding: '8px 24px',
                        backgroundColor: '#D97706',
                        color: '#FFFFFF',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        Pare de Deixar Dinheiro na Mesa
                    </span>
                </div>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    fontFamily: '"Fraunces", serif',
                    color: '#0F0E0C',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1',
                    margin: 0
                }}>
                    A precisão que seu caixa precisa, <br />
                    <span style={{ color: '#1A5C3A' }}>no preço que você pode pagar.</span>
                </h1>
                <p style={{ fontSize: '20px', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>
                    Escolha o plano ideal para a fase atual do seu negócio e comece a lucrar mais hoje mesmo.
                </p>
            </div>

            {/* Plans Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '32px',
                alignItems: 'start'
            }}>
                {plans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                ))}
            </div>

            {/* Trust Badges */}
            <div style={{
                paddingTop: '64px',
                borderTop: '1px solid #E5E7EB',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '32px'
            }}>
                <TrustItem icon={ShieldCheck} title="Segurança Total" desc="Seus dados financeiros são criptografados." />
                <TrustItem icon={Rocket} title="Ativação Imediata" desc="Pague e comece a usar as funções Pro na hora." />
                <TrustItem icon={Smartphone} title="Multiplataforma" desc="Acesse pelo celular, tablet ou computador." />
                <TrustItem icon={Users2} title="+2.000 Empresas" desc="Junte-se à maior comunidade de precificação." />
            </div>

            {/* FAQ Preview */}
            <div style={{
                backgroundColor: 'rgba(26, 92, 58, 0.05)',
                borderRadius: '32px',
                padding: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '32px',
                border: '1px solid rgba(26, 92, 58, 0.1)'
            }}>
                <div style={{ maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '32px', fontWeight: '800', fontFamily: '"Fraunces", serif', color: '#1A5C3A', margin: 0 }}>Ainda com dúvida?</h3>
                    <p style={{ fontSize: '18px', color: '#1A5C3A', opacity: 0.8, margin: 0 }}>Nossa equipe de especialistas em finanças está pronta para te ajudar a escolher o melhor caminho.</p>
                </div>
                <button style={{
                    padding: '20px 40px',
                    backgroundColor: '#1A5C3A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 20px 40px rgba(26, 92, 58, 0.2)',
                    transition: 'all 0.2s ease'
                }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    Chamar no WhatsApp <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}

function PlanCard({ plan }) {
    const isHighlighted = plan.highlight;
    return (
        <div style={{
            position: 'relative',
            padding: '40px',
            backgroundColor: '#FFFFFF',
            border: isHighlighted ? '2px solid #1A5C3A' : '1px solid #E5E7EB',
            borderRadius: '24px',
            boxShadow: isHighlighted ? '0 30px 60px rgba(26, 92, 58, 0.15)' : '0 4px 6px rgba(0,0,0,0.02)',
            transform: isHighlighted ? 'scale(1.05)' : 'none',
            zIndex: isHighlighted ? 10 : 1,
            transition: 'all 0.3s ease'
        }}>
            {isHighlighted && (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#1A5C3A',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    padding: '6px 20px',
                    borderRadius: '50px',
                    letterSpacing: '0.15em',
                    boxShadow: '0 10px 20px rgba(26, 92, 58, 0.2)'
                }}>
                    Recomendado
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0F0E0C', margin: 0 }}>{plan.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '16px' }}>
                        <span style={{ fontSize: '40px', fontWeight: '800', fontFamily: '"Fraunces", serif', color: '#0F0E0C' }}>{plan.price}</span>
                        {plan.period && <span style={{ fontSize: '16px', fontWeight: '600', color: '#6B7280' }}>{plan.period}</span>}
                    </div>
                    <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '16px', lineHeight: '1.6', margin: 0 }}>{plan.desc}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '32px', borderTop: '1px solid #E5E7EB' }}>
                    {plan.features.map((feature) => (
                        <div key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(26, 92, 58, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '2px'
                            }}>
                                <Check size={12} color="#1A5C3A" strokeWidth={3} style={{ margin: 'auto' }} />
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F0E0C' }}>{feature}</span>
                        </div>
                    ))}
                </div>

                <PrimaryButton
                    label={plan.cta}
                    variant={plan.variant === 'primary' ? 'primary' : 'secondary'}
                    disabled={plan.current}
                    icon={!plan.current && <ArrowRight size={18} />}
                />
            </div>
        </div>
    );
}

function PrimaryButton({ onClick, label, variant = 'primary', disabled = false, icon }) {
    const isPrimary = variant === 'primary';
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => !disabled && setIsHovered(false)}
            style={{
                width: '100%',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '700',
                color: isPrimary ? '#FFFFFF' : (disabled ? '#9CA3AF' : '#1A5C3A'),
                backgroundColor: isPrimary
                    ? (isHovered ? '#154a2f' : '#1A5C3A')
                    : (isHovered ? 'rgba(26, 92, 58, 0.1)' : 'rgba(26, 92, 58, 0.05)'),
                border: isPrimary ? 'none' : `1px solid ${disabled ? '#E5E7EB' : 'rgba(26, 92, 58, 0.2)'}`,
                borderRadius: '14px',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
            }}
        >
            {label} {icon}
        </button>
    );
}

function TrustItem({ icon: Icon, title, desc }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
            <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#F9FAFB',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280'
            }}>
                <Icon size={24} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0F0E0C', margin: 0 }}>{title}</h4>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>{desc}</p>
        </div>
    );
}
