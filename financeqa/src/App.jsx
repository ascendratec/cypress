import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, ArrowUpDown, LogOut, Edit2, Trash2, Wallet, CheckCircle } from 'lucide-react';

const DEFAULT_CREDENTIALS = {
  email: 'admin@finance.app',
  password: '123456'
};

const FinanceApp = () => {
  // Estado para Notificações (Toasts)
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Autenticação persistente no sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  
  // Transações persistentes
  const [transactions, setTransactions] = useState(() => {
    const saved = sessionStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    tipo: 'Despesa',
    categoria: 'Outros',
    metodoPagamento: 'Dinheiro',
    data: new Date().toISOString().split('T')[0],
    comprovante: null,
    recorrente: null
  });
  
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    sessionStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (loginEmail === DEFAULT_CREDENTIALS.email && loginPassword === DEFAULT_CREDENTIALS.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
    } else {
      setLoginError('Email ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!formData.valor || parseFloat(formData.valor) <= 0) errors.valor = 'O valor deve ser positivo';
    if (!formData.data) errors.data = 'Data é obrigatória';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitTransaction = () => {
    if (!validateForm()) return;

    const transaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      ...formData,
      valor: parseFloat(formData.valor)
    };

    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? transaction : t));
      showToast('Salvo com sucesso!', 'success');
    } else {
      setTransactions([...transactions, transaction]);
      const msg = formData.tipo === 'Depósito' ? 'Depósito adicionado com sucesso!' : 'Despesa adicionada com sucesso!';
      showToast(msg, 'success');
    }
    resetForm();
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    showToast('Transação excluída com sucesso!', 'error');
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      valor: '',
      tipo: 'Despesa',
      categoria: 'Outros',
      metodoPagamento: 'Dinheiro',
      data: new Date().toISOString().split('T')[0],
      comprovante: null,
      recorrente: null
    });
    setFormErrors({});
    setShowModal(false);
    setEditingTransaction(null);
  };

  const receitas = transactions.filter(t => t.tipo === 'Depósito').reduce((acc, t) => acc + t.valor, 0);
  const despesas = transactions.filter(t => t.tipo === 'Despesa').reduce((acc, t) => acc + t.valor, 0);
  const saldo = receitas - despesas;

  // Dados para o gráfico de pizza por categoria
  const categoryTotals = transactions
    .filter(t => t.tipo === 'Despesa')
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {});

  const totalDespesas = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const categoryData = Object.entries(categoryTotals)
    .map(([categoria, valor]) => ({
      categoria,
      valor,
      percentage: totalDespesas > 0 ? Math.round((valor / totalDespesas) * 100) : 0
    }))
    .sort((a, b) => b.valor - a.valor);

  const categoryColors = {
    'Outros': '#6b7280',
    'Transporte': '#ef4444',
    'Alimentação': '#f59e0b',
    'Moradia': '#10b981',
    'Saúde': '#3b82f6',
    'Lazer': '#8b5cf6'
  };

  let cumulative = 0;
  const gradientStops = categoryData.map(item => {
    const start = cumulative;
    cumulative += item.percentage;
    return `${categoryColors[item.categoria]} ${start}% ${cumulative}%`;
  }).join(', ');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-black">
                <Wallet size={24} />
              </div>
              <span className="text-white text-2xl font-bold">finance.qa</span>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">E-mail</label>
              <input 
                data-cy="login-email"
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"
                placeholder="seu e-mail"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Senha</label>
              <input 
                data-cy="login-password"
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-green-300 outline-none"
                placeholder="sua senha"
              />
            </div>
            {loginError && <p data-cy="login-error" className="text-red-500 text-sm">{loginError}</p>}
            <button 
              data-cy="login-button"
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition"
            >
              Entrar
            </button>
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
            <div className="text-gray-600 text-sm">
              <p>E-mail: admin@finance.app</p>
              <p>Senha: 123456</p>
            </div>

            </div>


          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="border-b border-gray-800 px-8 py-4 flex justify-between items-center bg-black sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-black">
              <Wallet size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight">finance.qa</span>
          </div>
          <nav className="flex gap-6">
            <button 
              data-cy="nav-dashboard"
              onClick={() => setCurrentPage('dashboard')}
              className={`text-sm font-medium ${currentPage === 'dashboard' ? 'text-green-500' : 'text-gray-500 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              data-cy="nav-transactions"
              onClick={() => setCurrentPage('transactions')}
              className={`text-sm font-medium ${currentPage === 'transactions' ? 'text-green-500' : 'text-gray-500 hover:text-white'}`}
            >
              Transações
            </button>
          </nav>
        </div>
        <button  data-cy="logout-button" onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition">
          <LogOut size={20} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {currentPage === 'dashboard' ? (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-500">Bem-vindo ao seu controle financeiro</p>
              </div>
              <button 
                data-cy="btn-new-transaction"
                onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
              >
                Adicionar Transações <ArrowUpDown size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <Wallet size={16} /> <span>Saldo</span>
                </div>
                <h2 data-cy="total-balance" className="text-3xl font-bold">R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <div className="flex items-center gap-2 text-green-500 mb-4">
                  <TrendingUp size={16} /> <span>Receita</span>
                </div>
                <h2 data-cy="total-income" className="text-3xl font-bold">R$ {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <div className="flex items-center gap-2 text-red-500 mb-4">
                  <TrendingDown size={16} /> <span>Despesas</span>
                </div>
                <h2 data-cy="total-expense" className="text-3xl font-bold">R$ {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col items-center">
                <h3 className="w-full text-left font-bold mb-8">Resumo por Categoria</h3>
                <div className="w-48 h-48 rounded-full" style={{ background: totalDespesas > 0 ? `conic-gradient(${gradientStops})` : '#374151' }}></div>
                <div className="mt-4 space-y-2 w-full">
                  {categoryData.map(item => (
                    <div key={item.categoria} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: categoryColors[item.categoria] }}></div>
                      <span className="flex-1">{item.categoria}</span>
                      <span>{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <div className="flex justify-between mb-6">
                  <h3 className="font-bold">Últimas Transações</h3>
                  <button onClick={() => setCurrentPage('transactions')} className="text-green-500 text-sm hover:underline">Ver mais</button>
                </div>
                <div className="space-y-4">
                  {transactions.slice(-5).reverse().map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-black rounded-xl border border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-800 p-2 rounded-lg"><Wallet size={16} /></div>
                        <div>
                          <p className="font-medium">{t.nome}</p>
                          <p className="text-xs text-gray-500">{t.data}</p>
                        </div>
                      </div>
                      <span className={t.tipo === 'Depósito' ? 'text-green-500' : 'text-red-500'}>
                        {t.tipo === 'Depósito' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                      </span>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Transações</h1>
              <button 
                data-cy="btn-new-transaction"
                onClick={() => setShowModal(true)}
                className="bg-green-500 text-black px-4 py-2 rounded-lg font-bold transition hover:bg-green-600"
              >
                Adicionar Transações
              </button>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-800 text-gray-400 text-sm">
                  <tr>
                    <th className="p-4">Nome</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Método</th>
                    <th className="p-4">Data</th>
                    <th className="p-4">Recorrente</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Ações</th>
                  </tr>
                </thead>
                <tbody data-cy="transactions-list">
                  {transactions.map(t => (
                    <tr key={t.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4">{t.nome}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${t.tipo === 'Depósito' ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>
                          ● {t.tipo}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{t.categoria}</td>
                      <td className="p-4 text-gray-400">{t.metodoPagamento}</td>
                      <td className="p-4 text-gray-400">{t.data}</td>
                      <td className="p-4 text-gray-400">{t.recorrente ? t.recorrente.charAt(0).toUpperCase() + t.recorrente.slice(1) : '-'}</td>
                      <td className={`p-4 font-bold ${t.tipo === 'Depósito' ? 'text-green-500' : 'text-red-500'}`}>
                        {t.tipo === 'Depósito' ? '+' : '-'}R$ {t.valor.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button data-cy={`edit-${t.nome.replace(/\s+/g, '-').toLowerCase()}`} onClick={() => { setEditingTransaction(t); setFormData({...t, valor: t.valor.toString(), comprovante: t.comprovante || null, recorrente: t.recorrente || null}); setShowModal(true); }} className="text-gray-500 hover:text-white"><Edit2 size={16}/></button>
                          <button data-cy={`delete-${t.nome.replace(/\s+/g, '-').toLowerCase()}`} onClick={() => handleDeleteTransaction(t.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast.show && (
        <div 
          data-cy="toast"
          className={`fixed bottom-5 right-5 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 flex items-center gap-3 z-[60] animate-bounce ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          } text-white font-bold border border-white/20`}
        >
          {toast.type === 'error' ? <Trash2 size={20} /> : <CheckCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-2xl" data-cy="transaction-modal">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingTransaction ? 'Editar transação' : 'Criar transação'}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-400">Nome</label>
                <input 
                  data-cy="input-nome"
                  className={`w-full bg-black border ${formErrors.nome ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 outline-none focus:border-green-500`}
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Aluguel"
                />
                {formErrors.nome && <p data-cy="error-nome" className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Valor</label>
                <input 
                  data-cy="input-valor"
                  type="number"
                  className={`w-full bg-black border ${formErrors.valor ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 outline-none focus:border-green-500`}
                  value={formData.valor}
                  onChange={e => setFormData({...formData, valor: e.target.value})}
                  placeholder="0.00"
                />
                {formErrors.valor && <p data-cy="error-valor" className="text-red-500 text-xs mt-1">{formErrors.valor}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Tipo</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio"
                        name="tipo"
                        value="Despesa"
                        checked={formData.tipo === 'Despesa'}
                        onChange={e => setFormData({...formData, tipo: e.target.value})}
                        className="text-green-500"
                      />
                      Despesa
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio"
                        name="tipo"
                        value="Depósito"
                        checked={formData.tipo === 'Depósito'}
                        onChange={e => setFormData({...formData, tipo: e.target.value})}
                        className="text-green-500"
                      />
                      Depósito
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Categoria</label>
                  <select 
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none"
                    value={formData.categoria}
                    onChange={e => setFormData({...formData, categoria: e.target.value})}
                  >
                    <option value="Outros">Outros</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Renda">Renda</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Data</label>
                <input 
                  type="date"
                  className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none"
                  value={formData.data}
                  onChange={e => setFormData({...formData, data: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-400">Recorrente</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      data-cy="checkbox-mensal"
                      type="checkbox"
                      checked={formData.recorrente === 'mensal'}
                      onChange={(e) => setFormData({...formData, recorrente: e.target.checked ? 'mensal' : null})}
                      className="text-green-500"
                    />
                    Mensal
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      data-cy="checkbox-semanal"
                      type="checkbox"
                      checked={formData.recorrente === 'semanal'}
                      onChange={(e) => setFormData({...formData, recorrente: e.target.checked ? 'semanal' : null})}
                      className="text-green-500"
                    />
                    Semanal
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Comprovante (opcional)</label>
                <input 
                  type="file"
                  className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-green-500"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({...formData, comprovante: file.name});
                    }
                  }}
                />
                {formData.comprovante && <p className="text-xs text-gray-500 mt-1">Arquivo atual: {formData.comprovante}</p>}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-bold transition">Cancelar</button>
                <button 
                  type="button"
                  data-cy="btn-submit-transaction"
                  onClick={handleSubmitTransaction} 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-black py-3 rounded-lg font-bold transition"
                >
                  {editingTransaction ? 'Salvar Alterações' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceApp;