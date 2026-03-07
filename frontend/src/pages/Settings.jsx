import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useAuthStore } from '../store/useAuthStore'
import { C } from '../tokens/colors'
import api from '../api'
import { PasswordInput } from '../components/ui/PasswordInput';
import { Info, Target, TrendingUp } from 'lucide-react';

// Componente base para inputs de configuração
function SettingsInput({ label, value, onChange, readOnly = true, type = 'text', placeholder, badge }) {
    return (
        <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.inkLight, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {label}
                </label>
                {badge && <span style={{ background: C.yellow, color: C.ink, fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>{badge}</span>}
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    background: readOnly ? C.paper : C.white,
                    color: readOnly ? C.inkMuted : C.ink,
                    fontSize: 14,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    outline: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxSizing: 'border-box'
                }}
                onFocus={e => !readOnly && (e.currentTarget.style.borderColor = C.green, e.currentTarget.style.boxShadow = `0 0 0 4px ${C.greenPale}`)}
                onBlur={e => (e.currentTarget.style.borderColor = C.border, e.currentTarget.style.boxShadow = 'none')}
            />
        </div>
    )
}
// Modal Simplificado
function ModernModal({ isOpen, title, text, confirmText, cancelText, onConfirm, onCancel, type = 'danger', isLoading = false }) {
    if (!isOpen) return null;

    let confirmColor = C.green;
    if (type === 'danger') confirmColor = '#DC2626';

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: C.white, borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: type === 'danger' ? '#DC2626' : (type === 'success' ? C.green : C.ink), margin: 0, marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 14, color: C.inkMuted, margin: 0, marginBottom: 32, lineHeight: 1.5 }}>{text}</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    {cancelText && <button onClick={onCancel} disabled={isLoading} style={{ padding: '10px 20px', borderRadius: 10, background: C.paper, color: C.ink, fontWeight: 700, fontSize: 13, border: 'none', cursor: isLoading ? 'wait' : 'pointer' }}>{cancelText}</button>}
                    <button onClick={onConfirm} disabled={isLoading} style={{ padding: '10px 20px', borderRadius: 10, background: confirmColor, color: C.white, fontWeight: 700, fontSize: 13, border: 'none', cursor: isLoading ? 'wait' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>{isLoading ? 'Aguarde...' : confirmText}</button>
                </div>
            </div>
        </div>
    )
}

// Constante de Máscara de CNPJ
const applyCnpjMask = (value) => {
    if (!value) return '';
    const v = value.replace(/\D/g, '');
    return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

// Componente para Integrações
function IntegrationCard({ name, icon, isUpcoming = false }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.white,
            marginBottom: 12, transition: 'all 0.15s', cursor: 'default',
            opacity: isUpcoming ? 0.6 : 1
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: C.paperWarm || '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {icon}
                </div>
                <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>{name}</h4>
                    <p style={{ fontSize: 12, color: C.inkMuted, margin: 0, marginTop: 2 }}>
                        {isUpcoming ? 'Em breve' : 'Importe custos e vendas'}
                    </p>
                </div>
            </div>
            <button disabled={isUpcoming} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: isUpcoming ? 'not-allowed' : 'pointer',
                background: C.paper,
                color: C.inkMuted,
                border: `1px solid ${C.border}`,
                transition: 'all 0.15s'
            }}>
                {isUpcoming ? 'Aguarde' : 'Conectar'}
            </button>
        </div>
    )
}

