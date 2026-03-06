// src/components/AppShell.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const C = {
    green: '#1A5C3A', greenMid: '#2E7D52', greenFresh: '#22C55E',
    ink: '#0F0E0C', inkMid: '#374151', inkLight: '#64748B', inkMuted: '#9CA3AF',
    white: '#FFFFFF', paper: '#F7F7F7', border: '#E2E8F0',
    yellow: '#FFF176', yellowDeep: '#E8F542',
}

const NAV = [
    {
        t: 'Dashboard', path: '/dashboard',
        i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" /><rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" /><rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" /><rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" /></svg>
    },
    {
        t: 'Calculadora', path: '/calculator',
        i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M9 7h6M9 11h4M9 15h2M13 15h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    },
    {
        t: 'Perfil do Negócio', path: '/business-profile',
        i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    },
    {
        t: 'Análise', path: '/analysis',
        i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    },
]

const BOTTOM_NAV = [
    {
        t: 'Fazer Upgrade', path: '/upgrade',
        i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M12 2l3 6 6 1-4.5 4 1 6L12 16l-5.5 3 1-6L3 9l6-1 3-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
    },
    {
        t: 'Configurações', path: '/settings',
        i: <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    },
]

export default function AppShell({ children, pageTitle, pageSubtitle, topBarContent }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuthStore()

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'AN'

    const isActive = (path) => location.pathname.startsWith(path)

    return (
        <div style={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: C.paper,
            overflow: 'hidden',
        }}>

            {/* ── SIDEBAR ── */}
            <aside style={{
                width: 68,
                background: C.white,
                borderRight: `1px solid ${C.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 20,
                paddingBottom: 20,
                position: 'relative',
                flexShrink: 0,
                zIndex: 20,
            }}>

                {/* Logo */}
                <div
                    onClick={() => navigate('/dashboard')}
                    style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        fontFamily: "'Fraunces', serif",
                        fontSize: 14,
                        fontWeight: 900,
                        color: C.green,
                        letterSpacing: '0.05em',
                        marginBottom: 28,
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                >
                    Mark<em style={{ fontStyle: 'italic', color: '#E8F542' }}>ap</em>
                </div>

                {/* Nav principal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    {NAV.map((item) => {
                        const active = isActive(item.path)
                        return (
                            <button
                                key={item.path}
                                title={item.t}
                                onClick={() => navigate(item.path)}
                                style={{
                                    width: 40, height: 40,
                                    borderRadius: 10,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: active ? C.ink : 'transparent',
                                    color: active ? C.white : C.inkMuted,
                                    border: 'none', cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.paper; e.currentTarget.style.color = C.ink } }}
                                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.inkMuted } }}
                            >
                                {item.i}
                            </button>
                        )
                    })}
                </div>

                {/* Nav inferior */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                    {BOTTOM_NAV.map((item) => {
                        const active = isActive(item.path)
                        return (
                            <button
                                key={item.path}
                                title={item.t}
                                onClick={() => navigate(item.path)}
                                style={{
                                    width: 40, height: 40,
                                    borderRadius: 10,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: active ? C.ink : 'transparent',
                                    color: active ? C.white : C.inkMuted,
                                    border: 'none', cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {item.i}
                            </button>
                        )
                    })}
                </div>

                {/* Avatar do usuário */}
                <div
                    title="Perfil"
                    onClick={() => navigate('/business-profile')}
                    style={{
                        width: 32, height: 32,
                        borderRadius: '50%',
                        background: C.green,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 800,
                        color: C.yellow,
                        cursor: 'pointer',
                        fontFamily: "'Fraunces', serif",
                    }}
                >
                    {initials}
                </div>
            </aside>

            {/* ── COLUNA PRINCIPAL ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

                {/* BARRA AMARELA SUPERIOR */}
                <div style={{
                    background: C.yellow,
                    borderBottom: `2px solid ${C.yellowDeep}`,
                    padding: '0 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 42,
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                            fontSize: 11, fontWeight: 700,
                            color: C.ink, letterSpacing: '0.07em',
                        }}>
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                        </span>
                        {/* Slot para conteúdo extra da barra — alerts, breadcrumb, etc. */}
                        {topBarContent}
                    </div>
                    <button
                        onClick={() => navigate('/calculator')}
                        style={{
                            background: C.ink, color: C.yellow,
                            border: 'none', borderRadius: 8,
                            padding: '6px 14px',
                            fontSize: 11, fontWeight: 700,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            cursor: 'pointer',
                        }}
                    >
                        + Novo Cálculo
                    </button>
                </div>

                {/* ÁREA DE CONTEÚDO — scrollável */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                    {/* Título da página — opcional, cada tela pode sobrescrever */}
                    {pageTitle && (
                        <div style={{ marginBottom: 24 }}>
                            <h1 style={{
                                fontFamily: "'Fraunces', serif",
                                fontWeight: 900,
                                fontSize: 32,
                                letterSpacing: '-0.025em',
                                color: C.ink,
                                marginBottom: 4,
                            }}>{pageTitle}</h1>
                            {pageSubtitle && (
                                <p style={{ fontSize: 14, color: C.inkLight, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {pageSubtitle}
                                </p>
                            )}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    )
}
