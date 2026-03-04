import React from 'react';

function App() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-neutral-border dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white">
              <span className="material-symbols-outlined block text-2xl">calculate</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">PrecificaAI</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a className="text-primary hover:opacity-80" href="#">Calculadora</a>
              <a className="text-slate-500 hover:text-primary transition-colors" href="#">Histórico</a>
              <a className="text-slate-500 hover:text-primary transition-colors" href="#">Configurações</a>
            </nav>
            <div className="flex items-center gap-3 border-l border-neutral-border dark:border-slate-700 pl-6">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
              </button>
              <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-neutral-border dark:border-slate-600">
                <img alt="Avatar do usuário" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHZgmyWpZrF_GkU-bxcqIVPMxSmXw-of3Q0bgV_2OJDBzUBxHfpRRTfLScpKXuC38fXRXXG1Nvem5IVQI6lhGVczwwdhiMFrf21YWZ1YbwTUbnbl8zVKihcJyC-m3zjrk3aVgB4dhRhN5MI0uc2Ya9xroZcHetdtk6WYsMr2HQa5RcDHrREFOdeQtaIOGtGE55hJKX-ynObexTZ5vzEak6FQqXT9AI60usZS3_4L6lev9M6r7ySpkSSg-StjwA7_R-Em3hwLmyZPKY" />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <a className="hover:text-primary" href="#">Dashboard</a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Formulário Completo</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">Calculadora: Formulário Vazio Detalhado</h2>
          <p className="text-slate-500 mt-1">Siga o passo a passo para descobrir a rentabilidade real do seu produto.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="w-full lg:w-[58%] space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-neutral-border dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">01</span>
                <h3 className="text-lg font-bold">Dados do Produto</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nome do Produto</label>
                  <input className="w-full h-12 rounded-lg border-neutral-border dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary px-3" placeholder="Ex: Camiseta 100% Algodão" type="text" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoria</label>
                  <select className="w-full h-12 rounded-lg border-neutral-border dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary px-3">
                    <option value="">Selecione...</option>
                    <option>Vestuário</option>
                    <option>Eletrônicos</option>
                    <option>Alimentação</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-neutral-border dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">02</span>
                  <h3 className="text-lg font-bold">Custo Direto</h3>
                </div>
                <button className="text-primary text-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">add_circle</span> Adicionar Item
                </button>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-lg flex gap-3 mb-6">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">lightbulb</span>
                <p className="text-sm text-blue-800 dark:text-blue-300">Insira aqui o valor de compra ou produção, incluindo embalagem e insumos diretos.</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-12 gap-3 items-center">
                  <input className="col-span-7 h-11 rounded-lg border-neutral-border dark:border-slate-700 bg-transparent px-3" placeholder="Item (Ex: Tecido)" type="text" />
                  <input className="col-span-4 h-11 rounded-lg border-neutral-border dark:border-slate-700 bg-transparent px-3" placeholder="R$ 0,00" type="number" />
                  <button className="col-span-1 text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg flex justify-between items-center border border-primary/20">
                <span className="font-bold text-slate-700 dark:text-slate-300">Total de Custos Diretos</span>
                <span className="text-xl font-black text-primary">R$ 0,00</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-neutral-border dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">03</span>
                <h3 className="text-lg font-bold">Custos Fixos</h3>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-4 rounded-lg flex gap-3 mb-6">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">info</span>
                <p className="text-sm text-amber-800 dark:text-amber-300">Gastos mensais que não variam com a venda (Ex: Aluguel, MEI, Software).</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Mensal Fixos</label>
                  <input className="w-full h-12 rounded-lg border-neutral-border dark:border-slate-700 bg-transparent px-3" placeholder="R$ 1.200,00" type="number" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Volume Esperado</label>
                  <input className="w-full h-10 bg-white dark:bg-slate-800 border-none rounded text-lg font-bold focus:ring-amber-500 px-3" placeholder="100 un" type="number" />
                </div>
              </div>
              <div className="bg-amber-500/10 p-4 rounded-lg flex justify-between items-center border border-amber-500/20">
                <span className="font-bold text-slate-700 dark:text-slate-300">Rateio por Unidade</span>
                <span className="text-xl font-black text-amber-600">R$ 0,00</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-neutral-border dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">04</span>
                <h3 className="text-lg font-bold">Despesas de Venda</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-neutral-border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:border-primary transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mb-2">credit_card</span>
                  <p className="font-bold text-sm">Cartão / Taxas</p>
                  <p className="text-xs text-slate-500">Taxas de transação</p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:border-primary transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mb-2">group</span>
                  <p className="font-bold text-sm">Comissão</p>
                  <p className="text-xs text-slate-500">Vendedores/Afiliados</p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:border-primary transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mb-2">storefront</span>
                  <p className="font-bold text-sm">Marketplace</p>
                  <p className="text-xs text-slate-500">ML, Shopee, Amazon</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-neutral-border dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">05</span>
                <h3 className="text-lg font-bold">Meta de Lucro</h3>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold">Margem Desejada (%)</label>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">0%</span>
                  </div>
                  <input className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" type="range" />
                </div>
                <div className="flex gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 opacity-50">
                    <span className="material-symbols-outlined text-sm">warning</span> Risco
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700">Equilíbrio</span>
                  <span className="px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1 opacity-50">
                    <span className="material-symbols-outlined text-sm">check_circle</span> Saudável
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full bg-primary-dark hover:bg-primary text-white py-5 rounded-xl font-bold text-lg shadow-lg shadow-primary-dark/20 transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined">calculate</span>
              Calcular Preço Ideal
            </button>
          </section>

          <aside className="w-full lg:w-[42%]">
            <div className="sticky top-28 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 min-h-[500px] flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 mb-8 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-primary to-transparent"></div>
                <span className="material-symbols-outlined text-7xl text-slate-300 dark:text-slate-600 relative z-10">balance</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">Seus resultados aparecem aqui</h4>
              <p className="text-slate-500 max-w-xs leading-relaxed">
                Preencha os campos à esquerda para que o algoritmo da PrecificaAI calcule seu preço de venda, lucro líquido e margem de contribuição.
              </p>
              <div className="mt-8 flex gap-2">
                <div className="size-2 rounded-full bg-primary/30 animate-pulse"></div>
                <div className="size-2 rounded-full bg-primary/30 animate-pulse delay-75"></div>
                <div className="size-2 rounded-full bg-primary/30 animate-pulse delay-150"></div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-neutral-border dark:border-slate-800 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <div className="bg-slate-800 p-1 rounded text-white">
              <span className="material-symbols-outlined text-xs block">calculate</span>
            </div>
            <span className="text-sm font-bold tracking-tight">PrecificaAI © 2024</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
            <a className="hover:text-primary transition-colors" href="#">Termos</a>
            <a className="hover:text-primary transition-colors" href="#">Suporte</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
