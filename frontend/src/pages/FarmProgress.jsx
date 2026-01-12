import { useState, useEffect } from 'react';

export default function FarmProgress() {
  const [farmData, setFarmData] = useState({
    daysCompleted: 0,
    tonAccumulated: 0,
    lastCheckIn: null,
    isActive: true,
    hasUsedReward: false
  });

  const [canCheckIn, setCanCheckIn] = useState(false);
  const [timeUntilNextCheckIn, setTimeUntilNextCheckIn] = useState('');

  const TOTAL_DAYS = 50;
  const TON_PER_DAY = 0.04;
  const TOTAL_REWARD = 2.0;

  // Simular dados do backend (depois você vai buscar da API)
  useEffect(() => {
    // TODO: Buscar do backend
    const mockData = {
      daysCompleted: 23,
      tonAccumulated: 0.92,
      lastCheckIn: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 horas atrás
      isActive: true,
      hasUsedReward: false
    };
    setFarmData(mockData);

    // Verificar se pode fazer check-in
    const lastCheckIn = new Date(mockData.lastCheckIn);
    const now = new Date();
    const hoursSinceLastCheckIn = (now - lastCheckIn) / (1000 * 60 * 60);

    setCanCheckIn(hoursSinceLastCheckIn >= 24);

    // Calcular tempo até próximo check-in
    if (hoursSinceLastCheckIn < 24) {
      const hoursRemaining = 24 - hoursSinceLastCheckIn;
      const hours = Math.floor(hoursRemaining);
      const minutes = Math.floor((hoursRemaining - hours) * 60);
      setTimeUntilNextCheckIn(`${hours}h ${minutes}m`);
    }
  }, []);

  const handleCheckIn = () => {
    if (!canCheckIn) {
      alert('⏰ Você já fez check-in hoje! Volte amanhã.');
      return;
    }

    // TODO: Enviar para backend
    setFarmData(prev => ({
      ...prev,
      daysCompleted: prev.daysCompleted + 1,
      tonAccumulated: prev.tonAccumulated + TON_PER_DAY,
      lastCheckIn: new Date()
    }));

    setCanCheckIn(false);
    alert(`✅ Check-in realizado!\n\n+${TON_PER_DAY} TON adicionado ao seu saldo de farm.`);
  };

  const handleClaimReward = () => {
    if (farmData.daysCompleted < TOTAL_DAYS) {
      alert(`⏰ Você precisa completar ${TOTAL_DAYS - farmData.daysCompleted} dias restantes!`);
      return;
    }

    // TODO: Redirecionar para loja com opção de usar TON farmado
    alert('🎉 Parabéns! Redirecionando para a loja...\n\nVocê pode usar seu TON farmado para comprar o Baú Cadete!');
    // window.location.href = '/shop';
  };

  const progressPercentage = (farmData.daysCompleted / TOTAL_DAYS) * 100;

  if (farmData.hasUsedReward) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="cosmic-card p-8 text-center">
            <span className="text-6xl mb-4 block">🎉</span>
            <h2 className="text-3xl font-bold mb-4">Recompensa Já Utilizada!</h2>
            <p className="text-gray-400 mb-6">
              Você já usou seu TON farmado para comprar o Baú Cadete.
            </p>
            <p className="text-sm text-gray-500">
              O sistema de farm gratuito foi desativado permanentemente para sua conta.
            </p>
            <button
              onClick={() => window.location.href = '/shop'}
              className="mt-6 cosmic-button"
            >
              Ir para a Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!farmData.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="cosmic-card p-8 text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-3xl font-bold mb-4">Sistema de Farm Desativado</h2>
            <p className="text-gray-400">
              O sistema de farm gratuito não está mais disponível para sua conta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 glow-text">🌾 Farm Gratuito</h1>
          <p className="text-gray-300 text-lg">
            Entre diariamente e acumule TON para seu primeiro Ranger!
          </p>
        </div>

        {/* Card Principal */}
        <div className="cosmic-card p-8 mb-8">
          {/* Progresso */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Progresso</h3>
              <span className="text-3xl font-bold text-purple-400">
                {farmData.daysCompleted}/{TOTAL_DAYS} dias
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="relative h-8 bg-black/50 rounded-full overflow-hidden border border-purple-500/30">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-500 flex items-center justify-center"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 10 && (
                  <span className="text-sm font-bold text-white">
                    {progressPercentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TON Acumulado */}
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-6 mb-8">
            <div className="text-center">
              <p className="text-gray-400 mb-2">TON Acumulado</p>
              <p className="text-6xl font-bold text-green-400 mb-2">
                {farmData.tonAccumulated.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Meta: {TOTAL_REWARD.toFixed(2)} TON
              </p>
            </div>
          </div>

          {/* Botão de Check-in */}
          <div className="text-center mb-8">
            {canCheckIn ? (
              <button
                onClick={handleCheckIn}
                className="cosmic-button text-xl py-4 px-12"
              >
                ✅ Fazer Check-in Diário
              </button>
            ) : (
              <div>
                <button
                  disabled
                  className="bg-gray-700 text-gray-400 font-bold py-4 px-12 rounded-lg cursor-not-allowed text-xl"
                >
                  ⏰ Próximo check-in em {timeUntilNextCheckIn}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Volte amanhã para continuar farmando!
                </p>
              </div>
            )}
          </div>

          {/* Botão de Resgatar (aparece quando completa 50 dias) */}
          {farmData.daysCompleted >= TOTAL_DAYS && (
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-lg p-6 text-center">
              <span className="text-5xl mb-4 block">🎉</span>
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">
                Parabéns! Você completou os 50 dias!
              </h3>
              <p className="text-gray-300 mb-6">
                Você acumulou {TOTAL_REWARD.toFixed(2)} TON e pode comprar seu primeiro Baú Cadete gratuitamente!
              </p>
              <button
                onClick={handleClaimReward}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 text-xl"
              >
                🎁 Ir para a Loja
              </button>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="cosmic-card p-6">
          <h3 className="text-2xl font-bold mb-4">ℹ️ Como Funciona</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <h4 className="font-bold mb-1">Entre Diariamente</h4>
                <p className="text-sm text-gray-400">
                  Faça check-in uma vez por dia para acumular TON
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <h4 className="font-bold mb-1">Acumule TON</h4>
                <p className="text-sm text-gray-400">
                  Ganhe {TON_PER_DAY} TON por dia durante {TOTAL_DAYS} dias
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <h4 className="font-bold mb-1">Compre seu Baú</h4>
                <p className="text-sm text-gray-400">
                  Use o TON acumulado para comprar o Baú Cadete gratuitamente
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="font-bold mb-2 text-yellow-400">⚠️ Importante:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• O TON farmado NÃO pode ser sacado</li>
              <li>• Só pode ser usado para comprar o Baú Cadete</li>
              <li>• Após usar, o sistema de farm é desativado permanentemente</li>
              <li>• Você precisa fazer check-in a cada 24 horas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
