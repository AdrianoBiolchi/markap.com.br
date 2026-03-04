import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Package,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    MousePointer2,
    FileText,
    CheckCircle2,
    Zap,
    Building2
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useBusinessStore } from '../store/useBusinessStore';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { cn } from '../lib/utils';

export default function Dashboard() {
    const { products, fetchProducts, isLoading } = useProductStore();
    const { profile, fetchProfile } = useBusinessStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchProfile();
    }, [fetchProducts, fetchProfile]);

    const isEmpty = products.length === 0;

    const stats = useMemo(() => {
        if (isEmpty) return { avgMargin: 0, healthLabel: 'N/A', healthScore: 0 };
        const totalMargin = products.reduce((acc, p) => acc + (p.netMargin || 0), 0);
        const avgMargin = totalMargin / products.length;
        const totalScore = products.reduce((acc, p) => acc + (p.healthScore || 0), 0);
        const avgScore = totalScore / products.length;

        let label = 'C';
        if (avgScore >= 80) label = 'A';
        else if (avgScore >= 60) label = 'B';
        else if (avgScore >= 40) label = 'C';
        else label = 'D';

        return {
            avgMargin: avgMargin.toFixed(1),
            healthLabel: label,
            healthScore: Math.round(avgScore)
        };
    }, [products, isEmpty]);

    if (isLoading && products.length === 0) {
        return (
            <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-text-secondary font-medium">Carregando seus dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-primary">Dashboard</h1>
                    <p className="text-text-secondary mt-1">
                        {isEmpty
                            ? 'Bem-vindo! Vamos começar sua análise de lucratividade.'
                            : 'Veja o desempenho financeiro dos seus produtos.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => navigate('/business-profile')} variant="outline" className="gap-2 border-border">
                        <Building2 className="w-4 h-4" /> Perfil do Negócio
                    </Button>
                    {!isEmpty && (
                        <Button onClick={() => navigate('/calculator')} className="gap-2">
                            <Plus className="w-4 h-4" /> Novo Produto
                        </Button>
                    )}
                </div>
            </div>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 bg-surface border border-dashed border-border rounded-3xl space-y-6">
                    <div className="w-20 h-20 bg-green-light rounded-full flex items-center justify-center text-green-primary">
                        <Package className="w-10 h-10" />
                    </div>
                    <div className="text-center max-w-sm space-y-2">
                        <h2 className="text-2xl font-bold text-text-primary">Nenhum produto cadastrado</h2>
                        <p className="text-text-secondary">
                            Adicione seu primeiro produto para receber um diagnóstico completo de preço e margem.
                        </p>
                    </div>
                    <Button onClick={() => navigate('/calculator')} size="lg" className="gap-2 shadow-lg shadow-green-primary/20">
                        <Plus className="w-5 h-5" /> Criar Primeiro Produto
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-8 mt-12">
                        <FeatureCard
                            icon={TrendingUp}
                            title="Margem Real"
                            desc="Descubra quanto você realmente ganha após todos os custos."
                        />
                        <FeatureCard
                            icon={AlertCircle}
                            title="Diagnóstico"
                            desc="Alertas automáticos se seu preço estiver baixo demais."
                        />
                        <FeatureCard
                            icon={MousePointer2}
                            title="Simulador"
                            desc="Teste novos preços e veja o impacto no lucro na hora."
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Stats Summary */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard title="Total de Produtos" value={products.length} label="Ativos" />
                            <StatCard title="Margem Média" value={`${stats.avgMargin}%`} label="Geral" trend={Number(stats.avgMargin) > 20 ? 'up' : 'neutral'} />
                            <StatCard title="Saúde Financeira" value={stats.healthLabel} label={`${stats.healthScore}/100`} />
                        </div>

                        {/* Product List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-xl font-bold">Seus Produtos</h3>
                                <button onClick={() => navigate('/calculator')} className="text-sm font-medium text-green-primary hover:underline">Novo Produto</button>
                            </div>
                            <div className="grid gap-4">
                                {products.map((product) => (
                                    <ProductRow key={product.id} product={product} onClick={() => navigate(`/analysis/${product.id}`)} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="bg-green-primary text-white border-none shadow-xl shadow-green-primary/20">
                            <CardContent className="p-6 space-y-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Dica do Especialista</h4>
                                    <p className="text-white/80 text-sm mt-1">
                                        Seus custos fixos atuais representam <strong>{profile?.fixedCostPercentage?.toFixed(1) || 0}%</strong> do faturamento. A meta ideal é manter abaixo de 30%.
                                    </p>
                                </div>
                                <Button onClick={() => navigate('/business-profile')} variant="secondary" className="w-full bg-white text-green-primary border-none hover:bg-white/90">
                                    Revisar Estrutura
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h4 className="font-bold mb-4">Próximos Passos</h4>
                                <div className="space-y-4">
                                    <StepItem icon={CheckCircle2} label="Custos fixos configurados" done={!!profile?.fixedCostPercentage} />
                                    <StepItem icon={Package} label="Atinja 5 produtos" done={products.length >= 5} />
                                    <StepItem icon={Zap} label="Upgrade para o Pro" done={false} highlight />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <div className="p-6 bg-background rounded-2xl space-y-3 border border-border">
            <div className="w-10 h-10 bg-white shadow-sm border border-border rounded-xl flex items-center justify-center text-green-primary">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
        </div>
    );
}

function StatCard({ title, value, label, trend }) {
    return (
        <Card className="p-6">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <div className="flex items-end justify-between mt-2">
                <h4 className="text-3xl font-display font-bold text-text-primary">{value}</h4>
                <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-lg",
                    trend === 'up' ? "bg-green-light text-green-primary" : "bg-gray-100 text-gray-600"
                )}>
                    {label}
                </span>
            </div>
        </Card>
    );
}

function ProductRow({ product, onClick }) {
    const margin = product.netMargin || 0;
    const status = margin > 20 ? 'success' : (margin > 10 ? 'warning' : 'danger');
    const statusLabel = margin > 20 ? 'Saudável' : (margin > 10 ? 'Atenção' : 'Risco');

    return (
        <div
            onClick={onClick}
            className="group flex items-center gap-4 p-4 bg-surface border border-border rounded-2xl hover:border-green-border hover:shadow-sm transition-all cursor-pointer"
        >
            <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-text-secondary group-hover:bg-green-light group-hover:text-green-primary transition-colors">
                <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-text-primary">{product.name || 'Produto Sem Nome'}</h4>
                <p className="text-sm text-text-secondary">{product.category || 'Geral'}</p>
            </div>
            <div className="hidden md:block text-right px-6">
                <p className="text-xs font-medium text-text-secondary uppercase">Margem</p>
                <p className={cn(
                    "font-bold",
                    margin > 20 ? "text-green-primary" : (margin > 10 ? "text-amber" : "text-danger")
                )}>{margin.toFixed(1)}%</p>
            </div>
            <Badge variant={status}>{statusLabel}</Badge>
            <ChevronRight className="w-5 h-5 text-border group-hover:text-green-primary transition-colors" />
        </div>
    );
}

const StepItem = ({ icon: Icon, label, done, highlight }) => (
    <div className="flex items-center gap-3">
        <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center border",
            done ? "bg-green-primary border-green-primary text-white" : "bg-background border-border text-text-secondary",
            highlight && !done && "bg-amber/10 text-amber border-amber/20"
        )}>
            <Icon className="w-3.5 h-3.5" />
        </div>
        <span className={cn(
            "text-sm font-medium",
            done ? "text-text-primary line-through opacity-50" : "text-text-primary",
            highlight && "text-amber"
        )}>
            {label}
        </span>
    </div>
);
