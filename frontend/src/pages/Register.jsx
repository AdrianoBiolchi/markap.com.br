import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Logo } from '../components/ui/Logo';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(email, password, name);
        if (success) {
            navigate('/onboarding');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-display font-bold text-green-primary flex items-center justify-center gap-3">
                        <Logo className="w-48 h-12" />
                    </h1>
                    <p className="text-text-secondary text-lg">Comece a precificar como um profissional hoje.</p>
                </div>

                <Card className="p-8 shadow-2xl border-t-4 border-t-green-primary">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Nome Completo"
                            placeholder="Seu nome ou da empresa"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="E-mail Profissional"
                            placeholder="seu@email.com"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Crie uma Senha"
                            placeholder="Mínimo 8 caracteres"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-primary" />
                                <span>Plano Free incluído (até 5 produtos)</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-primary" />
                                <span>Acesso imediato ao simulador</span>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-danger-light text-danger text-sm font-medium rounded-xl border border-danger/20">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-lg gap-2 shadow-lg shadow-green-primary/20" disabled={isLoading}>
                            {isLoading ? 'Criando Conta...' : 'Começar Agora'} <ArrowRight className="w-4 h-4" />
                        </Button>

                        <p className="text-center text-sm text-text-secondary">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="text-green-primary font-bold hover:underline">
                                Fazer login
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
}
