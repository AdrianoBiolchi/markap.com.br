import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Lock,
    ArrowRight,
    BarChart3,
    Dna,
    Scale,
    ShieldCheck,
    CheckCircle2,
    Zap
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useBusinessStore } from '../store/useBusinessStore';
import { calcNetMargin, calcBreakEven } from '../utils/pricing';
import AppShell from '../components/AppShell';

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
            <AppShell pageTitle="Análise Detalhada" pageSubtitle="Carregando dados...">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '60px 0' }}>
                    <div style={{
                        width: '48px', height: '48px', border: '4px solid #1A5C3A',
                        borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </AppShell>
        );
    }

    if (!product) {
        return <AppShell pageTitle="Análise Detalhada">Produto não encontrado.</AppShell>;
    }

    const simMargin = useMemo(() => calcNetMargin(product, profile, simPrice), [product, profile, simPrice]);
    const simBreakEven = useMemo(() => calcBreakEven(profile, product, simPrice), [product, profile, simPrice]);
    const currentMargin = product.netMargin || 0;
    const expectedVolume = product.expectedVolume || 100;
    const currentBreakEven = product.breakEven || 0;

    return (
        <AppShell
            pageTitle="Análise Detalhada"
            pageSubtitle={product.name}
            topBarContent={
                <div style={{
                    padding: '4px 12px', borderRadius: '50px',
                    backgroundColor: product.healthScore > 70 ? 'rgba(26, 92, 58, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                    color: product.healthScore > 70 ? '#1A5C3A' : '#DC2626',
                    fontSize: '10px', fontWeight: '800'
                }}>
                    Saúde: {product.healthScore || 0}/100
                </div>
            }
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ padding: '32px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <Scale size={20} color="#1A5C3A" />
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F0E0C', margin: 0 }}>Diagnóstico de Lucratividade</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>Margem Líquida Atual</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <h2 style={{ fontSize: '56px', fontWeight: '800', fontFamily: '"DM Mono"', color: currentMargin > 15 ? '#1A5C3A' : '#DC2626', margin: 0 }}>
                                        {currentMargin.toFixed(1)}%
                                    </h2>
                                    {currentMargin > 15 ? <TrendingUp size={24} color="#1A5C3A" /> : <TrendingDown size={24} color="#DC2626" />}
                                </div>
                                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', marginTop: '16px' }}>
                                    Para cada R$ 100,00 vendidos, restam R$ {currentMargin.toFixed(2)} após todas as despesas.
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <InsightItem title="Lógica de Rateio" type="success" text="Seu markup considera proporcionalmente sua estrutura fixa." />
                                <InsightItem
                                    title="Meta de Margem"
                                    type={currentMargin >= 20 ? "success" : "warning"}
                                    text={currentMargin >= 20 ? "Alinhada com boas práticas." : "Margem pressionada. Revise custos."}
                                />
                                <PaywallInsight />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ padding: '32px', backgroundColor: '#FFFFFF', border: '2px solid rgba(26, 92, 58, 0.2)', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F0E0C', marginBottom: '24px' }}>Simulador</h3>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '13px', color: '#6B7280' }}>Se eu vender por:</label>
                            <input
                                type="number"
                                value={simPrice}
                                onChange={e => setSimPrice(Number(e.target.value))}
                                style={{ width: '100%', height: '56px', fontSize: '24px', fontWeight: '800', fontFamily: '"DM Mono"', border: '2px solid #E5E7EB', borderRadius: '12px', padding: '0 16px', marginTop: '8px' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px' }}>
                                <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase' }}>Nova Margem</p>
                                <p style={{ fontSize: '18px', fontWeight: '800', color: simMargin > 15 ? '#1A5C3A' : '#DC2626' }}>{simMargin.toFixed(1)}%</p>
                            </div>
                            <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px' }}>
                                <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase' }}>Equilíbrio</p>
                                <p style={{ fontSize: '18px', fontWeight: '800' }}>{simBreakEven} un</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/calculator/' + id)}
                            style={{ width: '100%', padding: '16px', background: '#1A5C3A', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                        >
                            Aplicar Novo Preço
                        </button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

function InsightItem({ title, text, type }) {
    const color = type === 'success' ? '#1A5C3A' : '#D97706';
    return (
        <div style={{ padding: '16px', background: type === 'success' ? 'rgba(26, 92, 58, 0.05)' : 'rgba(217, 119, 6, 0.05)', borderRadius: '12px', border: `1px solid ${color}22` }}>
            <h5 style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>{title}</h5>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0' }}>{text}</p>
        </div>
    );
}

function PaywallInsight() {
    return (
        <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', opacity: 0.5, display: 'flex', border: '1px solid #E5E7EB', alignItems: 'center', gap: '8px' }}>
            <Lock size={14} />
            <div style={{ flex: 1, height: '8px', background: '#E5E7EB', borderRadius: '4px' }} />
        </div>
    );
}
