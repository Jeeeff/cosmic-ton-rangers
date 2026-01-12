import { useState, useEffect } from 'react';

export default function Shop() {
  const [selectedChest, setSelectedChest] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const chests = [
    {
      id: 'cadete',
      name: 'Baú Cadete',
      price: 2,
      image: '/images/chests/bau_cadete.png',
      color: 'from-gray-600 to-yellow-600',
      description: '100% Cadete',
      rangers: [{ name: 'Cadete', chance: 100 }]
    },
    {
      id: 'explorador',
      name: 'Baú Explorador',
      price: 5,
      image: '/images/chests/bau_explorador.png',
      color: 'from-green-600 to-emerald-600',
      description: '70% Cadete, 30% Explorador',
      rangers: [
        { name: 'Cadete', chance: 70 },
        { name: 'Explorador', chance: 30 }
      ]
    },
    {
      id: 'comandante',
      name: 'Baú Comandante',
      price: 12,
      image: '/images/chests/bau_comandante.png',
      color: 'from-blue-600 to-cyan-600',
      description: '50% Explorador, 35% Comandante, 15% Elite',
      rangers: [
        { name: 'Explorador', chance: 50 },
        { name: 'Comandante', chance: 35 },
        { name: 'Elite', chance: 15 }
      ]
    },
    {
      id: 'elite',
      name: 'Baú Elite',
      price: 20,
      image: '/images/chests/bau_elite.png',
      color: 'from-red-600 to-orange-600',
      description: '50% Comandante, 40% Elite, 10% Estelar',
      rangers: [
        { name: 'Comandante', chance: 50 },
        { name: 'Elite', chance: 40 },
        { name: 'Estelar', chance: 10 }
      ]
    },
    {
      id: 'estelar',
      name: 'Baú Estelar',
      price: 25,
      image: '/images/chests/bau_estelar.png',
      color: 'from-purple-600 to-pink-600',
      description: '60% Elite, 35% Estelar, 5% Cósmico',
      rangers: [
        { name: 'Elite', chance: 60 },
        { name: 'Estelar', chance: 35 },
        { name: 'Cósmico', chance: 5 }
      ]
    },
    {
      id: 'cosmico',
      name: 'Baú Cósmico',
      price: 30,
      image: '/images/chests/bau_cosmico.png',
      color: 'from-yellow-600 to-purple-600',
      description: '60% Elite, 35% Estelar, 5% Cósmico',
      rangers: [
        { name: 'Elite', chance: 60 },
        { name: 'Estelar', chance: 35 },
        { name: 'Cósmico', chance: 5 }
      ]
    }
  ];

  // Buscar estatísticas globais
  useEffect(() => {
    fetchGlobalStats();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchGlobalStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchGlobalStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stats/global`);
      const data = await response.json();

      if (data.success) {
        setGlobalStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas globais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (chest) => {
    setSelectedChest(chest);
    // Aqui você vai integrar com TON Connect
    alert(`Comprando ${chest.name} por ${chest.price} TON!\n\nTotal com taxa (1%): ${(chest.price * 1.01).toFixed(2)} TON`);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 glow-text">🛒 Loja de Baús</h1>
          <p className="text-gray-300 text-lg">
            Compre baús e descubra Rangers poderosos!
          </p>
          <p className="text-yellow-400 text-sm mt-2">
            ⚠️ Taxa de 1% aplicada em todas as compras
          </p>
        </div>

        {/* Contador Global de Baús Vendidos */}
        {!loading && globalStats && (
          <div className="cosmic-card p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">📊 Estatísticas Globais</h2>
              <p className="text-gray-400">Baús vendidos até agora</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">Total de Baús</p>
                <p className="text-4xl font-bold text-purple-300">
                  {globalStats.totalChestsSold.toLocaleString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">Receita Total</p>
                <p className="text-4xl font-bold text-green-400">
                  {globalStats.totalRevenue.toFixed(2)} TON
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">Taxas Coletadas</p>
                <p className="text-4xl font-bold text-yellow-400">
                  {globalStats.totalFees.toFixed(2)} TON
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-900/50 to-red-900/50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">Última Atualização</p>
                <p className="text-sm font-bold text-pink-300">
                  {new Date(globalStats.lastUpdated).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Vendas por Tipo de Baú */}
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Vendas por Tipo</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Cadete</p>
                  <p className="text-2xl font-bold text-gray-300">
                    {globalStats.chestsSoldByType.cadete}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Explorador</p>
                  <p className="text-2xl font-bold text-green-400">
                    {globalStats.chestsSoldByType.explorador}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Comandante</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {globalStats.chestsSoldByType.comandante}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Elite</p>
                  <p className="text-2xl font-bold text-red-400">
                    {globalStats.chestsSoldByType.elite}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Estelar</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {globalStats.chestsSoldByType.estelar}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Cósmico</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {globalStats.chestsSoldByType.cosmico}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="cosmic-card p-12 mb-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando estatísticas...</p>
          </div>
        )}

        {/* Grid de Baús */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chests.map((chest) => (
            <div
              key={chest.id}
              className="cosmic-card hover:scale-105 transition-transform cursor-pointer"
            >
              {/* Imagem do Baú */}
              <div className={`h-64 bg-gradient-to-br ${chest.color} rounded-t-lg flex items-center justify-center overflow-hidden p-4`}>
                <img
                  src={chest.image}
                  alt={chest.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  onError={(e) => {
                    console.error(`Erro ao carregar: ${chest.image}`);
                    e.target.src = 'https://via.placeholder.com/300x300?text=Baú+Não+Encontrado';
                  }}
                />
              </div>

              {/* Informações */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{chest.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{chest.description}</p>

                {/* Chances */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-2">Possíveis Rangers:</p>
                  {chest.rangers.map((ranger, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-black/30 p-2 rounded">
                      <span className="text-gray-300">{ranger.name}</span>
                      <span className="px-3 py-1 bg-purple-900/50 rounded-full text-purple-300 font-bold">
                        {ranger.chance}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Preço e Botão */}
                <div className="border-t border-purple-500/30 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-400">Preço base:</p>
                      <p className="text-3xl font-bold text-yellow-400">{chest.price} TON</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Taxa (1%):</p>
                      <p className="text-sm text-red-400">+{(chest.price * 0.01).toFixed(2)} TON</p>
                    </div>
                  </div>

                  <div className="bg-purple-900/30 p-2 rounded mb-3 text-center">
                    <p className="text-xs text-gray-400">Total a pagar:</p>
                    <p className="text-xl font-bold text-green-400">
                      {(chest.price * 1.01).toFixed(2)} TON
                    </p>
                  </div>

                  <button
                    onClick={() => handleBuy(chest)}
                    className="w-full cosmic-button"
                  >
                    Comprar Agora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 cosmic-card p-6">
          <h3 className="text-2xl font-bold mb-4">ℹ️ Como Funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded">
              <p className="text-3xl mb-2">1️⃣</p>
              <h4 className="font-bold mb-2">Escolha seu Baú</h4>
              <p className="text-sm text-gray-400">
                Cada baú tem diferentes chances de Rangers raros
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded">
              <p className="text-3xl mb-2">2️⃣</p>
              <h4 className="font-bold mb-2">Pague com TON</h4>
              <p className="text-sm text-gray-400">
                Conecte sua wallet e confirme a transação
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded">
              <p className="text-3xl mb-2">3️⃣</p>
              <h4 className="font-bold mb-2">Receba seu Ranger</h4>
              <p className="text-sm text-gray-400">
                Seu Ranger aparecerá no inventário instantaneamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
