import { useState, useEffect } from 'react';
import RangerCard from '../components/RangerCard';

export default function Inventory() {
  const [rangers, setRangers] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRangers();
  }, []);

  const loadRangers = async () => {
    try {
      // TODO: Integrar com API real
      // const response = await fetch('/api/rangers');
      // const data = await response.json();

      // Dados mockados para teste
      const mockRangers = [
        {
          id: '1',
          rarity: 'Cadete',
          isActive: true,
          energy: 85,
          farmedToday: 0.020,
          totalFarmed: 0.15,
          obtainedFrom: 'Baú Cadete',
          obtainedAt: '2026-01-10T10:00:00Z'
        },
        {
          id: '2',
          rarity: 'Explorador',
          isActive: false,
          energy: 100,
          farmedToday: 0,
          totalFarmed: 0,
          obtainedFrom: 'Baú Explorador',
          obtainedAt: '2026-01-11T15:30:00Z'
        },
        {
          id: '3',
          rarity: 'Elite',
          isActive: true,
          energy: 60,
          farmedToday: 0.300,
          totalFarmed: 2.5,
          obtainedFrom: 'Baú Elite',
          obtainedAt: '2026-01-05T08:00:00Z'
        }
      ];

      setRangers(mockRangers);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar Rangers:', error);
      setLoading(false);
    }
  };

  const handleActivate = async (ranger, activate) => {
    try {
      // TODO: Integrar com API real
      // await fetch(`/api/rangers/${ranger.id}/activate`, {
      //   method: 'POST',
      //   body: JSON.stringify({ active: activate })
      // });

      setRangers(prev => prev.map(r => 
        r.id === ranger.id ? { ...r, isActive: activate } : r
      ));

      alert(activate ? 
        `✅ ${ranger.rarity} ativado! Começará a farmar em breve.` : 
        `⏸️ ${ranger.rarity} desativado.`
      );
    } catch (error) {
      console.error('Erro ao ativar/desativar Ranger:', error);
      alert('❌ Erro ao atualizar status do Ranger');
    }
  };

  const handleClaim = async (ranger) => {
    try {
      // TODO: Integrar com API real
      // await fetch(`/api/rangers/${ranger.id}/claim`, { method: 'POST' });

      alert(`💰 Você recebeu ${ranger.farmedToday} TON!\n\nTotal farmado: ${ranger.totalFarmed + ranger.farmedToday} TON`);

      setRangers(prev => prev.map(r => 
        r.id === ranger.id ? { 
          ...r, 
          totalFarmed: r.totalFarmed + r.farmedToday,
          farmedToday: 0 
        } : r
      ));
    } catch (error) {
      console.error('Erro ao fazer claim:', error);
      alert('❌ Erro ao resgatar recompensa');
    }
  };

  const filteredRangers = rangers.filter(r => {
    if (filter === 'active') return r.isActive;
    if (filter === 'inactive') return !r.isActive;
    return true;
  });

  const totalDailyFarm = rangers
    .filter(r => r.isActive)
    .reduce((sum, r) => {
      const dailyFarm = {
        'Cadete': 0.025,
        'Explorador': 0.067,
        'Comandante': 0.185,
        'Elite': 0.364,
        'Estelar': 0.556,
        'Cósmico': 0.857
      };
      return sum + dailyFarm[r.rarity];
    }, 0);

  const totalFarmed = rangers.reduce((sum, r) => sum + r.totalFarmed, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌌</div>
          <p className="text-xl text-gray-400">Carregando Rangers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 glow-text">🎒 Meu Inventário</h1>
          <p className="text-gray-300 text-lg">
            Gerencie seus Rangers e reivindique recompensas
          </p>
        </div>

        {/* Stats Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="cosmic-card p-6">
            <p className="text-sm text-gray-500 uppercase mb-2">Total de Rangers</p>
            <p className="text-4xl font-bold text-purple-400">{rangers.length}</p>
          </div>
          <div className="cosmic-card p-6">
            <p className="text-sm text-gray-500 uppercase mb-2">Farm Diário Total</p>
            <p className="text-4xl font-bold text-green-400">{totalDailyFarm.toFixed(3)} TON</p>
          </div>
          <div className="cosmic-card p-6">
            <p className="text-sm text-gray-500 uppercase mb-2">Total Farmado</p>
            <p className="text-4xl font-bold text-yellow-400">{totalFarmed.toFixed(3)} TON</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              filter === 'all' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Todos ({rangers.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              filter === 'active' 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Ativos ({rangers.filter(r => r.isActive).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              filter === 'inactive' 
                ? 'bg-gradient-to-r from-red-600 to-orange-600' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Inativos ({rangers.filter(r => !r.isActive).length})
          </button>
        </div>

        {/* Grid de Rangers */}
        {filteredRangers.length === 0 ? (
          <div className="cosmic-card p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold mb-2">Nenhum Ranger encontrado</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Compre baús na loja para obter seus primeiros Rangers!' 
                : `Você não tem Rangers ${filter === 'active' ? 'ativos' : 'inativos'} no momento.`}
            </p>
            <a href="/shop" className="cosmic-button inline-block">
              🛒 Ir para a Loja
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRangers.map((ranger) => (
              <RangerCard
                key={ranger.id}
                ranger={ranger}
                showActions={true}
                onActivate={handleActivate}
                onClaim={handleClaim}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
