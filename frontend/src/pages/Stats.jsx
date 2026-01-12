import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, transRes] = await Promise.all([
        transactionsAPI.getStats(),
        transactionsAPI.getAll()
      ]);
      setStats(statsRes.data.stats);
      setTransactions(transRes.data.transactions);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Carregando estatísticas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 glow-text">📊 Estatísticas</h1>
          <p className="text-gray-400">Acompanhe seu desempenho no Cosmic TON Rangers</p>
        </div>

        {/* Main Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Rangers */}
            <div className="cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-300">Rangers Ativos</h3>
                <span className="text-2xl">🎮</span>
              </div>
              <p className="text-4xl font-bold text-cyan-400">{stats.totalRangers}</p>
              <p className="text-sm text-gray-500 mt-2">Rangers em sua coleção</p>
            </div>

            {/* Total Invested */}
            <div className="cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-300">Total Investido</h3>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-4xl font-bold text-yellow-400">
                {stats.totalInvested.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-2">TON gastos</p>
            </div>

            {/* Total Earned */}
            <div className="cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-300">Total Ganho</h3>
                <span className="text-2xl">💎</span>
              </div>
              <p className="text-4xl font-bold text-green-400">
                {stats.totalEarned.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-2">TON ganhos</p>
            </div>

            {/* ROI */}
            <div className="cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-300">ROI</h3>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-4xl font-bold text-purple-400">{stats.roi}%</p>
              <p className="text-sm text-gray-500 mt-2">Retorno total</p>
            </div>
          </div>
        )}

        {/* Income Analysis */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Income */}
            <div className="cosmic-card p-6">
              <h2 className="text-2xl font-bold mb-6">💵 Análise de Renda</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Renda Diária</p>
                  <p className="text-3xl font-bold text-green-400">
                    {stats.dailyIncome.toFixed(2)} TON
                  </p>
                </div>
                <div className="pt-4 border-t border-purple-500/30">
                  <p className="text-gray-400 text-sm mb-2">Renda Mensal (estimada)</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {(stats.dailyIncome * 30).toFixed(2)} TON
                  </p>
                </div>
                <div className="pt-4 border-t border-purple-500/30">
                  <p className="text-gray-400 text-sm mb-2">Renda Anual (estimada)</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {(stats.dailyIncome * 365).toFixed(2)} TON
                  </p>
                </div>
              </div>
            </div>

            {/* Payback Period */}
            <div className="cosmic-card p-6">
              <h2 className="text-2xl font-bold mb-6">⏱️ Período de Retorno</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Dias até ROI 100%</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {Math.ceil(stats.totalInvested / stats.dailyIncome)} dias
                  </p>
                </div>
                <div className="pt-4 border-t border-purple-500/30">
                  <p className="text-gray-400 text-sm mb-2">Data estimada de retorno</p>
                  <p className="text-lg font-bold text-cyan-400">
                    {new Date(Date.now() + Math.ceil(stats.totalInvested / stats.dailyIncome) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="pt-4 border-t border-purple-500/30">
                  <p className="text-gray-400 text-sm mb-2">Progresso</p>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min((stats.totalEarned / stats.totalInvested) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {((stats.totalEarned / stats.totalInvested) * 100).toFixed(1)}% completo
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions History */}
        <div className="cosmic-card p-6">
          <h2 className="text-2xl font-bold mb-6">📜 Histórico de Transações</h2>

          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left py-3 px-4 text-gray-400">Tipo</th>
                    <th className="text-left py-3 px-4 text-gray-400">Valor</th>
                    <th className="text-left py-3 px-4 text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400">Descrição</th>
                    <th className="text-left py-3 px-4 text-gray-400">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-purple-500/10 hover:bg-purple-900/20 transition">
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-purple-900/50 rounded-full text-sm">
                          {tx.type === 'claim' ? '💎 Claim' : '🛒 Compra'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold">
                        {tx.type === 'claim' ? (
                          <span className="text-green-400">+{tx.amount.toFixed(2)} TON</span>
                        ) : (
                          <span className="text-red-400">-{tx.amount.toFixed(2)} TON</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          tx.status === 'completed' 
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {tx.status === 'completed' ? '✅ Completo' : '⏳ Pendente'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{tx.description}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Nenhuma transação encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
}
