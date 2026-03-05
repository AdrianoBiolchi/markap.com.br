import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Zap,
    Lock,
    ArrowRight,
    BarChart3,
    Dna,
    Scale,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useBusinessStore } from '../store/useBusinessStore';
import { calcNetMargin, calcBreakEven } from '../utils/pricing';

export default function Analysis() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, fetchProducts, isLoading: isProductsLoading } = useProductStore();
    const { profile, fetchProfile, isLoading: isProfileLoading } = useBusinessStore();

    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
        fetchProfile();
    }, [products.length, fetchProducts, fetchProfile]);

    const product = products.find(p => p.id === id) || products[0];

    const [simPrice, setSimPrice] = useState(0);

    useEffect(() => {
        if (product) {
            setSimPrice(Number(product.suggestedPrice || product.suggested_price) || 0);
        }
    }, [product]);

    if (isProductsLoading || isProfileLoading || (!product && products.length === 0)) {
        return (
            <div style={{
                padding: '48px 56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                backgroundColor: '#FFFFFF',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid #1A5C3A',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ color: '#6B7280', fontWeight: '500' }}>Analisando dados...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!product) {
        return <div style={{ padding: '48px 56px', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Produto não encontrado.</div>;
    }

    const simMargin = useMemo(() => {
        return calcNetMargin(product, profile, simPrice);
    }, [product, profile, simPrice]);

    const simBreakEven = useMemo(() => {
        return calcBreakEven(profile, product, simPrice);
    }, [product, profile, simPrice]);

    const currentMargin = product.netMargin || 0;
    const currentBreakEven = product.breakEven || 0;
    const expectedVolume = product.expectedVolume || 100;

    return (
        <div style={{
            padding: '48px 56px',
            backgroundColor: '#FFFFFF',
            minHeight: '100vh',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F3F4F6',
                            border: '1px solid #E5E7EB',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            color: '#6B7280'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '800',
                            fontFamily: '"Fraunces", serif',
                            color: '#0F0E0C',
                            letterSpacing: '-0.02em',
                            margin: 0,
                            marginBottom: '4px'
                        }}>
                            Análise Detalhada
                        </h1>
                        <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>{product.name}</p>
                    </div>
                </div>
                <div style={{
                    padding: '8px 20px',
                    borderRadius: '50px',
                    backgroundColor: product.healthScore > 70 ? 'rgba(26, 92, 58, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                    color: product.healthScore > 70 ? '#1A5C3A' : '#DC2626',
                    fontSize: '14px',
                    fontWeight: '800',
                    textTransform: 'uppercase'
                }}>
                    Saúde: {product.healthScore || 0}/100
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
                {/* Main Analysis Column */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '40px' }}>

                    <FormCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <Scale size={20} color="#1A5C3A" />
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F0E0C', margin: 0 }}>Diagnóstico de Lucratividade</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>Margem Líquida Atual</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <h2 style={{
                                            fontSize: '56px',
                                            fontWeight: '800',
                                            fontFamily: '"DM Mono", monospace',
                                            color: currentMargin > 15 ? '#1A5C3A' : '#DC2626',
                                            margin: 0,
                                            letterSpacing: '-0.04em'
                                        }}>
                                            {currentMargin.toFixed(1)}%
                                        </h2>
                                        <div style={{
                                            padding: '8px',
                                            backgroundColor: currentMargin > 15 ? 'rgba(26, 92, 58, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                            color: currentMargin > 15 ? '#1A5C3A' : '#DC2626',
                                            borderRadius: '10px'
                                        }}>
                                            {currentMargin > 15 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                                        </div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', margin: 0 }}>
                                    Para cada <strong>R$ 100,00</strong> vendidos, restam <strong>R$ {currentMargin.toFixed(2)}</strong> no seu bolso após pagar fornecedores, impostos, taxas e sua parcela dos custos fixos.
                                </p>
                                <div style={{
                                    padding: '20px',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '16px',
                                    border: '1px solid #E5E7EB',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px', margin: 0 }}>Ponto de Equilíbrio</p>
                                        <p style={{ fontSize: '15px', fontWeight: '800', color: '#0F0E0C', margin: 0 }}>{currentBreakEven} unidades/mês</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px', margin: 0 }}>Margem de Segurança</p>
                                        <p style={{ fontSize: '15px', fontWeight: '800', color: '#1A5C3A', margin: 0 }}>
                                            {expectedVolume > 0 ? ((1 - (currentBreakEven / expectedVolume)) * 100).toFixed(0) : 0}% de folga
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Insights do Diagnóstico</h4>
                                <InsightItem
                                    title="Lógica de Rateio"
                                    text="Seu markup considera proporcionalmente sua estrutura de custos fixa configurada."
                                    type="success"
                                    icon={ShieldCheck}
                                />
                                <InsightItem
                                    title="Meta de Margem"
                                    text={currentMargin >= 20 ? "Sua lucratividade está alinhada com as melhores práticas de mercado." : "Sua margem está pressionada. Considere rever custos diretos ou aumentar o preço."}
                                    type={currentMargin >= 20 ? "success" : "warning"}
                                    icon={CheckCircle2}
                                />
                                <PaywallInsight />
                                <PaywallInsight />
                            </div>
                        </div>
                    </FormCard>

                    {/* Chart Placeholder */}
                    <div style={{
                        padding: '64px 32px',
                        backgroundColor: '#F9FAFB',
                        border: '2px dashed #E5E7EB',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '24px'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9CA3AF'
                        }}>
                            <BarChart3 size={32} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#0F0E0C', margin: 0, marginBottom: '8px' }}>Histórico de Performance</h4>
                            <p style={{ fontSize: '14px', color: '#6B7280', maxWidth: '380px', margin: 0 }}>Conecte seu ERP ou planilha para ver a evolução das vendas e margem ao longo do tempo.</p>
                        </div>
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '50px',
                            fontSize: '13px',
                            fontWeight: '700',
                            color: '#0F0E0C',
                            cursor: 'pointer'
                        }}>
                            <Zap size={14} fill="#D97706" color="#D97706" />
                            Disponível no Plano Pro
                        </button>
                    </div>
                </div>

                {/* Simulator Column */}
                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{
                        padding: '32px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid rgba(26, 92, 58, 0.2)',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                            <Dna size={20} color="#1A5C3A" />
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F0E0C', margin: 0 }}>Simulador de Impacto</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Se eu vender por:</label>
                                <div style={{ position: 'relative', marginTop: '12px' }}>
                                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#9CA3AF' }}>R$</span>
                                    <input
                                        type="number"
                                        value={simPrice}
                                        onChange={(e) => setSimPrice(Number(e.target.value))}
                                        style={{
                                            width: '100%',
                                            height: '64px',
                                            backgroundColor: '#F9FAFB',
                                            border: '2px solid #E5E7EB',
                                            borderRadius: '16px',
                                            paddingLeft: '50px',
                                            paddingRight: '20px',
                                            fontSize: '24px',
                                            fontWeight: '800',
                                            fontFamily: '"DM Mono", monospace',
                                            color: '#0F0E0C',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1A5C3A'}
                                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '8px', margin: 0 }}>Nova Margem</p>
                                    <p style={{
                                        fontSize: '20px',
                                        fontWeight: '800',
                                        fontFamily: '"DM Mono", monospace',
                                        color: simMargin > 15 ? '#1A5C3A' : (simMargin > 0 ? '#D97706' : '#DC2626'),
                                        margin: 0
                                    }}>
                                        {simMargin.toFixed(1)}%
                                    </p>
                                </div>
                                <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '8px', margin: 0 }}>Novo Break-even</p>
                                    <p style={{ fontSize: '20px', fontWeight: '800', fontFamily: '"DM Mono", monospace', color: '#0F0E0C', margin: 0 }}>
                                        {simBreakEven} <span style={{ fontSize: '12px', fontWeight: '500', color: '#9CA3AF' }}>unid.</span>
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                padding: '20px',
                                backgroundColor: 'rgba(26, 92, 58, 0.05)',
                                borderRadius: '16px',
                                border: '1px solid rgba(26, 92, 58, 0.1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#1A5C3A' }}>Impacto no Lucro</span>
                                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#1A5C3A' }}>{simMargin > currentMargin ? '+' : ''}{(simMargin - currentMargin).toFixed(1)}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(26, 92, 58, 0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        backgroundColor: '#1A5C3A',
                                        width: `${Math.max(0, Math.min(100, (simMargin / (currentMargin || 1)) * 50))}%`,
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                            </div>

                            <PrimaryButton
                                onClick={() => navigate('/calculator/' + id)}
                                label="Aplicar Novo Preço"
                                variant="secondary"
                            />
                        </div>
                    </div>

                    <div style={{
                        padding: '32px',
                        backgroundColor: 'rgba(217, 119, 6, 0.1)',
                        borderRadius: '24px',
                        border: '1px solid rgba(217, 119, 6, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Zap size={80} style={{ position: 'absolute', right: '-20px', top: '-10px', color: 'rgba(217, 119, 6, 0.1)', transform: 'rotate(15deg)' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                backgroundColor: '#D97706',
                                color: '#FFFFFF',
                                borderRadius: '50px',
                                fontSize: '10px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                marginBottom: '16px'
                            }}>Plano Free</span>
                            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0F0E0C', margin: 0, marginBottom: '8px' }}>Diagnóstico Inteligente</h4>
                            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5', margin: 0, marginBottom: '24px' }}>
                                Você está perdendo <strong>3 insights valiosos</strong> sobre como reduzir seus custos de embalagem e frete.
                            </p>
                            <button
                                onClick={() => navigate('/upgrade')}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    backgroundColor: '#D97706',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '14px',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#b45309'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#D97706'}
                            >
                                Migrar para o Pro <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Internal Styled Components
function FormCard({ children }) {
    return (
        <div style={{
            padding: '32px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            {children}
        </div>
    );
}

function PrimaryButton({ onClick, label, variant = 'primary' }) {
    const isPrimary = variant === 'primary';
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: '100%',
                padding: '16px 24px',
                fontSize: '15px',
                fontWeight: '700',
                color: isPrimary ? '#FFFFFF' : '#1A5C3A',
                backgroundColor: isPrimary
                    ? (isHovered ? '#154a2f' : '#1A5C3A')
                    : (isHovered ? 'rgba(26, 92, 58, 0.1)' : 'rgba(26, 92, 58, 0.05)'),
                border: isPrimary ? 'none' : '1px solid rgba(26, 92, 58, 0.2)',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
            }}
        >
            {label}
        </button>
    );
}

