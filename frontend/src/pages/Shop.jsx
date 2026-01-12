import { useState, useEffect } from 'react';

export default function Shop() {
  const [selectedChest, setSelectedChest] = useState(null);
  const [globalStats, setGlobalStats] = useState({
    totalChests: 0,
    chestsSold: {
      cadete: 0,
      explorador: 0,
      comandante: 0,
      elite: 0,
      estelar: 0,
      cosmico: 0
    }
  });

  // Simular dados do backend (depois você vai buscar da API)
  useEffect(() => {
    // TODO: Buscar do backend
    setGlobalStats({
      totalChests: 1247,
      chestsSold: {
        cadete: 523,
        explorador: 312,
        comandante: 198,
        elite: 134,
        estelar: 56,
        cosmico: 24
      }
    });
  }, []);

  const chests = [
    {
      id: 'cadete',
      name: 'Baú Cadete',
      price: 2,
      image: '/images/chests/bau_cadete.png',
      color: 'from-gray-600 to-yellow-600',
      description: '100% Cadete',
      rangers: [{ name: 'Cadete', chance: 100 }],
      canUseFarmTON: true
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

  const handleBuy = (chest, useFarmTON = false) => {
    setSelectedChest(chest);

    if (useFarmTON) {
      alert(`🎉 Usando TON Farmado!\n\nVocê está comprando ${chest.name} com seu TON farmado.\n\n⚠️ Após esta compra, o sistema de farm será desativado permanentemente.`);
    } else {
      alert(`Comprando ${chest.name} por ${chest.price} TON!\n\nTotal com taxa (1%): ${(chest.price * 1.01).toFixed(2)} TON`);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 glow-text">🛒 Loja de Baús</h1>
          <p className="text-gray-300 text-lg">Compre baús e descubra Rangers poderosos!</p>
          <p className="text-yellow-400 text-sm mt-2">⚠️ Taxa de 1% aplicada em todas as compras</p>
        </div>

        <div className="cosmic-card p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">📊 Estatísticas Globais</h2>
            <p className="text-gray-400">Baús vendidos desde o lançamento</p>
          </div>

          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded-lg mb-6 text-center">
            <p className="text-sm text-gray-400 mb-2">Total de Baús Vendidos</p>
            <p className="text-6xl font-bold glow-text">{globalStats.totalChests.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {chests.map((chest) => (
              <div key={chest.id} className="bg-black/30 p-4 rounded-lg text-center border border-purple-500/20 hover:border-purple-500/50 transition-colors">
                <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${chest.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-2xl">📦</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{chest.name}</p>
                <p className="text-2xl font-bold text-purple-300">{globalStats.chestsSold[chest.id]?.toLocaleString() || 0}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chests.map((chest) => (
            <div key={chest.id} className="cosmic-card hover:scale-105 transition-transform cursor-pointer">
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-purple-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                  🔥 {globalStats.chestsSold[chest.id] || 0} vendidos
                </div>
              </div>

              <div className={`h-64 bg-gradient-to-br ${chest.color} rounded-t-lg flex items-center justify-center overflow-hidden p-4`}>
                <img src={chest.image} alt={chest.name} className="w-full h-full object-contain drop-shadow-2xl" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Baú'; }} />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{chest.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{chest.description}</p>

                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-2">Possíveis Rangers:</p>
                  {chest.rangers.map((ranger, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-black/30 p-2 rounded">
                      <span className="text-gray-300">{ranger.name}</span>
                      <span className="px-3 py-1 bg-purple-900/50 rounded-full text-purple-300 font-bold">{ranger.chance}%</span>
                    </div>
                  ))}
                </div>

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
                    <p className="text-xl font-bold text-green-400">{(chest.price * 1.01).toFixed(2)} TON</p>
                  </div>

                  <button onClick={() => handleBuy(chest, false)} className="w-full cosmic-button mb-2">💳 Comprar com TON</button>

                  {chest.canUseFarmTON && (
                    <button onClick={() => handleBuy(chest, true)} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50">
                      🌾 Usar TON Farmado
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 cosmic-card p-6">
          <h3 className="text-2xl font-bold mb-4">ℹ️ Como Funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded">
              <p className="text-3xl mb-2">1️⃣</p>
              <h4 className="font-bold mb-2">Escolha seu Baú</h4>
              <p className="text-sm text-gray-400">Cada baú tem diferentes chances de Rangers raros</p>
            </div>
            <div className="bg-black/30 p-4 rounded">
              <p className="text-3xl mb-2">2️⃣</p>
              <h4 className="font-bold mb-2">Pague com TON</h4>
              <p className="text-sm text-gray-400">Conecte sua wallet e confirme a transação</p>
            </div>
            <div className="bg-black/30 p-4 rounded">
              <p className="text-3xl mb-2">3️⃣</p>
              <h4 className="font-bold mb-2">Receba seu Ranger</h4>
              <p className="text-sm text-gray-400">Seu Ranger aparecerá no inventário instantaneamente</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🌾</span>
            <div>
              <h4 className="text-xl font-bold mb-2 text-green-400">Sistema de Farm Gratuito</h4>
              <p className="text-gray-300 mb-2">Entre no jogo diariamente por 50 dias e acumule TON suficiente para comprar seu primeiro Baú Cadete gratuitamente!</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✅ Ganhe 0.04 TON por dia</li>
                <li>✅ Após 50 dias: 2 TON acumulados</li>
                <li>⚠️ TON farmado NÃO pode ser sacado</li>
                <li>⚠️ Pode ser usado APENAS para comprar o Baú Cadete</li>
                <li>⚠️ Sistema desativado após usar o TON farmado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
