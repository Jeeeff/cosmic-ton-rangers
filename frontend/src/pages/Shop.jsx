import { useState } from 'react';
import ChestOpeningModal from '../components/ChestOpeningModal';

export default function Shop() {
  const [selectedChest, setSelectedChest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleBuy = (chest) => {
    setSelectedChest(chest);
    setIsModalOpen(true);
    // TODO: Integrar com TON Connect para pagamento real
  };

  const handleRangerReceived = (ranger) => {
    console.log('Ranger recebido:', ranger);
    // TODO: Salvar no backend
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

                {/* Chances com preview dos Rangers */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-2">Possíveis Rangers:</p>
                  {chest.rangers.map((ranger, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-black/30 p-2 rounded hover:bg-black/50 transition">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`/images/rangers/ranger_${ranger.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.png`}
                          alt={ranger.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <span className="text-gray-300">{ranger.name}</span>
                      </div>
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

      {/* Modal de Abertura de Baú */}
      <ChestOpeningModal
        chest={selectedChest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRangerReceived={handleRangerReceived}
      />
    </div>
  );
}