function InsightItem({ title, text, type, icon: Icon }) {
    const colors = {
        success: { bg: 'rgba(26, 92, 58, 0.1)', color: '#1A5C3A', border: 'rgba(26, 92, 58, 0.15)' },
        warning: { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', border: 'rgba(217, 119, 6, 0.15)' },
        danger: { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', border: 'rgba(220, 38, 38, 0.15)' },
    };

    const style = colors[type] || { bg: '#F9FAFB', color: '#6B7280', border: '#E5E7EB' };

    return (
        <div style={{
            padding: '16px',
            backgroundColor: style.bg,
            border: `1px solid ${style.border}`,
            borderRadius: '16px',
            display: 'flex',
            gap: '12px'
        }}>
            <div style={{ marginTop: '2px', color: style.color }}>
                {Icon ? <Icon size={16} /> : <CheckCircle2 size={16} />}
            </div>
            <div>
                <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#0F0E0C', margin: 0, marginBottom: '2px' }}>{title}</h5>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>{text}</p>
            </div>
        </div>
    );
}

function PaywallInsight() {
    return (
        <div style={{
            padding: '16px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            display: 'flex',
            gap: '12px',
            opacity: 0.6
        }}>
            <div style={{ marginTop: '2px', color: '#9CA3AF' }}>
                <Lock size={16} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ height: '12px', backgroundColor: '#E5E7EB', borderRadius: '4px', width: '60%', marginBottom: '8px' }} />
                <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', width: '90%' }} />
            </div>
        </div>
    );
}
