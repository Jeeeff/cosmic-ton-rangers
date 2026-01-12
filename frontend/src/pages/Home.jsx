import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionsAPI } from '../services/api';

export default function Home({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const response = await transactionsAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="cosmic-card p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🛸</div>
          <h2 className="text-3xl font-bold mb-4">Bem-vindo ao Cosmic TON Rangers!</h2>
          <p className="text-gray-300 mb-6">
            Conecte sua carteira TON para começar sua jornada cósmica e ganhar recompensas!
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-bold text-lg transition"
          >
            Conectar Carteira
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="cosmic-card p-8 mb-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🌌</div>
            <div>
              <h2 className="text-3xl font-bold glow-text">Bem-vindo, {user.firstName}!</h2>
              <p className="text-gray-300">Explore o universo e ganhe recompensas TON</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Carregando estatísticas...</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Rangers */}
            <div className="cosmic-card p-6 text-center">
              <div className="text-4xl mb-2">🎮</div>
              <p className="text-gray-400 text-sm">Rangers Ativos</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.totalRangers}</p>
            </div>

            {/* Total Invested */}
            <div className="cosmic-card p-6 text-center">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-gray-400 text-sm">Total Investido</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.totalInvested.toFixed(2)} TON</p>
            </div>

            {/* Total Earned */}
            <div className="cosmic-card p-6 text-center">
              <div className="text-4xl mb-2">💎</div>
              <p className="text-gray-400 text-sm">Total Ganho</p>
              <p className="text-3xl font-bold text-green-400">{stats.totalEarned.toFixed(2)} TON</p>
            </div>

            {/* Pending Reward */}
            <div className="cosmic-card p-6 text-center">
              <div className="text-4xl mb-2">⭐</div>
              <p className="text-gray-400 text-sm">Recompensa Pendente</p>
              <p className="text-3xl font-bold text-purple-400">{stats.pendingReward.toFixed(2)} TON</p>
            </div>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Daily Income */}
          <div className="cosmic-card p-6">
            <h3 className="text-xl font-bold mb-4">📊 Renda Diária</h3>
            <p className="text-4xl font-bold text-green-400 mb-2">
              {stats?.dailyIncome.toFixed(2)} TON
            </p>
            <p className="text-gray-400 text-sm">Por dia com seus Rangers ativos</p>
          </div>

          {/* ROI */}
          <div className="cosmic-card p-6">
            <h3 className="text-xl font-bold mb-4">📈 ROI</h3>
            <p className="text-4xl font-bold text-blue-400 mb-2">
              {stats?.roi}%
            </p>
            <p className="text-gray-400 text-sm">Retorno sobre investimento</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/shop')}
            className="cosmic-card p-6 text-center hover:bg-purple-600/20 transition"
          >
            <div className="text-4xl mb-2">🛒</div>
            <p className="font-bold">Comprar Rangers</p>
          </button>

          <button
            onClick={() => navigate('/inventory')}
            className="cosmic-card p-6 text-center hover:bg-blue-600/20 transition"
          >
            <div className="text-4xl mb-2">🎮</div>
            <p className="font-bold">Meus Rangers</p>
          </button>

          <button
            onClick={() => navigate('/stats')}
            className="cosmic-card p-6 text-center hover:bg-green-600/20 transition"
          >
            <div className="text-4xl mb-2">📊</div>
            <p className="font-bold">Estatísticas</p>
          </button>
        </div>
      </div>
    </div>
  );
}
