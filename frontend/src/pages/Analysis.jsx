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
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { cn } from '../lib/utils';
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
            <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-text-secondary font-medium">Analisando dados...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return <div className="p-8">Produto não encontrado.</div>;
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
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface rounded-xl border border-border transition-colors">
                        <ArrowLeft className="w-5 h-5 text-text-secondary" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-text-primary">Análise Detalhada</h1>
                        <p className="text-text-secondary mt-1">{product.name}</p>
                    </div>
                </div>
                <Badge variant={product.healthScore > 70 ? 'success' : 'danger'} className="px-4 py-1.5 text-sm uppercase">
                    Saúde: {product.healthScore || 0}/100
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Analysis */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Scale className="w-5 h-5 text-green-primary" /> Diagnóstico de Lucratividade
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-medium text-text-secondary">Margem Líquida Atual</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <h2 className={cn(
                                            "text-5xl font-display font-bold",
                                            currentMargin > 15 ? "text-green-primary" : "text-danger"
                                        )}>
                                            {currentMargin.toFixed(1)}%
                                        </h2>
                                        {currentMargin > 15 ? (
                                            <div className="p-1.5 bg-green-light text-green-primary rounded-lg">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                        ) : (
                                            <div className="p-1.5 bg-danger-light text-danger rounded-lg">
                                                <TrendingDown className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Para cada <strong>R$ 100,00</strong> vendidos, restam <strong>R$ {currentMargin.toFixed(2)}</strong> no seu bolso após pagar fornecedores, impostos, taxas e sua parcela dos custos fixos.
                                </p>
                                <div className="p-4 bg-background rounded-2xl flex items-center justify-between border border-border">
                                    <div>
                                        <p className="text-xs font-medium text-text-secondary uppercase">Ponto de Equilíbrio</p>
                                        <p className="font-bold text-text-primary mt-0.5">{currentBreakEven} unidades/mês</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-text-secondary uppercase">Segurança</p>
                                        <p className="font-bold text-green-primary mt-0.5">
                                            {expectedVolume > 0 ? ((1 - (currentBreakEven / expectedVolume)) * 100).toFixed(0) : 0}% de folga
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Insights do Diagnóstico</h4>
                                <div className="space-y-3">
                                    <InsightItem
                                        title="Lógica de Rateio"
                                        text="Seu markup considera o custo fixo como 29% do faturamento previsto."
                                        type="success"
                                        icon={ShieldCheck}
                                    />
                                    <InsightItem
                                        title="Meta de Margem"
                                        text={currentMargin >= 20 ? "Sua lucratividade está alinhada com as melhores práticas do SEBRAE." : "Sua margem está pressionada. Considere rever custos diretos."}
                                        type={currentMargin >= 20 ? "success" : "warning"}
                                        icon={CheckCircle2}
                                    />
                                    <PaywallInsight />
                                    <PaywallInsight />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Advanced Charts Placeholder */}
                    <Card className="p-8 border-dashed bg-background/50 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-surface border border-border rounded-full flex items-center justify-center text-text-secondary">
                            <BarChart3 className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Histórico de Performance</h4>
                            <p className="text-text-secondary max-w-sm mx-auto mt-1">Conecte seu ERP ou planilha para ver a evolução das vendas e margem ao longo do tempo.</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Zap className="w-3 h-3 fill-amber text-amber" /> Disponível no Plano Pro
                        </Button>
                    </Card>
                </div>

                {/* Simulator Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 border-2 border-green-primary/20 shadow-xl shadow-green-primary/5">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                            <Dna className="w-5 h-5 text-green-primary" /> Simulador de Impacto
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-text-primary">Se eu vender por:</label>
                                <div className="relative mt-2">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold">R$</span>
                                    <input
                                        type="number"
                                        value={simPrice}
                                        onChange={(e) => setSimPrice(Number(e.target.value))}
                                        className="w-full h-14 bg-background border-2 border-border focus:border-green-primary rounded-2xl pl-12 pr-4 text-xl font-bold transition-all focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-background rounded-2xl border border-border">
                                    <p className="text-xs font-medium text-text-secondary">Nova Margem</p>
                                    <p className={cn(
                                        "text-2xl font-bold mt-1",
                                        simMargin > 15 ? "text-green-primary" : (simMargin > 0 ? "text-amber" : "text-danger")
                                    )}>
                                        {simMargin.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="p-4 bg-background rounded-2xl border border-border">
                                    <p className="text-xs font-medium text-text-secondary">Novo Break-even</p>
                                    <p className="text-2xl font-bold mt-1 text-text-primary">
                                        {simBreakEven} <span className="text-xs font-normal text-text-secondary">unid.</span>
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-green-light rounded-2xl border border-green-border">
                                <div className="flex items-center justify-between text-sm font-bold text-green-primary">
                                    <span>Impacto no Lucro</span>
                                    <span>{simMargin > currentMargin ? '+' : ''}{(simMargin - currentMargin).toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-2 bg-green-border/50 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-green-primary transition-all duration-500"
                                        style={{ width: `${Math.max(0, Math.min(100, (simMargin / (currentMargin || 1)) * 50))}%` }}
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={() => navigate('/calculator/' + id)}
                                variant="secondary"
                                className="w-full h-12"
                            >
                                Aplicar Novo Preço
                            </Button>
                        </div>
                    </Card>

                    <Card className="bg-amber-light border-amber-border overflow-hidden relative">
                        <Zap className="absolute -right-4 -top-4 w-24 h-24 text-amber/10 rotate-12" />
                        <CardContent className="p-6">
                            <Badge variant="warning" className="mb-4">PLANO FREE</Badge>
                            <h4 className="font-bold text-text-primary">Libere o Diagnóstico Inteligente</h4>
                            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                                Você está perdendo <strong>3 insights valiosos</strong> sobre como reduzir seus custos de embalagem e frete.
                            </p>
                            <Button onClick={() => navigate('/upgrade')} className="w-full mt-6 bg-amber hover:bg-amber/90 text-white border-none gap-2">
                                Migrar para o Pro <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function InsightItem({ title, text, type, icon: Icon }) {
    const styles = {
        warning: 'bg-amber-light border-amber-border text-amber',
        success: 'bg-green-light border-green-border text-green-primary',
        danger: 'bg-danger-light border-danger text-danger',
    };

    return (
        <div className={cn("p-4 rounded-2xl border flex gap-3", styles[type] || 'bg-background border-border')}>
            <div className="shrink-0 mt-0.5">
                {Icon ? <Icon className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div>
                <h5 className="text-sm font-bold">{title}</h5>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

function PaywallInsight() {
    return (
        <div className="p-4 rounded-2xl border border-border bg-background/50 flex gap-3 opacity-60 font-serif">
            <div className="shrink-0 mt-0.5 text-text-secondary">
                <Lock className="w-4 h-4" />
            </div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded-md w-full animate-pulse" />
            </div>
        </div>
    );
}
