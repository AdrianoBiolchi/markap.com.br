import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import './Landing.css';

export default function Landing() {
    const navigate = useNavigate();
    const { isAuth } = useAuthStore();
    const [faqOpen, setFaqOpen] = useState(0);

    // States for the interactive calculator
    const [calcData, setCalcData] = useState({
        cost: 45,
        labor: 15,
        fixed: 5000,
        revenue: 20000,
        taxes: 15,
        margin: 20
    });

    const [calcResult, setCalcResult] = useState({
        price: 0,
        markup: 0,
        status: 'good',
        composition: {
            direct: 0,
            fixed: 0,
            tax: 0,
            profit: 0
        }
    });

    useEffect(() => {
        if (isAuth) {
            navigate('/dashboard');
        }
    }, [isAuth, navigate]);

    useEffect(() => {
        const { cost, labor, fixed, revenue, taxes, margin } = calcData;
        const directCost = Number(cost) + Number(labor);
        const cfPercent = (Number(fixed) / (Number(revenue) || 1)) * 100;
        const denom = 100 - cfPercent - Number(taxes) - Number(margin);

        if (denom <= 0) {
            setCalcResult(prev => ({ ...prev, status: 'invalid' }));
            return;
        }

        const markup = 100 / denom;
        const price = directCost * markup;

        const directPct = (directCost / price) * 100;
        const fixedPct = cfPercent;
        const taxPct = Number(taxes);
        const profitPct = Math.max(0, 100 - directPct - fixedPct - taxPct);

        let status = 'good';
        if (margin < 5) status = 'risk';
        else if (margin < 15) status = 'warn';

        setCalcResult({
            price,
            markup,
            status,
            composition: {
                direct: directPct,
                fixed: fixedPct,
                tax: taxPct,
                profit: profitPct
            }
        });

    }, [calcData]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCalcData(prev => ({ ...prev, [name]: value }));
    };

    const toggleFaq = (index) => {
        setFaqOpen(faqOpen === index ? -1 : index);
    };

    return (
        <div className="landing-body">
            {/* NAVBAR */}
            <nav className="landing-nav">
                <Link to="/" className="nav-logo">
                    <svg className="nav-logo-icon" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="#ECFDF5" />
                        <rect x="5" y="19" width="4" height="8" rx="1.5" fill="#A7F3D0" />
                        <rect x="11" y="14" width="4" height="13" rx="1.5" fill="#34D399" />
                        <rect x="17" y="8" width="4" height="19" rx="1.5" fill="#1A5C3A" />
                        <path d="M23 10 L27 6 M27 6 L27 10 M27 6 L23 6" stroke="#1A5C3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="nav-logo-text">Mark<span>ap</span></span>
                </Link>
                <ul className="nav-links">
                    <li><a href="#como-funciona">Como funciona</a></li>
                    <li><a href="#comparativo">Comparativo</a></li>
                    <li><a href="#precos">Preços</a></li>
                    <li><a href="#faq">FAQ</a></li>
                </ul>
                <div className="nav-actions">
                    <Link to="/login" className="btn-ghost">Entrar</Link>
                    <Link to="/register" className="btn-primary">Calcular grátis →</Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-eyebrow">✦ Metodologia SEBRAE · Grátis para começar</div>

                    <h1 className="hero-headline">
                        Você sabe quanto<br />
                        <em>lucra em cada</em><br />
                        venda?
                    </h1>

                    <p className="hero-sub">
                        A maioria dos empresários trabalha muito e no fim do mês não sobra nada.
                        O Markap descobre em 3 minutos se seus preços estão certos.
                    </p>

                    <div className="hero-cta-row">
                        <Link to="/register" className="btn-hero">
                            Calcular meu primeiro produto
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                        <a href="#como-funciona" className="btn-hero-outline">Ver como funciona</a>
                    </div>

                    <div className="hero-proof">
                        <div className="hero-proof-avatars">
                            <span>MC</span><span>RF</span><span>JS</span>
                        </div>
                        +2.400 empresários já precificam com o Markap
                        &nbsp;·&nbsp;
                        ⭐ 4.8 de avaliação
                    </div>
                </div>

                {/* Wide Dashboard Visual */}
                <div className="hero-visual">
                    <div className="dashboard-card">
                        <div className="dashboard-toolbar">
                            <div className="toolbar-dot"></div>
                            <div className="toolbar-dot"></div>
                            <div className="toolbar-dot"></div>
                            <div className="toolbar-bar">
                                <span className="toolbar-url">markap.com.br/dashboard</span>
                            </div>
                        </div>

                        <div className="dashboard-grid">
                            {/* Card 1 */}
                            <div className="dash-product-card">
                                <div className="dash-product-header">
                                    <div>
                                        <div className="dash-product-name">Calça Jeans Slim</div>
                                        <div className="dash-product-sku">SKU-2847</div>
                                    </div>
                                    <div className="badge-critical">⚠ Crítica</div>
                                </div>
                                <div className="price-comparison">
                                    <div className="price-box">
                                        <div className="price-label">Atual</div>
                                        <div className="price-value">R$89,90</div>
                                        <div className="price-margin">Margem: 5%</div>
                                    </div>
                                    <div className="price-box">
                                        <div className="price-label">Ideal</div>
                                        <div className="price-value-ideal">R$124,50</div>
                                        <div className="price-margin-good">Margem: 30%</div>
                                    </div>
                                </div>
                                <div className="dash-alert">
                                    <span style={{ fontSize: '14px' }}>↘</span>
                                    <div className="dash-alert-text">Perdendo <strong>R$34,60</strong> por unidade vendida</div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="dash-product-card">
                                <div className="dash-product-header">
                                    <div>
                                        <div className="dash-product-name">Bolsa de Couro</div>
                                        <div className="dash-product-sku">SKU-1203</div>
                                    </div>
                                    <div className="badge-healthy">✓ Saudável</div>
                                </div>
                                <div style={{ marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Composição</span>
                                        <span className="price-value-ideal" style={{ fontSize: '20px' }}>R$179,40</span>
                                    </div>
                                    <div className="comp-bar">
                                        <div className="comp-seg" style={{ width: '39%', background: '#3B82F6' }}></div>
                                        <div className="comp-seg" style={{ width: '29%', background: '#8B5CF6' }}></div>
                                        <div className="comp-seg" style={{ width: '14%', background: '#F59E0B' }}></div>
                                        <div className="comp-seg" style={{ width: '18%', background: '#52B788' }}></div>
                                    </div>
                                    <div className="comp-legend">
                                        <div className="comp-item"><div className="comp-dot" style={{ background: '#3B82F6' }}></div>Custo 39%</div>
                                        <div className="comp-item"><div className="comp-dot" style={{ background: '#8B5CF6' }}></div>Fixo 29%</div>
                                        <div className="comp-item"><div className="comp-dot" style={{ background: '#F59E0B' }}></div>Imp. 14%</div>
                                        <div className="comp-item"><div className="comp-dot" style={{ background: '#52B788' }}></div>Lucro 18%</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>Break-even: 42 unidades/mês</div>
                            </div>

                            {/* Card 3 */}
                            <div className="dash-product-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <div>
                                            <div className="dash-product-name">Score do Negócio</div>
                                            <div className="dash-product-sku">Março 2026</div>
                                        </div>
                                        <div className="badge-warning">⚡ Atenção</div>
                                    </div>
                                    <div className="score-number">73</div>
                                    <div className="score-label">de 100</div>

                                    <svg width="100%" height="6" style={{ margin: '14px 0 8px' }}>
                                        <rect x="0" y="0" width="100%" height="6" rx="3" fill="rgba(255,255,255,0.06)" />
                                        <rect x="0" y="0" width="73%" height="6" rx="3" fill="#E9A93C" />
                                    </svg>
                                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>3 produtos precisam de ajuste</div>
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.4)', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span>Margem média</span><span style={{ color: '#E9A93C' }}>14,2%</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.4)', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span>Produtos lucrativos</span><span style={{ color: '#52B788' }}>4 de 7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="float-notif">
                        💡 Bolsa de Couro: ajuste para R$179,40 e lucre 18%
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            <div className="stats-bar">
                {[
                    { num: '+2.400', label: 'empresários ativos' },
                    { num: 'R$890k', label: 'em margens recuperadas' },
                    { num: '3min', label: 'para precificar 1 produto' },
                    { num: '4.8★', label: 'avaliação média' }
                ].map((stat, i) => (
                    <div key={i} className="stat-item">
                        <div>
                            <div className="stat-number">{stat.num.split(/(\d+)/).map((part, j) =>
                                /\d+/.test(part) ? <span key={j}>{part}</span> : part
                            )}</div>
                            <div className="stat-text">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PROBLEM SECTION */}
            <section className="section-problem" id="como-funciona">
                <span className="section-eyebrow reveal">Por que acontece?</span>
                <h2 className="section-title reveal">
                    Você trabalha muito.<br />
                    <em>Mas será que está lucrando de verdade?</em>
                </h2>

                <div className="problem-grid">
                    {[
                        { id: '01', icon: '🤔', title: 'Copia o preço da concorrência', text: 'Sem saber se o vizinho está lucrando ou quebrando devagar. O preço certo é baseado nos SEUS custos, não nos dele.' },
                        { id: '02', icon: '😰', title: 'Vende muito, não sobra nada', text: 'Faturamento alto, conta no zero. Acontece quando o preço cobre os custos variáveis mas ignora os custos fixos.' },
                        { id: '03', icon: '📊', title: 'Planilha desatualizada', text: 'Funciona até perder o arquivo, esquecer de atualizar, ou não saber se o cálculo está metodologicamente correto.' }
                    ].map((prob, i) => (
                        <div key={i} className="problem-card reveal">
                            <div className="problem-number">{prob.id} — {prob.title.split(' ')[0]}</div>
                            <span className="problem-icon">{prob.icon}</span>
                            <h3 className="problem-title">{prob.title}</h3>
                            <p className="problem-text">{prob.text}</p>
                        </div>
                    ))}
                </div>

                <div className="problem-bottom reveal">
                    <div className="problem-bottom-text">
                        Se você se identificou com qualquer um desses,<br />
                        <em>o Markap foi feito para você.</em>
                    </div>
                    <Link to="/register" className="btn-hero" style={{ flexShrink: 0 }}>
                        Resolver agora →
                    </Link>
                </div>
            </section>

            {/* COMPARISON */}
            <section className="section-comparison" id="comparativo">
                <div className="comparison-inner">
                    <span className="section-eyebrow reveal">Comparativo</span>
                    <h2 className="section-title reveal">
                        Markap vs<br />
                        <em>Planilha Excel</em>
                    </h2>

                    <table className="comparison-table reveal">
                        <thead>
                            <tr>
                                <th>Funcionalidade</th>
                                <th>Planilha Excel</th>
                                <th>Markap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['Cálculo automático do preço ideal', '✗ Manual e sujeito a erro', '✓ Automático e validado'],
                                ['Diagnóstico de margem crítica', '✗ Você precisa interpretar', '✓ Alerta automático'],
                                ['Rateio correto de custos fixos', '✗ Quase ninguém faz certo', '✓ Metodologia SEBRAE'],
                                ['Simulador de cenários de preço', '✗ Refaz tudo na mão', '✓ Slider em tempo real'],
                                ['Score de saúde do negócio', '✗ Não existe', '✓ 0 a 100 em tempo real'],
                                ['Acesso pelo celular', '✗ Difícil e lento', '✓ Qualquer dispositivo'],
                                ['Backup automático', '✗ Risco de perder tudo', '✓ Salvo na nuvem'],
                                ['Tempo para precificar 1 produto', '✗ 20–40 minutos', '✓ Menos de 3 minutos']
                            ].map((row, i) => (
                                <tr key={i}>
                                    <td>{row[0]}</td>
                                    <td>{row[1]}</td>
                                    <td>{row[2]}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ color: 'white', fontWeight: '700', textAlign: 'center', letterSpacing: '-0.01em', fontSize: '16px' }}>
                                    Resultado: mais clareza, menos tempo, mais lucro.
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="section-how">
                <span className="section-eyebrow reveal">Como funciona</span>
                <h2 className="section-title reveal">
                    3 passos para descobrir<br />
                    <em>se você está lucrando de verdade</em>
                </h2>

                <div className="steps">
                    {[
                        { id: '01', title: 'Informe os custos', text: 'Produção, mão de obra, embalagem. Seus custos fixos ficam no perfil do negócio — uma vez só para todos os produtos.', tag: '⏱ ~2 minutos', color: 'var(--forest)' },
                        { id: '02', title: 'Receba o preço ideal', text: 'Calculamos o preço que cobre TODOS os seus custos — diretos e fixos — e ainda garante a margem que você quer ter.', tag: '⚡ Instantâneo', color: 'var(--amber)' },
                        { id: '03', title: 'Veja o diagnóstico', text: 'Score de saúde, ponto de equilíbrio, simulador de preços e alertas automáticos de margem crítica para cada produto.', tag: '📊 Diagnóstico completo', color: '#2D6A4F' }
                    ].map((step, i) => (
                        <div key={i} className="step-card reveal">
                            <div className="step-number-bg">{step.id}</div>
                            <div className="step-num" style={{ background: step.color }}>{step.id}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-text">{step.text}</p>
                            <span className="step-tag">{step.tag}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* DEMO CALCULATOR */}
            <section className="section-demo">
                <div className="demo-inner">
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <span className="section-eyebrow" style={{ color: '#52B788' }}>🎯 Demo interativa · Sem criar conta</span>
                    </div>
                    <h2 className="section-title" style={{ textAlign: 'center', maxWidth: '100%', marginBottom: '12px' }}>
                        Calcule um produto agora
                    </h2>
                    <p className="demo-sub" style={{ textAlign: 'center' }}>Preencha os dados e veja o preço ideal em tempo real.</p>

                    <div className="calc-card">
                        <div className="calc-layout">
                            <div className="calc-left">
                                <div className="input-group">
                                    <label className="input-label">Custo do produto (R$)</label>
                                    <input className="input-field" type="number" name="cost" value={calcData.cost} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Mão de obra (R$)</label>
                                    <input className="input-field" type="number" name="labor" value={calcData.labor} onChange={handleInputChange} />
                                </div>

                                <div className="input-divider">Dados da empresa</div>

                                <div className="input-group">
                                    <label className="input-label">Custos fixos mensais (R$)</label>
                                    <input className="input-field" type="number" name="fixed" value={calcData.fixed} onChange={handleInputChange} />
                                    <div className="input-hint">Aluguel + salários + contas — tudo junto</div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Faturamento previsto/mês (R$)</label>
                                    <input className="input-field" type="number" name="revenue" value={calcData.revenue} onChange={handleInputChange} />
                                </div>

                                <div className="input-row">
                                    <div className="input-group">
                                        <label className="input-label">Impostos + taxas %</label>
                                        <input className="input-field" type="number" name="taxes" value={calcData.taxes} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Margem desejada %</label>
                                        <input className="input-field" type="number" name="margin" value={calcData.margin} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="calc-privacy">🔒 Nenhum dado é salvo · Cálculo no seu navegador</div>
                            </div>

                            <div className="calc-right">
                                <div className="result-label">Preço de venda ideal</div>
                                <div className="result-price">
                                    <span className="result-price-prefix">R$</span>
                                    <span>{calcResult.status === 'invalid' ? '---' : calcResult.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className={`result-status ${calcResult.status === 'good' ? 'status-good' : ''}`} style={calcResult.status === 'warn' ? { background: 'rgba(201,123,42,0.2)', color: '#E9A93C', border: '1px solid rgba(201,123,42,0.3)' } : calcResult.status === 'risk' || calcResult.status === 'invalid' ? { background: 'rgba(192,57,43,0.2)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.3)' } : {}}>
                                    {calcResult.status === 'good' ? '✓ Lucrativo' : calcResult.status === 'warn' ? '⚡ Atenção' : calcResult.status === 'risk' ? '⚠ Risco' : '⚠ Inviável'}
                                </div>

                                <div className="result-metrics">
                                    <div className="metric-box">
                                        <div className={`metric-value ${calcResult.status === 'good' ? 'good' : calcResult.status === 'warn' ? 'warn' : ''}`}>{calcData.margin}%</div>
                                        <div className="metric-name">Margem Líquida</div>
                                    </div>
                                    <div className="metric-box">
                                        <div className={`metric-value ${calcResult.status === 'good' ? 'good' : calcResult.status === 'warn' ? 'warn' : ''}`}>{calcResult.status === 'invalid' ? '---' : calcResult.markup.toFixed(2) + 'x'}</div>
                                        <div className="metric-name">Markup</div>
                                    </div>
                                </div>

                                <div className="result-bar-label">Composição do preço</div>
                                <div className="result-bar">
                                    <div style={{ width: `${calcResult.composition.direct}%`, background: '#3B82F6' }}></div>
                                    <div style={{ width: `${calcResult.composition.fixed}%`, background: '#8B5CF6' }}></div>
                                    <div style={{ width: `${calcResult.composition.tax}%`, background: '#F59E0B' }}></div>
                                    <div style={{ width: `${calcResult.composition.profit}%`, background: '#52B788' }}></div>
                                </div>
                                <div className="result-legend">
                                    <div className="legend-item"><div className="legend-dot" style={{ background: '#3B82F6' }}></div>Custo Direto</div>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: '#8B5CF6' }}></div>Custo Fixo</div>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: '#F59E0B' }}></div>Impostos</div>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: '#52B788' }}></div>Lucro</div>
                                </div>

                                <Link to="/register" className="btn-save">
                                    Salvar e ver diagnóstico completo →
                                </Link>
                                <div className="save-note">Crie sua conta grátis para salvar este produto</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="section-testimonials">
                <span className="section-eyebrow reveal">Depoimentos</span>
                <h2 className="section-title reveal">
                    Quem usa o Markap<br />
                    <em>não volta para a planilha</em>
                </h2>

                <div className="testimonials-grid">
                    {[
                        { initials: 'MC', name: 'Marina C.', role: 'Artesã de bolsas · São Paulo', quote: 'Descobri que vendia minha bolsa com margem de 3%. Achava que estava lucrando porque vendia bastante. O Markap mostrou que precisava cobrar R$45 a mais. No primeiro mês recuperei R$1.200.', color: '#2D6A4F' },
                        { initials: 'RF', name: 'Ricardo F.', role: 'Doceiro gourmet · Belo Horizonte', quote: 'Meu brigadeiro gourmet estava abaixo do preço mínimo e eu nem sabia. Ajustei e a margem foi de 8% para 22% em uma semana. Simples assim.', color: '#1B4332' },
                        { initials: 'JS', name: 'Juliana S.', role: 'Prestadora de serviços · Curitiba', quote: 'O simulador salvou minha promoção de fim de ano. Ia dar 20% de desconto sem saber que daria prejuízo. O Markap mostrou que o máximo seguro era 11%.', color: '#40916C' }
                    ].map((testi, i) => (
                        <div key={i} className="testimonial-card reveal">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, j) => <span key={j} className="star">★</span>)}
                            </div>
                            <p className="testimonial-quote">{testi.quote}</p>
                            <div className="testimonial-person">
                                <div className="testimonial-avatar" style={{ background: testi.color }}>{testi.initials}</div>
                                <div>
                                    <div className="testimonial-name">{testi.name}</div>
                                    <div className="testimonial-role">{testi.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="testimonials-stat reveal">
                    <div className="stat-big">+2.400</div>
                    <div className="stat-big-text">empresários já precificam com o Markap</div>
                </div>
            </section>

            {/* PRICING */}
            <section className="section-pricing" id="precos">
                <div className="pricing-inner">
                    <div style={{ textAlign: 'center' }}>
                        <span className="section-eyebrow reveal">Planos</span>
                        <h2 className="section-title reveal" style={{ maxWidth: '100%', textAlign: 'center' }}>
                            Comece grátis.<br />
                            <em>Evolua quando precisar.</em>
                        </h2>
                    </div>

                    <div className="pricing-grid">
                        {/* Free */}
                        <div className="pricing-card reveal">
                            <div className="plan-name">Grátis</div>
                            <div className="plan-price">R$0</div>
                            <div className="plan-period">para sempre</div>
                            <ul className="plan-features">
                                <li><span className="feat-check">✓</span> Até 5 produtos</li>
                                <li><span className="feat-check">✓</span> Cálculo de preço ideal</li>
                                <li><span className="feat-check">✓</span> Barra de composição</li>
                                <li><span className="feat-x">✗</span> Diagnóstico com IA</li>
                                <li><span className="feat-x">✗</span> Simulador de cenários</li>
                                <li><span className="feat-x">✗</span> Score de saúde</li>
                            </ul>
                            <Link to="/register" className="btn-plan">Começar grátis</Link>
                        </div>

                        {/* Pro */}
                        <div className="pricing-card featured reveal">
                            <div className="pricing-badge">Mais Popular</div>
                            <div className="plan-name plan-name-featured">Pro</div>
                            <div className="plan-price plan-price-featured">R$29</div>
                            <div className="plan-period plan-period-featured">/mês · cancele quando quiser</div>
                            <ul className="plan-features plan-features-featured">
                                <li><span className="feat-check-featured">✓</span> Produtos ilimitados</li>
                                <li><span className="feat-check-featured">✓</span> Diagnóstico completo com IA</li>
                                <li><span className="feat-check-featured">✓</span> Simulador de cenários</li>
                                <li><span className="feat-check-featured">✓</span> Score de saúde 0–100</li>
                                <li><span className="feat-check-featured">✓</span> Alertas de margem crítica</li>
                                <li><span className="feat-check-featured">✓</span> Relatório mensal em PDF</li>
                            </ul>
                            <Link to="/register" className="btn-plan btn-plan-featured">Testar 7 dias grátis →</Link>
                        </div>

                        {/* Business */}
                        <div className="pricing-card reveal">
                            <div className="plan-name">Business</div>
                            <div className="plan-price">R$89</div>
                            <div className="plan-period">/mês · para equipes</div>
                            <ul className="plan-features">
                                <li><span className="feat-check">✓</span> Tudo do Pro</li>
                                <li><span className="feat-check">✓</span> Múltiplos usuários</li>
                                <li><span className="feat-check">✓</span> Múltiplos CNPJs</li>
                                <li><span className="feat-check">✓</span> Integração com planilhas</li>
                                <li><span className="feat-check">✓</span> Suporte prioritário</li>
                                <li><span className="feat-check">✓</span> Onboarding dedicado</li>
                            </ul>
                            <Link to="/register" className="btn-plan">Falar com vendas</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section-faq" id="faq">
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <span className="section-eyebrow reveal">FAQ</span>
                    <h2 className="section-title reveal" style={{ maxWidth: '100%', textAlign: 'center' }}>
                        Dúvidas frequentes
                    </h2>
                </div>

                {[
                    { q: 'O Markap funciona para qualquer tipo de negócio?', a: 'Sim. Comércio, artesanato, alimentação, serviços — a metodologia se adapta ao seu regime tributário e tipo de negócio. No cadastro você informa seu segmento e o sistema ajusta os cálculos automaticamente.' },
                    { q: 'É realmente grátis para começar?', a: 'O plano Free é grátis para sempre — sem limite de tempo. Você pode precificar até 5 produtos sem pagar nada. O plano Pro (R$29/mês) desbloqueia produtos ilimitados e o diagnóstico completo com IA.' },
                    { q: 'A metodologia de cálculo é confiável?', a: 'Usamos a metodologia de markup com rateio de custos fixos por faturamento, recomendada pelo SEBRAE para pequenas empresas. O cálculo considera custos diretos, fixos, impostos, taxas e a margem que você quer ter.' },
                    { q: 'Preciso instalar alguma coisa?', a: 'Não. O Markap é 100% online. Funciona no navegador do computador, tablet e celular. Seus dados ficam salvos na nuvem automaticamente.' },
                    { q: 'Posso cancelar quando quiser?', a: 'Sim, sem fidelidade e sem multa. Cancele quando quiser pelo próprio painel. O acesso Pro continua até o fim do período já pago.' }
                ].map((faq, i) => (
                    <div key={i} className={`faq-item ${faqOpen === i ? 'open' : ''} reveal`}>
                        <button className="faq-question" onClick={() => toggleFaq(i)}>
                            {faq.q}
                            <span className="faq-toggle">+</span>
                        </button>
                        <div className="faq-answer">
                            {faq.a}
                        </div>
                    </div>
                ))}
            </section>

            {/* CTA FINAL */}
            <section className="section-cta-final">
                <div className="cta-final-inner">
                    <h2 className="cta-final-title">
                        Seu preço está certo?<br />
                        <em>Descubra agora.</em>
                    </h2>
                    <p className="cta-final-sub">
                        Grátis para começar. Sem cartão de crédito.<br />
                        Resultado em menos de 3 minutos.
                    </p>
                    <Link to="/register" className="btn-cta-final">
                        Calcular meu primeiro produto
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Link>
                    <div className="cta-final-trust">
                        <div className="trust-item">🔒 Dados seguros</div>
                        <div className="trust-item">🇧🇷 Feito no Brasil</div>
                        <div className="trust-item">⭐ Metodologia SEBRAE</div>
                        <div className="trust-item">✓ Sem cartão de crédito</div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <div className="footer-grid">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.06)" />
                                <rect x="5" y="19" width="4" height="8" rx="1.5" fill="rgba(82,183,136,0.4)" />
                                <rect x="11" y="14" width="4" height="13" rx="1.5" fill="rgba(82,183,136,0.7)" />
                                <rect x="17" y="8" width="4" height="19" rx="1.5" fill="#52B788" />
                                <path d="M23 10 L27 6 M27 6 L27 10 M27 6 L23 6" stroke="#52B788" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '18px', color: 'white', letterSpacing: '-0.03em' }}>Mark<span style={{ color: '#52B788' }}>ap</span></span>
                        </div>
                        <p className="footer-brand-text">Precificação inteligente para quem trabalha de verdade. Descubra se seus preços estão certos em 3 minutos.</p>
                    </div>
                    <div>
                        <div className="footer-col-title">Produto</div>
                        <ul className="footer-links">
                            <li><a href="#como-funciona">Como funciona</a></li>
                            <li><a href="#precos">Preços</a></li>
                            <li><Link to="/register">Calculadora</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-col-title">Empresa</div>
                        <ul className="footer-links">
                            <li><a href="#">Sobre</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Contato</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-col-title">Legal</div>
                        <ul className="footer-links">
                            <li><a href="#">Termos de Uso</a></li>
                            <li><a href="#">Privacidade</a></li>
                            <li><a href="#">Cookies</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 Markap · markap.com.br</span>
                    <span>contato@markap.com.br</span>
                </div>
            </footer>
        </div>
    );
}
