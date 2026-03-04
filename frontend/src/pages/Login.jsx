import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { Logo } from '../components/ui/Logo';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-light border border-green-border text-green-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <Badge variant="success" className="bg-white border-green-border">SaaS Premiado</Badge>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-green-primary flex items-center justify-center gap-3">
                        <Logo className="w-48 h-12" />
                    </h1>
                    <p className="text-text-secondary text-lg">Bem-vindo de volta! Entre para gerenciar seu lucro.</p>
                </div>

                <Card className="p-8 shadow-2xl border-t-4 border-t-green-primary">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="E-mail"
                            placeholder="seu@email.com"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="space-y-1">
                            <Input
                                label="Senha"
                                placeholder="••••••••"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="text-right">
                                <button type="button" className="text-xs font-medium text-green-primary hover:underline">Esqueceu a senha?</button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-danger-light text-danger text-sm font-medium rounded-xl border border-danger/20">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-lg gap-2 shadow-lg shadow-green-primary/20" disabled={isLoading}>
                            {isLoading ? 'Carregando...' : 'Entrar no Painel'} <ArrowRight className="w-4 h-4" />
                        </Button>

                        <p className="text-center text-sm text-text-secondary">
                            Ainda não tem conta?{' '}
                            <Link to="/register" className="text-green-primary font-bold hover:underline">
                                Criar conta grátis
                            </Link>
                        </p>
                    </form>
                </Card>

                <div className="text-center text-xs text-text-secondary opacity-50 space-y-1">
                    <p>© 2024 Markap - Todos os direitos reservados.</p>
                    <p>Seus dados estão protegidos por criptografia de ponta a ponta.</p>
                </div>
            </div>
        </div>
    );
}
