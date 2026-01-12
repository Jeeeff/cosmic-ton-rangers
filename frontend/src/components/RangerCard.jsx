export default function RangerCard({ ranger, showActions = false, onActivate, onClaim }) {
  const rarityColors = {
    'Cadete': 'from-gray-600 to-yellow-600',
    'Explorador': 'from-green-600 to-emerald-600',
    'Comandante': 'from-blue-600 to-cyan-600',
    'Elite': 'from-red-600 to-orange-600',
    'Estelar': 'from-purple-600 to-pink-600',
    'Cósmico': 'from-yellow-600 to-purple-600'
  };

  const rarityEmojis = {
    'Cadete': '⭐',
    'Explorador': '🌟',
    'Comandante': '💫',
    'Elite': '✨',
    'Estelar': '🌠',
    'Cósmico': '🌌'
  };

  const dailyFarm = {
    'Cadete': 0.025,
    'Explorador': 0.067,
    'Comandante': 0.185,
    'Elite': 0.364,
    'Estelar': 0.556,
    'Cósmico': 0.857
  };

  const roiDays = {
    'Cadete': 80,
    'Explorador': 75,
    'Comandante': 65,
    'Elite': 55,
    'Estelar': 45,
    'Cósmico': 35
  };

  return (
    <div className="cosmic-card hover:scale-105 transition-transform">
      {/* Header com raridade */}
      <div className={`h-16 bg-gradient-to-r ${rarityColors[ranger.rarity]} rounded-t-lg flex items-center justify-center`}>
        <h3 className="text-2xl font-bold flex items-center gap-2">
          {rarityEmojis[ranger.rarity]} {ranger.rarity}
        </h3>
      </div>

      {/* Imagem do Ranger */}
      <div className="h-64 bg-black/30 flex items-center justify-center p-4">
        <img 
          src={`/images/rangers/ranger_${ranger.rarity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.png`}
          alt={ranger.rarity}
          className="w-full h-full object-contain drop-shadow-2xl"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Ranger';
          }}
        />
      </div>

      {/* Informações */}
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/30 p-3 rounded">
            <p className="text-xs text-gray-500 uppercase">Farm Diário</p>
            <p className="text-xl font-bold text-green-400">{dailyFarm[ranger.rarity]} TON</p>
          </div>
          <div className="bg-black/30 p-3 rounded">
            <p className="text-xs text-gray-500 uppercase">ROI Mínimo</p>
            <p className="text-xl font-bold text-blue-400">{roiDays[ranger.rarity]} dias</p>
          </div>
        </div>

        {/* Status */}
        {ranger.status && (
          <div className="bg-black/30 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500 uppercase">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                ranger.isActive ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
              }`}>
                {ranger.isActive ? '🟢 Ativo' : '🔴 Inativo'}
              </span>
            </div>

            {ranger.isActive && (
              <>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Energia:</span>
                  <span className="text-yellow-400 font-bold">{ranger.energy}%</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Farmado hoje:</span>
                  <span className="text-green-400 font-bold">{ranger.farmedToday || 0} TON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total farmado:</span>
                  <span className="text-purple-400 font-bold">{ranger.totalFarmed || 0} TON</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Ações */}
        {showActions && (
          <div className="space-y-2 pt-2 border-t border-purple-500/30">
            {ranger.isActive ? (
              <>
                <button
                  onClick={() => onClaim(ranger)}
                  disabled={!ranger.farmedToday || ranger.farmedToday === 0}
                  className={`w-full py-3 rounded-lg font-bold transition ${
                    ranger.farmedToday > 0
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                      : 'bg-gray-700 cursor-not-allowed opacity-50'
                  }`}
                >
                  💰 Claim Recompensa
                </button>
                <button
                  onClick={() => onActivate(ranger, false)}
                  className="w-full py-2 bg-red-900/50 hover:bg-red-900/70 rounded-lg font-bold transition"
                >
                  ⏸️ Desativar
                </button>
              </>
            ) : (
              <button
                onClick={() => onActivate(ranger, true)}
                className="w-full cosmic-button"
              >
                ▶️ Ativar Ranger
              </button>
            )}
          </div>
        )}

        {/* ID do Ranger (se tiver) */}
        {ranger.id && (
          <p className="text-xs text-gray-600 text-center">ID: {ranger.id.slice(0, 8)}...</p>
        )}
      </div>
    </div>
  );
}
