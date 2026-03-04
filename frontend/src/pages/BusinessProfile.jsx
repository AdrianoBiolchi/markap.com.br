import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    DollarSign,
    TrendingUp,
    Store,
    Users,
    Zap,
    HelpCircle,
    ChevronDown,
    Save,
    CheckCircle2,
    AlertTriangle,
    ArrowLeft
} from 'lucide-react';
import { useBusinessStore } from '../store/useBusinessStore';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { cn } from '../lib/utils';
import { calcFixedCostPercent } from '../utils/pricing';

export default function BusinessProfile() {
    const { profile, fetchProfile, updateProfile, isLoading } = useBusinessStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        monthlyRent: 0,
        ownerSalary: 0,
        employeesCost: 0,
        utilitiesCost: 0,
        accountingCost: 0,
        systemsCost: 0,
        marketingCost: 0,
        otherFixedCosts: 0,
        expectedMonthlyRevenue: 0,
        pricingMode: 'SIMPLE'
    });
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            setFormData({
                monthlyRent: profile.monthlyRent || 0,
                ownerSalary: profile.ownerSalary || 0,
                employeesCost: profile.employeesCost || 0,
                utilitiesCost: profile.utilitiesCost || 0,
                accountingCost: profile.accountingCost || 0,
                systemsCost: profile.systemsCost || 0,
                marketingCost: profile.marketingCost || 0,
                otherFixedCosts: profile.otherFixedCosts || 0,
                expectedMonthlyRevenue: profile.expectedMonthlyRevenue || 0,
                pricingMode: profile.pricingMode || 'SIMPLE'
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: e.target.type === 'number' ? Number(value) : value
        }));
    };

    const handleSave = async () => {
        const success = await updateProfile(formData);
        if (success) {
            navigate('/dashboard');
        }
    };

    const totalFixed =
        formData.monthlyRent +
        formData.ownerSalary +
        formData.employeesCost +
        formData.utilitiesCost +
        formData.accountingCost +
        formData.systemsCost +
        formData.marketingCost +
        formData.otherFixedCosts;

    const cfPercent = calcFixedCostPercent(formData);

    const getStatusInfo = (percent) => {
        if (percent <= 0) return { label: 'Aguardando dados', color: 'text-text-secondary', icon: HelpCircle };
        if (percent <= 30) return { label: 'Boa estrutura de custos', color: 'text-green-primary', icon: CheckCircle2 };
        if (percent <= 50) return { label: 'Custos fixos elevados — considere aumentar o faturamento', color: 'text-amber', icon: AlertTriangle };
        return { label: 'Custos fixos críticos — cada venda já nasce comprometida', color: 'text-danger', icon: AlertTriangle };
    };

    const status = getStatusInfo(cfPercent);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface rounded-xl border border-border transition-colors">
                        <ArrowLeft className="w-5 h-5 text-text-secondary" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-text-primary">Perfil do Negócio</h1>
                        <p className="text-text-secondary mt-1">Configure sua estrutura de custos fixa para precificar corretamente.</p>
                    </div>
                </div>
                <Button onClick={handleSave} className="gap-2 shadow-lg shadow-green-primary/20" disabled={isLoading}>
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Section 1: Fixed Costs */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-text-secondary px-1">
                            <Store className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Custos Fixos Mensais</h3>
                        </div>
                        <Card>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input name="monthlyRent" type="number" label="Aluguel / Sede" value={formData.monthlyRent} onChange={handleChange} />
                                <Input name="ownerSalary" type="number" label="Pró-labore (seu salário)" value={formData.ownerSalary} onChange={handleChange} />
                                <Input name="employeesCost" type="number" label="Funcionários (folha total)" value={formData.employeesCost} onChange={handleChange} />
                                <Input name="utilitiesCost" type="number" label="Energia, Água, Internet" value={formData.utilitiesCost} onChange={handleChange} />
                                <Input name="accountingCost" type="number" label="Contador" value={formData.accountingCost} onChange={handleChange} />
                                <Input name="systemsCost" type="number" label="Sistemas e Softwares" value={formData.systemsCost} onChange={handleChange} />
                                <Input name="marketingCost" type="number" label="Marketing Fixo" value={formData.marketingCost} onChange={handleChange} />
                                <Input name="otherFixedCosts" type="number" label="Outros Custos Fixos" value={formData.otherFixedCosts} onChange={handleChange} />
                            </CardContent>
                            <div className="px-6 py-4 bg-background border-t border-border flex justify-between items-center">
                                <span className="text-sm font-medium text-text-secondary">Total de custos fixos:</span>
                                <span className="text-lg font-bold text-text-primary">R$ {totalFixed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês</span>
                            </div>
                        </Card>
                    </section>

                    {/* Section 2: Revenue */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-text-secondary px-1">
                            <TrendingUp className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Faturamento Previsto</h3>
                        </div>
                        <Card className="p-6 space-y-4">
                            <Input
                                name="expectedMonthlyRevenue"
                                type="number"
                                label="Faturamento total previsto / mês"
                                value={formData.expectedMonthlyRevenue}
                                onChange={handleChange}
                                placeholder="Soma de todos os produtos vendidos"
                            />
                            <p className="text-xs text-text-secondary">
                                Dica: Some o valor esperado de vendas de TODOS os seus produtos juntos.
                            </p>

                            <div className={cn("p-4 rounded-xl border flex items-center gap-3 transition-colors",
                                cfPercent > 50 ? "bg-danger-light border-danger/20" :
                                    cfPercent > 30 ? "bg-warning-light border-warning/20" :
                                        cfPercent > 0 ? "bg-green-light border-green-border" : "bg-surface border-border"
                            )}>
                                <status.icon className={cn("w-5 h-5", status.color)} />
                                <div>
                                    <p className={cn("text-sm font-bold", status.color)}>
                                        Seus custos fixos representam {cfPercent.toFixed(1)}% do seu faturamento previsto
                                    </p>
                                    <p className="text-xs text-text-secondary mt-0.5">{status.label}</p>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Section 3: Advanced Mode */}
                    <section className="space-y-4 border-t border-border pt-8">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium text-sm"
                        >
                            <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
                            Configurações Avançadas
                        </button>

                        {showAdvanced && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <button
                                    onClick={() => setFormData(p => ({ ...p, pricingMode: 'SIMPLE' }))}
                                    className={cn("p-4 rounded-2xl border-2 text-left transition-all space-y-2 relative",
                                        formData.pricingMode === 'SIMPLE' ? "border-green-primary bg-green-light/30" : "border-border hover:border-green-border"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-text-primary">Modo Simples</h4>
                                        <Badge variant="success">Recomendado</Badge>
                                    </div>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        Seus custos fixos são divididos proporcionalmente entre todos os produtos. Mais justo e recomendado.
                                    </p>
                                </button>

                                <button
                                    disabled={true}
                                    className="p-4 rounded-2xl border-2 text-left bg-surface/50 border-border opacity-60 cursor-not-allowed space-y-2 relative grayscale"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-text-primary">Modo Avançado</h4>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-light text-amber text-[10px] font-black uppercase">
                                            <Zap className="w-2.5 h-2.5 fill-amber" /> Plano Pro
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        Defina manualmente o percentual de custo fixo para cada produto.
                                    </p>
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 bg-green-primary text-white space-y-4 shadow-xl shadow-green-primary/20">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Por que isso é importante?</h3>
                        <p className="text-sm text-green-light opacity-90 leading-relaxed">
                            A precificação profissional não "soma" aluguel no preço do produto. Ela entende que cada venda deve "contribuir" com uma parte para pagar a estrutura da empresa.
                        </p>
                        <p className="text-sm text-green-light opacity-90 leading-relaxed">
                            Ao definir seu faturamento faturamento esperado, o Markap garante que o custo fixo seja diluído de forma saudável em todo o seu catálogo.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
