import AppShell from '../components/AppShell'

const C = {
    ink: '#0F0E0C',
    inkLight: '#64748B',
    border: '#E2E8F0',
}

export default function Settings() {
    return (
        <AppShell pageTitle="Configurações" pageSubtitle="Gerencie sua conta e preferências">
            <div style={{
                background: '#FFF',
                borderRadius: 16,
                border: `1px solid ${C.border}`,
                padding: 24,
                marginTop: 20
            }}>
                <h3 style={{ marginBottom: 16, color: C.ink }}>Conta</h3>
                <p style={{ color: C.inkLight, fontSize: 14 }}>Funcionalidade em desenvolvimento...</p>
            </div>
        </AppShell>
    )
}
