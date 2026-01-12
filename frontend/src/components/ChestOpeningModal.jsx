import { useState, useEffect } from 'react';

export default function ChestOpeningModal({ chest, isOpen, onClose, onRangerReceived }) {
  const [isOpening, setIsOpening] = useState(false);
  const [revealedRanger, setRevealedRanger] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && chest) {
      startOpeningAnimation();
    }
  }, [isOpen, chest]);

  const startOpeningAnimation = () => {
    setIsOpening(true);
    setRevealedRanger(null);
    setShowConfetti(false);

    // Simula abertura do baú (3 segundos)
    setTimeout(() => {
      const ranger = simulateChestOpening(chest);
      setRevealedRanger(ranger);
      setIsOpening(false);
      setShowConfetti(true);

      if (onRangerReceived) {
        onRangerReceived(ranger);
      }
    }, 3000);
  };

  const simulateChestOpening = (chest) => {
    // Simula o drop baseado nas chances do baú
    const random = Math.random() * 100;
    let accumulated = 0;

    for (const ranger of chest.rangers) {
      accumulated += ranger.chance;
      if (random <= accumulated) {
        return {
          id: Date.now().toString(),
          rarity: ranger.name,
          isActive: false,
          energy: 100,
          farmedToday: 0,
          totalFarmed: 0,
          obtainedFrom: chest.name,
          obtainedAt: new Date().toISOString()
        };
      }
    }

    // Fallback (não deveria acontecer)
    return {
      id: Date.now().toString(),
      rarity: chest.rangers[0].name,
      isActive: false,
      energy: 100,
      farmedToday: 0,
      totalFarmed: 0,
      obtainedFrom: chest.name,
      obtainedAt: new Date().toISOString()
    };
  };

  const rarityColors = {
    'Cadete': 'from-gray-600 to-yellow-600',
    'Explorador': 'from-green-600 to-emerald-600',
    'Comandante': 'from-blue-600 to-cyan-600',
    'Elite': 'from-red-600 to-orange-600',
    'Estelar': 'from-purple-600 to-pink-600',
    'Cósmico': 'from-yellow-600 to-purple-600'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="cosmic-card max-w-2xl w-full relative">
        {/* Botão fechar */}
        {!isOpening && revealedRanger && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl hover:text-red-500 transition"
          >
            ✕
          </button>
        )}

        {/* Conteúdo */}
        <div className="p-8">
          {/* Abrindo baú */}
          {isOpening && (
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold glow-text">Abrindo {chest.name}...</h2>

              {/* Animação do baú */}
              <div className="relative h-64 flex items-center justify-center">
                <img 
                  src={chest.image}
                  alt={chest.name}
                  className="w-64 h-64 object-contain animate-bounce drop-shadow-2xl"
                />

                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
              </div>

              <div className="flex justify-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          {/* Ranger revelado */}
          {!isOpening && revealedRanger && (
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold glow-text">🎉 Você recebeu!</h2>

              {/* Card do Ranger */}
              <div className={`bg-gradient-to-br ${rarityColors[revealedRanger.rarity]} p-1 rounded-lg ${showConfetti ? 'animate-pulse' : ''}`}>
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-3xl font-bold mb-4">{revealedRanger.rarity}</h3>

                  <div className="h-64 flex items-center justify-center mb-4">
                    <img 
                      src={`/images/rangers/ranger_${revealedRanger.rarity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.png`}
                      alt={revealedRanger.rarity}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/30 p-3 rounded">
                      <p className="text-xs text-gray-500 uppercase">Farm Diário</p>
                      <p className="text-xl font-bold text-green-400">
                        {revealedRanger.rarity === 'Cadete' ? '0.025' :
                         revealedRanger.rarity === 'Explorador' ? '0.067' :
                         revealedRanger.rarity === 'Comandante' ? '0.185' :
                         revealedRanger.rarity === 'Elite' ? '0.364' :
                         revealedRanger.rarity === 'Estelar' ? '0.556' : '0.857'} TON
                      </p>
                    </div>
                    <div className="bg-black/30 p-3 rounded">
                      <p className="text-xs text-gray-500 uppercase">ROI Mínimo</p>
                      <p className="text-xl font-bold text-blue-400">
                        {revealedRanger.rarity === 'Cadete' ? '80' :
                         revealedRanger.rarity === 'Explorador' ? '75' :
                         revealedRanger.rarity === 'Comandante' ? '65' :
                         revealedRanger.rarity === 'Elite' ? '55' :
                         revealedRanger.rarity === 'Estelar' ? '45' : '35'} dias
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full cosmic-button"
                  >
                    ✨ Adicionar ao Inventário
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                Vá para o Inventário para ativar seu Ranger e começar a farmar!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