export default function Settings() {
    const { user, updateUser } = useAuthStore()
    const navigate = useNavigate()

    // Estados locais - Empresa
    const [companyName, setCompanyName] = useState('')
    const [companyDoc, setCompanyDoc] = useState('')
    const [companyLogo, setCompanyLogo] = useState(null)
    const [productCount, setProductCount] = useState(0)

    // Estados locais - Titular
    const [userName, setUserName] = useState('')

    // Status
    const [isLoading, setIsLoading] = useState(true)
    const [saveCompanyStatus, setSaveCompanyStatus] = useState('idle') // idle | saving | success
    const [saveUserStatus, setSaveUserStatus] = useState('idle') // idle | saving | success
    const [isModalProcessing, setIsModalProcessing] = useState(false)

    // Estados da Senha
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')

    // Modal Global de Confirmação
    const [modalConfig, setModalConfig] = useState(null) // { isOpen, title, text, type, confirmText, action }

    useEffect(() => {
        if (user?.name) setUserName(user.name);

        const fetchSettingsData = async () => {
            try {
                // Buscamos o perfil e os produtos para ler a contagem
                const [profileRes, productsRes] = await Promise.all([
                    api.get('/business-profile'),
                    api.get('/products')
                ])

                if (profileRes.data) {
                    setCompanyName(profileRes.data.companyName || '')
                    setCompanyDoc(applyCnpjMask(profileRes.data.companyDoc || ''))
                }

                if (productsRes.data && Array.isArray(productsRes.data)) {
                    setProductCount(productsRes.data.length)
                } else if (productsRes.data?.data) {
                    setProductCount(productsRes.data.data.length)
                }

                const savedLogo = localStorage.getItem('markap_company_logo')
                if (savedLogo) setCompanyLogo(savedLogo)

            } catch (error) {
                console.error('Erro ao buscar dados de configurações:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSettingsData()
    }, [user])

    const handleSaveCompany = async () => {
        try {
            setSaveCompanyStatus('saving')
            await api.put('/business-profile', {
                companyName,
                companyDoc: companyDoc.replace(/\D/g, '') // Salva apenas números
            })
            setSaveCompanyStatus('success')
            setTimeout(() => setSaveCompanyStatus('idle'), 3000)
        } catch (error) {
            console.error('Erro ao salvar dados da empresa:', error)
            setSaveCompanyStatus('idle')
        }
    }

    const handleSaveProfile = async () => {
        try {
            setSaveUserStatus('saving')
            await api.put('/auth/profile', { name: userName })
            updateUser({ name: userName })
            setSaveUserStatus('success')
            setTimeout(() => setSaveUserStatus('idle'), 3000)
        } catch (error) {
            console.error('Erro ao salvar perfil', error)
            setSaveUserStatus('idle')
        }
    }

    const validatePassword = (pwd) => {
        const reqs = [/.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
        return reqs.every(regex => regex.test(pwd));
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordSuccess('')
        if (!currentPassword || !newPassword) return setPasswordError('Preencha os dois campos.')
        if (!validatePassword(newPassword)) return setPasswordError('A nova senha não atende aos requisitos de segurança.')

        try {
            setIsSavingPassword(true)
            await api.put('/auth/password', { currentPassword, newPassword })
            setPasswordSuccess('Senha alterada com sucesso!')
            setTimeout(() => {
                setIsPasswordModalOpen(false)
                setCurrentPassword('')
                setNewPassword('')
                setPasswordSuccess('')
            }, 2000)
        } catch (error) {
            setPasswordError(error.response?.data?.error || 'Erro ao alterar senha.')
        } finally {
            setIsSavingPassword(false)
        }
    }

    const handleCnpjChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 14); // Limita tamanho
        setCompanyDoc(applyCnpjMask(val));
    }

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setCompanyLogo(base64String);
                localStorage.setItem('markap_company_logo', base64String);
            };
            reader.readAsDataURL(file);
        }
    }

    const processAction = async (actionFn) => {
        if (!actionFn) return;
        setIsModalProcessing(true)
        try {
            await actionFn()
            // Not closing automatically to allow actionFn to show success state
        } catch (err) {
            console.error(err)
            setModalConfig(null) // Close on error to be safe
        } finally {
            setIsModalProcessing(false)
        }
    }

    const handleResetData = () => {
        setModalConfig({
            isOpen: true, title: "Zerar todos os cálculos", type: "danger",
            text: "Tem certeza que deseja apagar TODOS os seus produtos? Suas configurações de empresa serão mantidas.",
            confirmText: "Sim, Resetar dados", cancelText: "Cancelar",
            action: async () => {
                await api.delete('/products/reset');
                setProductCount(0);

                // Show success in modal
                setModalConfig({
                    isOpen: true, title: "Tudo limpo!", type: "success",
                    text: "Seu inventário de produtos foi zerado com sucesso.",
                    confirmText: "Ok, entendi", cancelText: null,
                    action: () => setModalConfig(null)
                });
            }
        })
    }

    const handleDeleteAccount = () => {
        setModalConfig({
            isOpen: true, title: "Excluir Conta", type: "danger",
            text: "CUIDADO: Você está prestes a excluir sua conta permanentemente e apagar todos os seus dados. Deseja continuar?",
            confirmText: "Sim, Excluir", cancelText: "Voltar",
            action: async () => {
                await api.delete('/auth/account');

                // Show final message before redirect
                setModalConfig({
                    isOpen: true, title: "Conta Excluída", type: "success",
                    text: "Sua conta e dados foram removidos. Sentiremos sua falta!",
                    confirmText: "Sair", cancelText: null,
                    action: () => {
                        useAuthStore.getState().logout();
                        navigate('/login');
                    }
                });
            }
        })
    }

    return (
        <AppShell
            pageTitle="Configurações"
            pageSubtitle="Gerencie sua conta, assinaturas e preferências do ecossistema."
        >
            <ModernModal
                isOpen={modalConfig?.isOpen}
                title={modalConfig?.title}
                text={modalConfig?.text}
                type={modalConfig?.type}
                confirmText={modalConfig?.confirmText}
                cancelText={modalConfig?.cancelText}
                isLoading={isModalProcessing}
                onConfirm={() => processAction(modalConfig?.action)}
                onCancel={() => setModalConfig(null)}
            />

            {/* Modal de Alteração de Senha */}
            {isPasswordModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: C.white, borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: 22, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 12, fontFamily: "'Fraunces', serif" }}>Alterar Senha</h3>
                        <p style={{ fontSize: 14, color: C.inkLight, margin: 0, marginBottom: 24, lineHeight: 1.6 }}>Digite sua senha atual e a nova senha para atualizar seu acesso com segurança.</p>

                        <form onSubmit={handlePasswordUpdate}>
                            <PasswordInput label="Senha Atual" showStrength={false} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Sua senha atual" styleOverrides={{ label: { textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: C.inkMuted } }} />
                            <PasswordInput label="Nova Senha" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nova senha segura" styleOverrides={{ label: { textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: C.inkMuted } }} />

                            {passwordError && <p style={{ color: '#DC2626', fontSize: 13, marginTop: -8, marginBottom: 16 }}>{passwordError}</p>}
                            {passwordSuccess && <p style={{ color: C.green, fontSize: 13, marginTop: -8, marginBottom: 16 }}>{passwordSuccess}</p>}

                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} disabled={isSavingPassword} style={{ padding: '10px 20px', borderRadius: 10, background: C.paper, color: C.ink, fontWeight: 700, fontSize: 13, border: 'none', cursor: isSavingPassword ? 'wait' : 'pointer' }}>Cancelar</button>
                                <button type="submit" disabled={isSavingPassword} style={{ padding: '10px 20px', borderRadius: 10, background: C.green, color: C.white, fontWeight: 700, fontSize: 13, border: 'none', cursor: isSavingPassword ? 'wait' : 'pointer', opacity: isSavingPassword ? 0.7 : 1 }}>{isSavingPassword ? 'Salvando...' : 'Atualizar Senha'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 48, maxWidth: 840, margin: '0 auto' }}>

                {/* 1. Minha Empresa (Novo Bloco de Identidade) */}
                <section style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: '40px', opacity: isLoading ? 0.7 : 1, pointerEvents: isLoading ? 'none' : 'auto', boxShadow: '0 10px 30px -12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: C.ink, margin: 0, fontFamily: "'Fraunces', serif" }}>Minha Empresa</h2>
                            <p style={{ fontSize: 14, color: C.inkLight, margin: 0, marginTop: 4 }}>Identidade visual e dados cadastrais do seu negócio</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                        {/* Upload de Logo */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                            <label style={{
                                width: 90, height: 90, borderRadius: '50%', background: C.paperWarm || '#F3F4F6',
                                border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 28, color: C.inkMuted, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                                backgroundImage: companyLogo ? `url(${companyLogo})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'
                            }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = C.green}
                                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                            >
                                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                                {!companyLogo && '🏢'}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '4px', textAlign: 'center' }}>
                                    <span style={{ color: '#FFF', fontSize: 9, fontWeight: 700 }}>EDITAR</span>
                                </div>
                            </label>
                            <span style={{ fontSize: 11, color: C.inkLight, fontWeight: 600 }}>Logo / Marca</span>
                        </div>

                        {/* Campos da Empresa */}
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <SettingsInput label="Nome da Empresa (Fantasia)" value={companyName} onChange={e => setCompanyName(e.target.value)} readOnly={false} placeholder="Ex: Boutique Markap" />
                            <SettingsInput label="CNPJ (Apenas números)" value={companyDoc} onChange={handleCnpjChange} readOnly={false} placeholder="00.000.000/0001-00" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                        <button onClick={handleSaveCompany} disabled={saveCompanyStatus !== 'idle'} style={{ background: saveCompanyStatus === 'success' ? C.green : C.ink, color: C.white, border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: saveCompanyStatus !== 'idle' ? 'wait' : 'pointer', opacity: saveCompanyStatus === 'saving' ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onMouseEnter={e => !saveCompanyStatus.match(/saving|success/) && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            {saveCompanyStatus === 'saving' ? 'Salvando...' : saveCompanyStatus === 'success' ? 'Salvo ✔' : 'Salvar Dados'}
                        </button>
                    </div>
                </section>

                {/* 2. Titular (Minha Conta Antigo) */}
                <section style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: '40px', boxShadow: '0 10px 30px -12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 16, fontWeight: 800, fontFamily: "'Fraunces', serif" }}>
                            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AN'}
                        </div>
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: C.ink, margin: 0, fontFamily: "'Fraunces', serif" }}>Titular da Conta</h2>
                            <p style={{ fontSize: 14, color: C.inkLight, margin: 0, marginTop: 4 }}>Informações pessoais e de acesso</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <SettingsInput label="Nome completo" value={userName} onChange={e => setUserName(e.target.value)} readOnly={false} placeholder="Seu nome" />
                            <SettingsInput label="E-mail de acesso" value={user?.email || ''} placeholder="seu@email.com" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                            <button onClick={handleSaveProfile} disabled={saveUserStatus !== 'idle'} style={{ background: saveUserStatus === 'success' ? C.green : C.ink, color: C.white, border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: saveUserStatus !== 'idle' ? 'wait' : 'pointer', opacity: saveUserStatus === 'saving' ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onMouseEnter={e => !saveUserStatus.match(/saving|success/) && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                {saveUserStatus === 'saving' ? 'Salvando...' : saveUserStatus === 'success' ? 'Salvo ✔' : 'Salvar Perfil'}
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: 16, borderTop: `1px solid ${C.paperDeep || '#F8FAFC'}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: 0 }}>Senha de Acesso</p>
                            <p style={{ fontSize: 12, color: C.inkMuted, margin: 0, marginTop: 4 }}>Para sua segurança, não compartilhe sua senha.</p>
                        </div>
                        <button onClick={() => setIsPasswordModalOpen(true)} style={{ background: C.paper, color: C.ink, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onMouseEnter={e => { e.currentTarget.style.background = C.border; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.background = C.paper; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)'; }}>
                            Alterar Senha
                        </button>
                    </div>
                </section>

                {/* 3. Plano e Assinatura */}
                <section style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: '40px', boxShadow: '0 10px 30px -12px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 4, fontFamily: "'Fraunces', serif" }}>Plano e Assinatura</h2>
                    <p style={{ fontSize: 14, color: C.inkLight, margin: 0, marginBottom: 24 }}>Gerencie seu uso e limites da plataforma</p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.paperWarm || '#F3F4F6', borderRadius: 12, padding: 20, border: `1px dashed ${C.border}` }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span style={{ background: C.green, color: C.white, fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.05em' }}>PLANO ATUAL</span>
                                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Fraunces', serif", color: C.ink }}>Markap Starter</span>
                            </div>
                            <p style={{ fontSize: 13, color: C.inkMuted, margin: 0 }}>Você cadastrou {productCount} de 5 produtos grátis.</p>
                        </div>
                        <button
                            onClick={() => navigate('/upgrade')}
                            style={{ background: C.yellow, color: C.ink, border: `none`, borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(232, 245, 66, 0.3)', transition: 'transform 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Ver Planos PRO →
                        </button>
                    </div>
                </section>

                {/* 4. Integrações */}
                <section style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: '40px', boxShadow: '0 10px 30px -12px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 4, fontFamily: "'Fraunces', serif" }}>Integrações (Hub)</h2>
                    <p style={{ fontSize: 14, color: C.inkLight, margin: 0, marginBottom: 24 }}>Nossos Parceiros recomendados para conectar dados diretamente.</p>

                    <IntegrationCard name="Tiny ERP" icon="📦" isUpcoming={true} />
                    <IntegrationCard name="Bling ERP" icon="🏢" isUpcoming={true} />
                    <IntegrationCard name="Nuvemshop" icon="☁️" isUpcoming={true} />
                </section>

                {/* 5. Preferências */}
                <section style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: '40px', boxShadow: '0 10px 30px -12px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: C.ink, margin: 0, marginBottom: 4, fontFamily: "'Fraunces', serif" }}>Preferências Locais</h2>
                    <p style={{ fontSize: 14, color: C.inkLight, margin: 0, marginBottom: 24 }}>Como o Markap deve se comportar neste dispositivo.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <SettingsInput label="Idioma" value="Português (Brasil)" />
                        <SettingsInput label="Moeda Principal" value="BRL (R$)" />
                    </div>
                </section>

                {/* 6. Zona de Perigo */}
                <section style={{ background: '#FFF7F7', borderRadius: 24, border: `1px solid rgba(220, 38, 38, 0.15)`, padding: '40px', boxShadow: '0 10px 30px -12px rgba(220,38,38,0.08)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#DC2626', margin: 0, marginBottom: 4, fontFamily: "'Fraunces', serif" }}>Zona de Perigo</h2>
                    <p style={{ fontSize: 14, color: '#DC2626', margin: 0, marginBottom: 24, opacity: 0.8 }}>Ações irreversíveis para sua conta e dados.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.white, padding: 16, borderRadius: 12, border: '1px solid rgba(220, 38, 38, 0.1)' }}>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Zerar todos os cálculos</h4>
                                <p style={{ fontSize: 12, color: C.inkMuted, margin: 0, marginTop: 4 }}>Remove todos os produtos mantendo o Perfil do Negócio e seu usuário ativos.</p>
                            </div>
                            <button onClick={handleResetData} style={{ background: 'transparent', color: '#DC2626', border: `1px solid rgba(220, 38, 38, 0.3)`, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                Resetar Dados
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.white, padding: 16, borderRadius: 12, border: '1px solid rgba(220, 38, 38, 0.1)' }}>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Excluir Conta Permanentemente</h4>
                                <p style={{ fontSize: 12, color: C.inkMuted, margin: 0, marginTop: 4 }}>Deleta você, seus dados e cálculos do banco de dados irreversivelmente (LGPD).</p>
                            </div>
                            <button onClick={handleDeleteAccount} style={{ background: '#DC2626', color: C.white, border: `none`, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                                Excluir Conta
                            </button>
                        </div>
                    </div>
                </section>

            </div >
        </AppShell >
    )
}
