import { useState } from 'react';

export default function Economics() {
  const [selectedChest, setSelectedChest] = useState('cosmic');

  const chests = {
    common: {
      name: 'Baú Comum',
      price: 2,
      emoji: '📦',
      color: 'from-gray-600 to-gray-700',
      rangers: [
        { name: 'Cadete', chance: 100, farm: 0.025, roi: 80 }
      ]
    },
    rare: {
      name: 'Baú Raro',
      price: 5,
      emoji: '🎁',
      color: 'from-blue-600 to-blue-700',
      rangers: [
        { name: 'Cadete', chance: 70, farm: 0.025, roi: 200 },
        { name: 'Explorador', chance: 30, farm: 0.0667, roi: 75 }
      ]
    },
    stellar: {
      name: 'Baú Estelar',
      price: 12,
      emoji: '⭐',
      color: 'from-purple-600 to-purple-700',
      rangers: [
        { name: 'Explorador', chance: 50, farm: 0.0667, roi: 180 },
        { name: 'Comandante', chance: 35, farm: 0.1846, roi: 65 },
        { name: 'Elite', chance: 15, farm: 0.2182, roi: 55 }
      ]
    },
    elite: {
      name: 'Baú Elite',
      price: 20,
      emoji: '💎',
      color: 'from-pink-600 to-pink-700',
      rangers: [
        { name: 'Comandante', chance: 50, farm: 0.1846, roi: 108 },
        { name: 'Elite', chance: 40, farm: 0.2182, roi: 92 },
        { name: 'Estelar', chance: 10, farm: 0.4444, roi: 45 }
      ]
    },
    cosmic: {
      name: 'Baú Cósmico',
      price: 30,
      emoji: '🌌',
      color: 'from-yellow-600 to-orange-600',
      rangers: [
        { name: 'Elite', chance: 60, farm: 0.2182, roi: 137 },
        { name: 'Estelar', chance: 35, farm: 0.4444, roi: 67 },
        { name: 'Cósmico', chance: 5, farm: 0.8571, roi: 35 }
      ]
    }
  };

  const selectedData = chests[selectedChest];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 glow-text">📊 Economia do Jogo</h1>
          <p className="text-gray-300 text-lg">
            Entenda como funciona o sistema de ROI, taxas e lucros
          </p>
        </div>

        {/* Taxas do Sistema */}
        <div className="cosmic-card p-8 mb-8 bg-gradient-to-r from-green-900/30 to-emerald-900/30">
          <h2 className="text-3xl font-bold mb-6">💰 Taxas do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🛒</span>
                <h3 className="text-xl font-bold">Taxa na Compra</h3>
              </div>
              <p className="text-4xl font-bold text-green-400 mb-2">1%</p>
              <p className="text-gray-400 text-sm">
                Aplicada no momento da compra do baú. Exemplo: Baú de 30 TON = taxa de 0.3 TON
              </p>
            </div>

            <div className="bg-black/30 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💸</span>
                <h3 className="text-xl font-bold">Taxa no Saque</h3>
              </div>
              <p className="text-4xl font-bold text-yellow-400 mb-2">1%</p>
              <p className="text-gray-400 text-sm">
                Aplicada quando você saca TON para sua carteira. Todo farm fica no jogo até o saque.
              </p>
            </div>
          </div>
        </div>

        {/* Seletor de Baús */}
        <div className="cosmic-card p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">🎁 Selecione um Baú</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(chests).map(([key, chest]) => (
              <button
                key={key}
                onClick={() => setSelectedChest(key)}
                className={`p-4 rounded-lg font-bold transition ${
                  selectedChest === key
                    ? `bg-gradient-to-r ${chest.color} scale-105`
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="text-4xl mb-2">{chest.emoji}</div>
                <div className="text-sm">{chest.name}</div>
                <div className="text-lg font-bold">{chest.price} TON</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detalhes do Baú Selecionado */}
        <div className="cosmic-card p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl">{selectedData.emoji}</span>
            <div>
              <h2 className="text-3xl font-bold">{selectedData.name}</h2>
              <p className="text-2xl text-yellow-400 font-bold">{selectedData.price} TON</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-2">Custo Real (com taxa 1%)</p>
              <p className="text-2xl font-bold text-red-400">
                {(selectedData.price * 1.01).toFixed(2)} TON
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-2">ROI Mínimo</p>
              <p className="text-2xl font-bold text-green-400">
                {Math.min(...selectedData.rangers.map(r => r.roi))} dias
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-2">ROI Máximo</p>
              <p className="text-2xl font-bold text-orange-400">
                {Math.max(...selectedData.rangers.map(r => r.roi))} dias
              </p>
            </div>
          </div>

          {/* Tabela de Rangers */}
          <h3 className="text-xl font-bold mb-4">🎲 Possíveis Rangers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="text-left py-3 px-4">Ranger</th>
                  <th className="text-left py-3 px-4">Chance</th>
                  <th className="text-left py-3 px-4">Farm/dia</th>
                  <th className="text-left py-3 px-4">ROI</th>
                  <th className="text-left py-3 px-4">Taxa Energia</th>
                  <th className="text-left py-3 px-4">Farm Líquido</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.rangers.map((ranger, idx) => (
                  <tr key={idx} className="border-b border-purple-500/10 hover:bg-purple-900/20">
                    <td className="py-3 px-4 font-bold">{ranger.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-900/50 rounded-full text-sm">
                        {ranger.chance}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-green-400 font-bold">
                      {ranger.farm.toFixed(4)} TON
                    </td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">
                      {ranger.roi} dias
                    </td>
                    <td className="py-3 px-4 text-red-400">
                      {(ranger.farm * 0.03).toFixed(4)} TON
                    </td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">
                      {(ranger.farm * 0.97).toFixed(4)} TON
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sistema de Energia */}
        <div className="cosmic-card p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">⚡ Sistema de Energia</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl">1️⃣</span>
              <div>
                <h3 className="font-bold text-lg mb-2">Rangers precisam ser ativados diariamente</h3>
                <p className="text-gray-400">
                  A cada 24 horas, você precisa reativar seu Ranger pagando uma taxa de energia (3% do farm diário).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">2️⃣</span>
              <div>
                <h3 className="font-bold text-lg mb-2">Se não reativar, ele "dorme"</h3>
                <p className="text-gray-400">
                  Rangers inativos não geram recompensas. Você pode reativá-lo a qualquer momento.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">3️⃣</span>
              <div>
                <h3 className="font-bold text-lg mb-2">A taxa alimenta a pool de sustentabilidade</h3>
                <p className="text-gray-400">
                  Essas taxas mantêm o jogo funcionando e garantem liquidez para saques.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vida Útil */}
        <div className="cosmic-card p-8">
          <h2 className="text-3xl font-bold mb-6">⏳ Vida Útil dos Rangers</h2>
          <p className="text-gray-300 mb-4">
            Cada Ranger tem um limite de lucro para manter a economia sustentável:
          </p>
          <div className="bg-black/30 p-6 rounded-lg">
            <p className="text-xl font-bold text-center mb-2">
              Lucro Máximo = (Valor Base do Ranger × 2) + 10%
            </p>
            <p className="text-gray-400 text-center text-sm">
              Após atingir esse limite, o Ranger "se aposenta" e para de farmar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
