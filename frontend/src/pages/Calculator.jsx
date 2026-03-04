import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Save,
    ArrowLeft,
    Info,
    ChevronRight,
    DollarSign,
    Package,
    Building2,
    PieChart,
    Target,
    AlertCircle
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useBusinessStore } from '../store/useBusinessStore';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { cn } from '../lib/utils';
import {
    calcDirectCost,
    calcSuggestedPrice,
    calcNetMargin,
    calcHealthScore,
    calcBreakEven,
    calcVariableExpensesPercent,
    calcPriceComposition
} from '../utils/pricing';

export default function Calculator() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addProduct, updateProduct, isLoading: isSavingProduct } = useProductStore();
    const { profile, fetchProfile, isLoading: isProfileLoading } = useBusinessStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const existingProduct = useMemo(() =>
        products.find(p => p.id === id) || {
            name: '',
            category: '',
            productionCost: 0,
            laborCost: 0,
            packagingCost: 0,
            shippingCost: 0,
            taxRate: 0,
            cardFee: 0,
            commission: 0,
            marketplaceFee: 0,
            desiredMargin: 20,
            expectedVolume: 100,
        }, [id, products]);

    const [formData, setFormData] = useState(existingProduct);

    useEffect(() => {
        if (id && products.length > 0) {
            const p = products.find(p => p.id === id);
            if (p) setFormData(p);
        }
    }, [id, products]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: e.target.type === 'number' ? Number(value) : value
        }));
    };

    // Real-time results
    const results = useMemo(() => {
        const suggestedPrice = calcSuggestedPrice(formData, profile);
        const directCost = calcDirectCost(formData);
        const netMargin = calcNetMargin(formData, profile, suggestedPrice);
        const breakEven = calcBreakEven(profile, formData, suggestedPrice);
        const healthScore = calcHealthScore(netMargin, breakEven, formData.expectedVolume);
        const composition = calcPriceComposition(formData, profile, suggestedPrice);

        return {
            suggestedPrice,
            directCost,
            netMargin,
            breakEven,
            healthScore,
            composition
        };
    }, [formData, profile]);

    const handleSave = async () => {
        let success = false;
        if (id) {
            success = await updateProduct({ ...formData, id, ...results });
        } else {
            success = await addProduct({ ...formData, ...results });
        }

        if (success) {
            navigate('/dashboard');
        }
    };

    const generateExplanation = (directCost, cfPercent, dvPercent, margin, price) => {
        if (!price || price <= 0) return 'Configure os custos para ver a explicação do preço.';
        const cfValue = price * (cfPercent / 100);
        const dvValue = price * (dvPercent / 100);
        const profitValue = price * (margin / 100);
        return `De cada R$ ${price.toFixed(2)} que você receber: 
        R$ ${directCost.toFixed(2)} paga o custo do produto, 
        R$ ${cfValue.toFixed(2)} cobre sua estrutura (aluguel, salários, etc.), 
        R$ ${dvValue.toFixed(2)} vai para impostos e taxas, 
        e R$ ${profitValue.toFixed(2)} fica como lucro seu.`;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface rounded-xl border border-border transition-colors">
                        <ArrowLeft className="w-5 h-5 text-text-secondary" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-text-primary">
                            {id ? 'Editar Produto' : 'Nova Precificação'}
                        </h1>
                        <p className="text-text-secondary mt-1">Configure os custos e margens para encontrar o preço ideal.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={results.healthScore > 70 ? 'success' : 'warning'}>
                        Score de Saúde: {results.healthScore}
                    </Badge>
                    <Button onClick={handleSave} className="gap-2 shadow-lg shadow-green-primary/20" disabled={isSavingProduct}>
                        {isSavingProduct ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {id ? 'Salvar Alterações' : 'Salvar Produto'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Sections */}
                <div className="lg:col-span-2 space-y-8 pb-20">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-text-secondary px-1">
                            <Package className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Identificação</h3>
                        </div>
                        <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                name="name"
                                label="Nome do Produto"
                                placeholder="Ex: Mochila de Couro Premium"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <Input
                                name="category"
                                label="Categoria"
                                placeholder="Ex: Acessórios"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </Card>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-text-secondary px-1">
                            <DollarSign className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Custos Diretos (por unidade)</h3>
                        </div>
                        <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="productionCost" type="number" label="Custo de Produção/Compra" value={formData.productionCost} onChange={handleChange} />
                            <Input name="laborCost" type="number" label="Custo de Mão de Obra" value={formData.laborCost} onChange={handleChange} />
                            <Input name="packagingCost" type="number" label="Embalagem" value={formData.packagingCost} onChange={handleChange} />
                            <Input name="shippingCost" type="number" label="Frete de Compra" value={formData.shippingCost} onChange={handleChange} />
                        </Card>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-text-secondary px-1">
                            <Building2 className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Custos Fixos & Volume</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <span className="text-amber-500 text-xl font-bold">💡</span>
                                <div>
                                    <p className="text-sm font-semibold text-amber-800">
                                        Custos fixos configurados no seu perfil
                                    </p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Aluguel, pró-labore, funcionários e outros custos fixos são cadastrados
                                        uma vez no Perfil do Negócio e aplicados automaticamente em todos os produtos.
                                    </p>
                                    <button onClick={() => navigate('/business-profile')} className="text-xs text-green-700 font-bold underline mt-1 inline-block">
                                        Configurar custos fixos →
                                    </button>
                                </div>
                            </div>
                            <Card className="p-6">
                                <div className="flex items-center justify-between gap-8">
                                    <div className="max-w-xs">
                                        <label className="text-sm font-medium text-text-primary">Qual o volume esperado de vendas/mês?</label>
                                        <p className="text-xs text-text-secondary mt-1">Isso ajuda a calcular o seu ponto de equilíbrio.</p>
                                    </div>
                                    <div className="w-32">
                                        <Input name="expectedVolume" type="number" value={formData.expectedVolume} onChange={handleChange} />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-text-secondary px-1">
                            <PieChart className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Despesas Variáveis & Impostos (%)</h3>
                        </div>
                        <Card className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Input name="taxRate" type="number" label="Impostos" value={formData.taxRate} onChange={handleChange} />
                            <Input name="cardFee" type="number" label="Taxa Cartão" value={formData.cardFee} onChange={handleChange} />
                            <Input name="commission" type="number" label="Comissão" value={formData.commission} onChange={handleChange} />
                            <Input name="marketplaceFee" type="number" label="Taxa Marketp." value={formData.marketplaceFee} onChange={handleChange} />
                        </Card>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-text-secondary px-1">
                            <Target className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Meta de Lucratividade (%)</h3>
                        </div>
                        <Card className="p-6 bg-green-light border-green-border">
                            <div className="flex items-center justify-between gap-8">
                                <div className="flex-1">
                                    <h4 className="font-bold text-green-primary">Quanto de lucro você quer ter NESTE produto?</h4>
                                    <p className="text-sm text-green-primary/70 mt-1">A margem líquida recomendada é entre 15% e 25%.</p>
                                </div>
                                <div className="w-32">
                                    <Input
                                        name="desiredMargin"
                                        type="number"
                                        value={formData.desiredMargin}
                                        onChange={handleChange}
                                        className="border-green-border focus:ring-green-primary"
                                    />
                                </div>
                            </div>
                        </Card>
                    </section>
                </div>

                {/* Results Sticky Panel */}
                <div className="relative">
                    <div className="sticky top-8 space-y-6">
                        {isProfileLoading ? (
                            <Card className="p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
                                <div className="w-12 h-12 bg-surface rounded-full border-4 border-t-green-primary animate-spin" />
                                <p className="text-text-secondary font-medium">Calculando seu lucro...</p>
                            </Card>
                        ) : (
                            <Card className="shadow-2xl border-2 border-green-primary ring-4 ring-green-primary/5">
                                <CardHeader className="bg-green-primary text-white py-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <DollarSign className="w-5 h-5" /> Preço Sugerido
                                    </h3>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="text-center">
                                        <p className="text-text-secondary text-sm font-medium uppercase tracking-widest">Valor de Venda Ideal</p>
                                        <h2 className="text-5xl font-display font-bold text-text-primary mt-2">
                                            R$ {results?.suggestedPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                                        </h2>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border">
                                        {/* Visual Composition Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-text-secondary">
                                                <span>Composição do Preço</span>
                                            </div>
                                            <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner bg-gray-100">
                                                <div style={{ width: `${results?.composition?.directCost || 0}%` }} className="bg-red-400 transition-all duration-500" title="Custo Direto" />
                                                <div style={{ width: `${results?.composition?.fixedCost || 0}%` }} className="bg-amber-400 transition-all duration-500" title="Custo Fixo" />
                                                <div style={{ width: `${results?.composition?.variableExpenses || 0}%` }} className="bg-purple-400 transition-all duration-500" title="Impostos e Taxas" />
                                                <div style={{ width: `${results?.composition?.profit || 0}%` }} className="bg-green-600 transition-all duration-500" title="Lucro" />
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <CompositionRow label="Custo Direto" value={results?.composition?.directCostValue} color="bg-red-400" percent={results?.composition?.directCost} />
                                            <CompositionRow label="Custo Fixo" value={results?.composition?.fixedCostValue} color="bg-amber-400" percent={results?.composition?.fixedCost} />
                                            <CompositionRow label="Impostos + Taxas" value={results?.composition?.variableExpensesValue} color="bg-purple-400" percent={results?.composition?.variableExpenses} />
                                            <CompositionRow label="Seu Lucro" value={results?.composition?.profitValue} color="bg-green-600" percent={results?.composition?.profit} highlight />
                                        </div>
                                    </div>

                                    <div className="bg-background rounded-2xl p-4 flex items-center justify-between border border-border">
                                        <div className="flex items-center gap-2">
                                            <Info className="w-4 h-4 text-text-secondary" />
                                            <span className="text-sm font-medium">Ponto de Equilíbrio</span>
                                        </div>
                                        <span className="font-bold text-text-primary">{results?.breakEven || 0} unidades</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="bg-surface border-border">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-amber-light text-amber rounded-full flex items-center justify-center shrink-0">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Entendendo seu preço</h4>
                                        <p className="text-xs text-text-secondary leading-relaxed mt-1">
                                            {generateExplanation(
                                                results.directCost,
                                                results.composition.fixedCost,
                                                results.composition.variableExpenses,
                                                results.composition.profit,
                                                results.suggestedPrice
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <p className="text-[10px] text-text-secondary italic text-center">
                                        * Lógica baseada na metodologia de Markup Divisor (SEBRAE).
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CompositionRow({ label, value, color, percent, highlight }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", color)} />
                <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">{label} ({percent?.toFixed(1) || '0.0'})%</span>
            </div>
            <span className={cn(
                "font-bold text-xs transition-all",
                highlight ? "text-green-primary text-sm" : "text-text-primary"
            )}>R$ {value?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</span>
        </div>
    );
}
