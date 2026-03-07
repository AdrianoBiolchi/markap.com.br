import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    LayoutDashboard,
    Calculator,
    TrendingUp,
    Zap,
    Store,
    LogOut,
    Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calculator, label: 'Engenharia de Preço', path: '/precificar' },
    { icon: Store, label: 'Perfil do Negócio', path: '/business-profile' },
    { icon: TrendingUp, label: 'Análise (Beta)', path: '/analysis' },
    { icon: Zap, label: 'Fazer Upgrade', path: '/upgrade', highlight: true },
];

export default function Sidebar() {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((state) => state.user);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{
            width: '320px',
            backgroundColor: '#1A5C3A',
            padding: '24px 24px 40px 24px',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            {/* Logo */}
            <div style={{ padding: '0 0 32px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }}>
                <span style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 900,
                    fontSize: 24,
                    color: '#FFFFFF',
                    letterSpacing: '-0.03em',
                }}>
                    Mark<em style={{ fontStyle: 'italic', color: '#FFF176', fontWeight: 900 }}>ap</em>
                </span>
                <p style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginTop: 2,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    margin: 0
                }}>Precificação inteligente</p>
            </div>

            {/* Navegação */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {menuItems.map((item) => (
                    <NavItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                        active={location.pathname === item.path}
                        highlight={item.highlight}
                    />
                ))}
            </nav>

            {/* User Profile (bottom) */}
            <div style={{
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px', marginBottom: '16px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: '700',
                        fontSize: '13px'
                    }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'Administrador'}
                        </p>
                        <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '11px', margin: 0 }}>
                            Plano Free
                        </p>
                    </div>
                </div>

                <NavItem
                    icon={Settings}
                    label="Configurações"
                    path="/settings"
                    active={location.pathname === '/settings'}
                />

                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: 'calc(100% + 24px)',
                        marginLeft: '-24px',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#FF9999',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '0 10px 10px 0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <LogOut size={18} />
                    <span>Sair da conta</span>
                </button>
            </div>
        </div>
    );
}

function NavItem({ icon: Icon, label, path, active, highlight }) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const baseStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: 'calc(100% + 24px)', // Extends to bleed
        marginLeft: '-24px',      // Bleeds to left edge
        padding: '12px 24px',     // Content starts at 24px
        fontSize: '14px',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        boxSizing: 'border-box'
    };

    const activeStyle = {
        background: 'rgba(255,241,118,0.12)',
        borderLeft: '3px solid #FFF176',
        color: '#FFF176',
        borderRadius: '0 10px 10px 0',
        fontWeight: '600',
    };

    const inactiveStyle = {
        background: isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        borderLeft: '3px solid transparent',
        color: 'rgba(255,255,255,0.55)',
        borderRadius: '0 10px 10px 0',
        fontWeight: '500',
    };

    return (
        <button
            onClick={() => navigate(path)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                ...baseStyle,
                ...(active ? activeStyle : inactiveStyle)
            }}
        >
            <Icon size={18} style={{
                color: active ? '#FFF176' : highlight ? '#FFF176' : 'inherit',
                opacity: active || isHovered || highlight ? 1 : 0.8
            }} />
            <span style={{ color: active ? '#FFF176' : isHovered ? '#FFFFFF' : 'inherit' }}>{label}</span>
            {highlight && !active && (
                <div style={{
                    marginLeft: 'auto',
                    backgroundColor: '#FFF176',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(255,241,118,0.4)'
                }} />
            )}
        </button>
    );
}
