import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
  
  // Redirect se já logado
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) navigate('/dashboard')
  }, [navigate])

  // Estado da calculadora
  const [calc, setCalc] = useState({
    cost: 45, labor: 15, fixed: 5000,
    revenue: 20000, taxes: 15, margin: 20
  })
  
  // FAQ state
  const [openFaq, setOpenFaq] = useState(0)

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { 
          e.target.classList.add('visible'); 
          obs.unobserve(e.target) 
        }
      })
    }, { threshold: 0.08 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const result = calcPrice(calc)

  // Composition bar percentages for the demo result
  const getComposition = () => {
    if (!result) return { dp: 0, fp: 0, tp: 0, lp: 0 };
    const dp = ( (calc.cost + calc.labor) / result.price) * 100;
    const fp = (calc.fixed / (calc.revenue || 1)) * 100;
    const tp = calc.taxes;
    const lp = Math.max(0, 100 - dp - fp - tp);
    return { dp, fp, tp, lp };
  }

  const { dp, fp, tp, lp } = getComposition();

  return (
    <div className="landing-page">
      {/* NAV */}
      <nav>
        <Link to="/" className="logo">Mark<em>ap</em></Link>
        <ul className="nav-links">
          <li><a href="#como-funciona">Como funciona</a></li>
          <li><a href="#comparativo">Comparativo</a></li>
          <li><a href="#precos">Preços</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="nav-right">
          <Link to="/login" className="btn-ghost">Entrar</Link>
          <Link to="/register" className="btn-nav">Calcular grátis →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-gradient"></div>
        <div className="hero-inner">
          <div>
            <div className="hero-badge"><span className="badge-dot"></span>Metodologia SEBRAE · Grátis para começar</div>
            <h1 className="hero-h">
              Você sabe quanto<br />
              <span className="hl-yellow">lucra de verdade</span><br />
              em <span className="hl-green">cada venda?</span>
            </h1>
            <p className="hero-sub">A maioria dos empresários precifica no achismo. Resultado: <strong>trabalha muito e no fim do mês não sobra nada.</strong> O Markap mostra em 3 minutos se seus preços estão certos.</p>
            <div className="hero-ctas">
              <Link to="/register" className="btn-primary">Calcular meu primeiro produto →</Link>
              <a href="#como-funciona" className="btn-secondary">Ver como funciona</a>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars">
                <div className="pavatar" style={{ background: '#1A5C3A' }}>MC</div>
                <div className="pavatar" style={{ background: '#3B82F6' }}>RF</div>
                <div className="pavatar" style={{ background: '#8B5CF6' }}>JS</div>
              </div>
              <span className="proof-text"><strong>+2.400 empresários</strong> já precificam com o Markap · ⭐ 4.8</span>
            </div>
          </div>

          {/* REAL APP MOCKUP */}
          <div className="hero-right">
            <div className="app-window">
              <div className="app-nav">
                <div className="app-logo">Mark<em>ap</em></div>
                <div className="app-nav-links">
                  <span className="anl">Dashboard</span>
                  <span className="anl active">Calculadora</span>
                  <span className="anl">Meus Produtos</span>
                </div>
                <div className="app-nav-cta">+ Novo Cálculo</div>
              </div>

              <div className="app-body">
                <div className="app-left">
                  <div className="app-header">
                    <div className="app-h-title">Calculadora de Precificação</div>
                    <div className="app-h-sub">Analise a rentabilidade e encontre o preço ideal.</div>
                  </div>

                  <div className="app-progress">
                    <div className="progress-top"><span>Progresso do preenchimento</span><strong>100%</strong></div>
                    <div className="progress-bar"><div className="progress-fill"></div></div>
                    <div className="progress-ok">✓ Boa precificação! Seu produto tem margem saudável.</div>
                  </div>

                  <div className="app-form">
                    <div className="form-section-title">
                      <div className="fs-num">✓</div>
                      <span className="fs-label">Dados do Produto</span>
                    </div>
                    <div className="form-grid">
                      <div className="form-field" style={{ gridColumn: '1/-1' }}>
                        <span className="field-label">Nome do Produto</span>
                        <div className="field-input">Bolsa de Couro Artesanal</div>
                      </div>
                      <div className="form-field">
                        <span className="field-label">Custo de Produção</span>
                        <div className="field-input green-focus">R$ 45,00</div>
                      </div>
                      <div className="form-field">
                        <span className="field-label">Margem Desejada</span>
                        <div className="field-input">22 %</div>
                      </div>
                      <div className="form-field">
                        <span className="field-label">Despesas Fixas</span>
                        <div className="field-input">R$ 12,50</div>
                      </div>
                      <div className="form-field">
                        <span className="field-label">Impostos</span>
                        <div className="field-input">12 %</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="app-right">
                  <div className="result-main-card">
                    <div className="rmc-eye">
                      <span>Preço Sugerido</span>
                      <span className="rmc-healthy">✓ Saudável</span>
                    </div>
                    <div className="rmc-price">R$ 127,90</div>
                    <div className="rmc-margin">Margem líquida: R$ 38,40 (30%)</div>
                  </div>

                  <div className="comp-card">
                    <div className="comp-label">Composição do Preço</div>
                    <div className="comp-bar">
                      <div style={{ width: '35%', background: '#FF6B6B' }}></div>
                      <div style={{ width: '20%', background: '#F59E0B' }}></div>
                      <div style={{ width: '15%', background: '#8B5CF6' }}></div>
                      <div style={{ width: '30%', background: '#22C55E' }}></div>
                    </div>
                    <div className="comp-legend">
                      <div className="cl-item"><div className="cl-dot" style={{ background: '#FF6B6B' }}></div>Custos (R$45)</div>
                      <div className="cl-item"><div className="cl-dot" style={{ background: '#F59E0B' }}></div>Impostos (R$19)</div>
                      <div className="cl-item"><div className="cl-dot" style={{ background: '#8B5CF6' }}></div>Despesas (R$25)</div>
                      <div className="cl-item"><div className="cl-dot" style={{ background: '#22C55E' }}></div>Lucro (R$38)</div>
                    </div>
                  </div>

                  <div className="be-card">
                    <div className="be-label">Ponto de Equilíbrio</div>
                    <div className="be-num">47 <span>unidades/mês</span></div>
                    <div className="be-sub">Venda mínima para cobrir custos fixos.</div>
                    <div className="be-bar"><div className="be-dot"></div></div>
                    <div className="be-labels"><span>PREJUÍZO</span><span>LUCRO</span></div>
                  </div>

                  <div className="ai-card">
                    <div className="ai-title">✨ Diagnóstico IA</div>
                    <div className="ai-item"><span className="ai-icon">↑</span> Seu preço está <strong style={{ color: '#22C55E' }}>5% abaixo</strong> da média. Considere R$135,00.</div>
                    <div className="ai-item"><span className="ai-icon">💡</span> Reduzir embalagem em R$2 aumentaria o lucro anual em <strong style={{ color: '#22C55E' }}>R$1.200</strong>.</div>
                    <div className="ai-btn">🔒 Desbloquear dicas PRO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat"><div className="stat-n g">+2.400</div><div className="stat-l">Empresários ativos</div></div>
          <div className="stat"><div className="stat-n g">R$890k</div><div className="stat-l">Margens recuperadas</div></div>
          <div className="stat"><div className="stat-n">3 min</div><div className="stat-l">Para precificar</div></div>
          <div className="stat"><div className="stat-n g">4.8 ★</div><div className="stat-l">Avaliação média</div></div>
        </div>
      </div>

      {/* PROBLEM */}
      <section className="section" id="como-funciona">
        <div className="section-inner">
          <div className="tag-pill tp-coral reveal">😬 O problema</div>
          <h2 className="section-h reveal">Você trabalha muito.<br /><span className="dim">O dinheiro não aparece.</span></h2>
          <div className="prob-grid">
            <div className="prob-card a reveal">
              <div className="prob-n">01</div>
              <span className="prob-emoji">🤔</span>
              <h3 className="prob-t">Copia o concorrente</h3>
              <p className="prob-p">Sem saber se ele está lucrando ou quebrando devagar. O preço certo é baseado nos SEUS custos, não nos dele.</p>
            </div>
            <div className="prob-card b reveal">
              <div className="prob-n">02</div>
              <span className="prob-emoji">😰</span>
              <h3 className="prob-t">Vende muito, sobra nada</h3>
              <p className="prob-p">Faturamento alto, conta no zero. Acontece quando o preço ignora os custos fixos do negócio.</p>
            </div>
            <div className="prob-card c reveal">
              <div className="prob-n">03</div>
              <span className="prob-emoji">📊</span>
              <h3 className="prob-t">Planilha desatualizada</h3>
              <p className="prob-p">Funciona até perder o arquivo ou esquecer de atualizar. Quando o cálculo está errado, você nem sabe.</p>
            </div>
          </div>
          <div className="prob-cta reveal">
            <div className="prob-cta-text">Se você se identificou,<br />o Markap foi <em>feito para você.</em></div>
            <Link to="/register" className="btn-primary" style={{ flexShrink: 0 }}>Resolver agora →</Link>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section section-bg" id="comparativo">
        <div className="section-inner-md">
          <div className="tag-pill tp-yellow reveal">📊 Comparativo</div>
          <h2 className="section-h reveal">Markap vs <em>Planilha Excel</em></h2>
          <div className="comp-2col">
            <div className="comp-col old reveal">
              <div className="comp-col-head">❌ Planilha Excel</div>
              <div className="comp-body">
                <div className="ci">😓 &nbsp;<strong>20–40 min</strong> para precificar 1 produto</div>
                <div className="ci">😓 &nbsp;Risco de <strong>perder o arquivo</strong></div>
                <div className="ci">😓 &nbsp;Custo fixo <strong>quase sempre errado</strong></div>
                <div className="ci">😓 &nbsp;Sem alertas de <strong>margem crítica</strong></div>
                <div className="ci">😓 &nbsp;Sem diagnóstico — <strong>você interpreta tudo</strong></div>
                <div className="ci">😓 &nbsp;Não funciona bem <strong>no celular</strong></div>
              </div>
            </div>
            <div className="comp-col new reveal">
              <div className="comp-col-head">✓ <span>Markap</span></div>
              <div className="comp-body">
                <div className="ci">✅ &nbsp;Resultado em <strong>3 minutos</strong></div>
                <div className="ci">✅ &nbsp;Dados salvos <strong>na nuvem automaticamente</strong></div>
                <div className="ci">✅ &nbsp;Metodologia <strong>SEBRAE</strong>, sem erro de cálculo</div>
                <div className="ci">✅ &nbsp;Alertas automáticos de <strong>margem crítica</strong></div>
                <div className="ci">✅ &nbsp;Diagnóstico completo, <strong>score 0 a 100</strong></div>
                <div className="ci">✅ &nbsp;Funciona em <strong>qualquer dispositivo</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="section">
        <div className="section-inner">
          <div className="tag-pill tp-green reveal">✦ Como funciona</div>
          <h2 className="section-h reveal">3 passos para saber<br /><em>se você está lucrando</em></h2>
          <div className="steps-3">
            <div className="step reveal">
              <div className="step-ghost">1</div>
              <div className="step-n">// passo 01</div>
              <h3 className="step-t">Informe os <em>custos</em></h3>
              <p className="step-p">Custo do produto, mão de obra, embalagem. Os custos fixos ficam no perfil — preenche uma vez para todos os produtos.</p>
              <span className="step-chip chip-g">~2 minutos</span>
            </div>
            <div className="step reveal">
              <div className="step-ghost">2</div>
              <div className="step-n">// passo 02</div>
              <h3 className="step-t">Receba o <em>preço ideal</em></h3>
              <p className="step-p">Calculamos o preço que cobre todos os custos — diretos e fixos — e garante a margem que você definiu querer.</p>
              <span className="step-chip chip-y">instantâneo</span>
            </div>
            <div className="step reveal">
              <div className="step-ghost">3</div>
              <div className="step-n">// passo 03</div>
              <h3 className="step-t">Veja o <em>diagnóstico</em></h3>
              <p className="step-p">Score de saúde, ponto de equilíbrio, simulador de cenários e alertas automáticos de margem crítica por produto.</p>
              <span className="step-chip chip-b">diagnóstico completo</span>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="section demo-section">
        <div className="demo-inner">
          <div className="tag-pill tp-green reveal" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.2)' }}>// demo interativa</div>
          <h2 className="demo-h reveal">Calcule agora.<br />Sem criar conta.</h2>
          <p className="demo-sub reveal">Preencha os dados e veja o resultado em tempo real.</p>
          <div className="demo-card reveal">
            <div className="demo-topbar">
              <div className="dd" style={{ background: '#FF5F57' }}></div>
              <div className="dd" style={{ background: '#FFBD2E' }}></div>
              <div className="dd" style={{ background: '#28CA41' }}></div>
              <span className="demo-url">markap.com.br/calculadora</span>
            </div>
            <div className="demo-grid">
              <div className="demo-left">
                <label className="il" htmlFor="cost">Custo do produto (R$)</label>
                <input 
                  className="ifield" 
                  type="number" 
                  id="cost" 
                  value={calc.cost}
                  onChange={e => setCalc(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                />
                <label className="il" htmlFor="labor">Mão de obra (R$)</label>
                <input 
                  className="ifield" 
                  type="number" 
                  id="labor" 
                  value={calc.labor}
                  onChange={e => setCalc(prev => ({ ...prev, labor: parseFloat(e.target.value) || 0 }))}
                />
                <label className="il" htmlFor="fixed">Custos fixos mensais (R$)</label>
                <input 
                  className="ifield" 
                  type="number" 
                  id="fixed" 
                  value={calc.fixed}
                  onChange={e => setCalc(prev => ({ ...prev, fixed: parseFloat(e.target.value) || 0 }))}
                />
                <label className="il" htmlFor="revenue">Faturamento previsto (R$)</label>
                <input 
                  className="ifield" 
                  type="number" 
                  id="revenue" 
                  value={calc.revenue}
                  onChange={e => setCalc(prev => ({ ...prev, revenue: parseFloat(e.target.value) || 1 }))}
                />
                <div className="irow">
                  <div>
                    <label className="il" htmlFor="taxes">Impostos + taxas %</label>
                    <input 
                      className="ifield" 
                      type="number" 
                      id="taxes" 
                      value={calc.taxes}
                      onChange={e => setCalc(prev => ({ ...prev, taxes: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="il" htmlFor="margin">Margem desejada %</label>
                    <input 
                      className="ifield" 
                      type="number" 
                      id="margin" 
                      value={calc.margin}
                      onChange={e => setCalc(prev => ({ ...prev, margin: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>
              <div className="demo-right">
                <div className="r-eye">Preço de venda ideal</div>
                <div className="r-price">
                  <span className="rs">R$</span>
                  <span>{result ? result.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}</span>
                </div>
                <div className={`r-tag ${calc.margin >= 15 ? 'rt-ok' : calc.margin >= 5 ? 'rt-warn' : 'rt-bad'}`}>
                  {calc.margin >= 15 ? '✓ Lucrativo' : calc.margin >= 5 ? '⚡ Atenção' : '⚠ Risco'}
                </div>
                <div className="r-metrics">
                  <div className="r-mini"><div className="rmv g">{calc.margin}%</div><div className="rml">Margem líquida</div></div>
                  <div className="r-mini"><div className="rmv a">{result ? result.markup.toFixed(2) + 'x' : '---'}</div><div className="rml">Markup</div></div>
                </div>
                <div className="r-barwrap">
                   <div style={{ width: `${dp}%`, background: '#3B82F6' }}></div>
                   <div style={{ width: `${fp}%`, background: '#8B5CF6' }}></div>
                   <div style={{ width: `${tp}%`, background: '#EAB308' }}></div>
                   <div style={{ width: `${lp}%`, background: '#22C55E' }}></div>
                </div>
                <div className="r-barleg">
                  <div className="bli"><div className="bld" style={{ background: '#3B82F6' }}></div>Custo direto</div>
                  <div className="bli"><div className="bld" style={{ background: '#8B5CF6' }}></div>Custo fixo</div>
                  <div className="bli"><div className="bld" style={{ background: '#EAB308' }}></div>Impostos</div>
                  <div className="bli"><div className="bld" style={{ background: '#22C55E' }}></div>Lucro</div>
                </div>
                <Link to="/register" className="btn-demo-cta">Ver diagnóstico completo →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-inner">
          <div className="tag-pill tp-blue reveal">⭐ Depoimentos</div>
          <h2 className="section-h reveal">Quem usa o Markap<br /><em>não volta para a planilha.</em></h2>
          <div className="testi-grid">
            <div className="testi a reveal">
              <div className="t-stars"><span className="t-star">★</span><span className="t-star">★</span><span className="t-star">★</span><span className="t-star">★</span><span className="t-star">★</span></div>
              <p className="t-quote">Descobri que vendia minha bolsa com margem de 3%. Achava que estava lucrando porque vendia bastante. O Markap mostrou que precisava cobrar R$45 a mais. No primeiro mês recuperei R$1.200.</p>
              <div className="t-foot"><div className="t-av" style={{ background: '#1A5C3A' }}>MC</div><div><div className="t-name">Marina C.</div><div className="t-role">Artesã de bolsas · SP</div></div></div>
            </div>
            <div className="testi b reveal">
              <div className="t-stars"><span className="t-star">★</span><span className="t-star">★</span><span className="t-star">★</span><span className="t-star">★</span><span className="t-star">★</span></div>
              <p className="t-quote">Meu brigadeiro gourmet estava abaixo do preço mínimo e eu nem sabia. Ajustei e a margem foi de 8% para 22% em uma semana.</p>
              <div className="t-foot"><div className="t-av" style={{ background: '#3B82F6' }}>RF</div><div><div className="t-name">Ricardo F.</div><div className="t-role">Doceiro gourmet · BH</div></div></div>
            </div>
            <div className="testi c reveal">
              <div className="t-stars"><span className="t-star">★</span><span className="t-star">★</span><span className="t-star">★</span><span className="t-star">★</span><span className="t-star">★</span></div>
              <p className="t-quote">O simulador salvou minha promoção de fim de ano. Ia dar 20% de desconto sem saber que daria prejuízo. O Markap mostrou que o máximo seguro era 11%.</p>
              <div className="t-foot"><div className="t-av" style={{ background: '#8B5CF6' }}>JS</div><div><div className="t-name">Juliana S.</div><div className="t-role">Prestadora de serviços · CWB</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section section-bg" id="precos">
        <div className="section-inner">
          <div className="tag-pill tp-green reveal">💎 Planos</div>
          <h2 className="section-h reveal">Comece grátis.<br /><span className="dim">Evolua quando precisar.</span></h2>
          <div className="pricing-grid">
            <div className="price-card reveal">
              <div className="plan-tag">Grátis</div>
              <div className="plan-price">R$0</div>
              <div className="plan-period">para sempre</div>
              <ul className="pfeats">
                <li><span className="pok">✓</span> Até 5 produtos</li>
                <li><span className="pok">✓</span> Cálculo de preço ideal</li>
                <li><span className="pok">✓</span> Composição de preço</li>
                <li><span className="pno">✗</span> Diagnóstico com IA</li>
                <li><span className="pno">✗</span> Simulador de cenários</li>
                <li><span className="pno">✗</span> Score de saúde</li>
              </ul>
              <Link to="/register" className="btn-plan">Começar grátis</Link>
            </div>
            <div className="price-card feat reveal">
              <div className="popular-badge">Mais popular</div>
              <div className="plan-tag">Pro</div>
              <div className="plan-price">R$29</div>
              <div className="plan-period">/mês · cancele quando quiser</div>
              <ul className="pfeats">
                <li><span className="pok">✓</span> Produtos ilimitados</li>
                <li><span className="pok">✓</span> Diagnóstico com IA</li>
                <li><span className="pok">✓</span> Simulador de cenários</li>
                <li><span className="pok">✓</span> Score de saúde 0–100</li>
                <li><span className="pok">✓</span> Alertas de margem crítica</li>
                <li><span className="pok">✓</span> Relatório PDF mensal</li>
              </ul>
              <Link to="/register" className="btn-plan inv">Testar 7 dias grátis →</Link>
            </div>
            <div className="price-card reveal">
              <div className="plan-tag">Business</div>
              <div className="plan-price">R$89</div>
              <div className="plan-period">/mês · para equipes</div>
              <ul className="pfeats">
                <li><span className="pok">✓</span> Tudo do Pro</li>
                <li><span className="pok">✓</span> Múltiplos usuários</li>
                <li><span className="pok">✓</span> Múltiplos CNPJs</li>
                <li><span className="pok">✓</span> Integração planilhas</li>
                <li><span className="pok">✓</span> Suporte prioritário</li>
                <li><span className="pok">✓</span> Onboarding dedicado</li>
              </ul>
              <Link to="/contact" className="btn-plan">Falar com vendas</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="section-inner-sm">
          <div className="tag-pill tp-coral reveal">❓ Dúvidas</div>
          <h2 className="section-h reveal" style={{ maxWidth: '100%' }}>Perguntas <em>frequentes</em></h2>
          
          {[
            { q: 'O Markap funciona para qualquer negócio?', a: 'Sim. Comércio, artesanato, alimentação, serviços — a metodologia se adapta ao seu regime tributário e tipo de negócio. No cadastro você informa seu segmento e o sistema ajusta automaticamente.' },
            { q: 'É realmente grátis para começar?', a: 'O plano Free é grátis para sempre — sem limite de tempo. Você pode precificar até 5 produtos sem pagar nada. O Pro (R$29/mês) desbloqueia produtos ilimitados e diagnóstico com IA.' },
            { q: 'A metodologia de cálculo é confiável?', a: 'Usamos a metodologia de markup com rateio de custos fixos por faturamento, recomendada pelo SEBRAE para pequenas empresas — o mesmo método ensinado em cursos de gestão financeira.' },
            { q: 'Preciso instalar alguma coisa?', a: 'Não. O Markap é 100% online. Funciona no navegador do computador, tablet e celular. Seus dados ficam salvos na nuvem automaticamente.' },
            { q: 'Posso cancelar quando quiser?', a: 'Sim, sem fidelidade e sem multa. Cancele quando quiser pelo próprio painel. O acesso Pro continua até o fim do período já pago.' }
          ].map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''} reveal`}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                {faq.q}
                <span className="faq-toggle">+</span>
              </button>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <div className="cta-inner">
          <h2 className="cta-h">Seu preço está certo<br />ou te custando <em>dinheiro?</em></h2>
          <p className="cta-sub">Descubra em 3 minutos. Grátis, sem cartão de crédito.</p>
          <Link to="/register" className="btn-cta">Calcular meu primeiro produto →</Link>
          <div className="cta-trust">
            <span className="ct">🔒 Dados seguros</span>
            <span className="ct">🇧🇷 Feito no Brasil</span>
            <span className="ct">⭐ Metodologia SEBRAE</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="ft-grid">
            <div>
              <div className="ft-brand">Mark<em>ap</em></div>
              <p className="ft-desc">Precificação inteligente para quem trabalha de verdade.</p>
            </div>
            <div>
              <div className="ft-col-title">Produto</div>
              <ul className="ft-links">
                <li><a href="#como-funciona">Como funciona</a></li>
                <li><a href="#precos">Preços</a></li>
                <li><Link to="/register">Calculadora</Link></li>
              </ul>
            </div>
            <div>
              <div className="ft-col-title">Empresa</div>
              <ul className="ft-links">
                <li><a href="#">Sobre</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contato</a></li>
              </ul>
            </div>
            <div>
              <div className="ft-col-title">Legal</div>
              <ul className="ft-links">
                <li><a href="#">Termos</a></li>
                <li><a href="#">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="ft-bottom"><span>© 2026 Markap · markap.com.br</span><span>contato@markap.com.br</span></div>
        </div>
      </footer>
    </div>
  )
}

// Função de cálculo pura (fora do componente)
function calcPrice({ cost, labor, fixed, revenue, taxes, margin }) {
  const direct = cost + labor
  const cfPct = (fixed / revenue) * 100
  const denom = 100 - cfPct - taxes - margin
  if (denom <= 0) return null
  const markup = 100 / denom
  const price = direct * markup
  return { price, markup, direct, cfPct, taxes, margin }
}
