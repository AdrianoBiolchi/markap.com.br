import { useNavigate, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calculator,
    TrendingUp,
    Zap,
    Settings,
    LogOut,
    ChevronRight,
    Store
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';
import { Logo } from './Logo';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calculator, label: 'Calculadora', path: '/calculator' },
    { icon: Store, label: 'Perfil do Negócio', path: '/business-profile' },
    { icon: TrendingUp, label: 'Análise', path: '/analysis' },
    { icon: Zap, label: 'Upgrade', path: '/upgrade', highlight: true },
];

export default function Sidebar() {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0">
            <div className="p-8">
                <Logo className="w-40 h-10" />
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group',
                            isActive
                                ? 'bg-green-light text-green-primary'
                                : 'text-text-secondary hover:bg-background hover:text-text-primary',
                            item.highlight && !isActive && 'text-amber hover:bg-amber-light'
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5",
                            item.highlight && "text-amber"
                        )} />
                        <span>{item.label}</span>
                        {item.highlight && (
                            <Zap className="w-3 h-3 fill-amber text-amber ml-auto" />
                        )}
                        <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border space-y-2">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                        isActive ? 'bg-background text-text-primary' : 'text-text-secondary hover:bg-background hover:text-text-primary'
                    )}
                >
                    <Settings className="w-5 h-5" />
                    <span>Configurações</span>
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-danger hover:bg-danger-light transition-all cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
}
