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
import AppShell from '../components/AppShell';

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
        <AppShell
            pageTitle="Planos Markap"
            pageSubtitle="Escolha o plano ideal para escalar seu lucro."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', maxWidth: '1000px', margin: '0 auto', paddingTop: '40px' }}>

                {/* Plans Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px',
                    alignItems: 'start'
                }}>
                    {plans.map((plan) => (
                        <div key={plan.id} style={{
                            position: 'relative',
                            padding: '32px',
                            backgroundColor: '#FFFFFF',
                            border: plan.highlight ? '2px solid #1A5C3A' : '1px solid #E5E7EB',
                            borderRadius: '24px',
                            boxShadow: plan.highlight ? '0 30px 60px rgba(26, 92, 58, 0.15)' : 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            {plan.highlight && (
                                <div style={{
                                    position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
                                    backgroundColor: '#1A5C3A', color: '#FFF', fontSize: '10px', fontWeight: '900',
                                    textTransform: 'uppercase', padding: '6px 16px', borderRadius: '50px'
                                }}>
                                    Recomendado
                                </div>
                            )}
                            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{plan.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                                <span style={{ fontSize: '32px', fontWeight: '800', fontFamily: '"Fraunces"' }}>{plan.price}</span>
                                <span style={{ fontSize: '14px', color: '#6B7280' }}>{plan.period}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '24px', marginBottom: '32px' }}>
                                {plan.features.map(f => (
                                    <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', color: '#374151' }}>
                                        <Check size={14} color="#1A5C3A" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                            <button style={{
                                width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
                                background: plan.current ? '#F3F4F6' : (plan.variant === 'primary' ? '#1A5C3A' : '#F7F7F7'),
                                color: plan.current ? '#9CA3AF' : (plan.variant === 'primary' ? '#FFF' : '#1A5C3A'),
                                fontWeight: '700', cursor: plan.current ? 'default' : 'pointer'
                            }}>
                                {plan.cta}
                            </button>
                        </div>
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
                    <TrustItem icon={ShieldCheck} title="Segurança Total" desc="Seus dados financeiros criptografados." />
                    <TrustItem icon={Rocket} title="Ativação Imediata" desc="Pague e use Pro na hora." />
                    <TrustItem icon={Smartphone} title="Multiplataforma" desc="Acesse por qualquer dispositivo." />
                    <TrustItem icon={Users2} title="+2.000 Empresas" desc="Junte-se à maior comunidade." />
                </div>
            </div>
        </AppShell>
    );
}

function TrustItem({ icon: Icon, title, desc }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
            <div style={{
                width: '48px', height: '48px', backgroundColor: '#F9FAFB', borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280'
            }}>
                <Icon size={20} />
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>{title}</h4>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{desc}</p>
        </div>
    );
}
