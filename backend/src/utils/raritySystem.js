// Sistema de Raridades do Cosmic TON Rangers
const RARITIES = {
  Cadete: {
    name: 'Cadete',
    price: 5, // TON
    dailyReward: 0.15, // TON por dia
    roiDays: 33, // 5 / 0.15 = 33.33 dias
    dropRate: 50, // 50% de chance
    color: '#9CA3AF', // Cinza
    emoji: '🌑'
  },
  Explorador: {
    name: 'Explorador',
    price: 15,
    dailyReward: 0.40,
    roiDays: 37, // 15 / 0.40 = 37.5 dias
    dropRate: 25, // 25% de chance
    color: '#10B981', // Verde
    emoji: '🌿'
  },
  Comandante: {
    name: 'Comandante',
    price: 40,
    dailyReward: 1.00,
    roiDays: 40, // 40 / 1.00 = 40 dias
    dropRate: 15, // 15% de chance
    color: '#3B82F6', // Azul
    emoji: '💎'
  },
  Elite: {
    name: 'Elite',
    price: 100,
    dailyReward: 2.20,
    roiDays: 45, // 100 / 2.20 = 45.45 dias
    dropRate: 7, // 7% de chance
    color: '#8B5CF6', // Roxo
    emoji: '👑'
  },
  Estelar: {
    name: 'Estelar',
    price: 250,
    dailyReward: 5.00,
    roiDays: 50, // 250 / 5.00 = 50 dias
    dropRate: 2.5, // 2.5% de chance
    color: '#F59E0B', // Dourado
    emoji: '⭐'
  },
  Cósmico: {
    name: 'Cósmico',
    price: 1000,
    dailyReward: 18.00,
    roiDays: 55, // 1000 / 18.00 = 55.55 dias
    dropRate: 0.5, // 0.5% de chance (MUITO RARO)
    color: '#EC4899', // Rosa/Magenta
    emoji: '🌌'
  }
};

// Função para sortear uma raridade baseada nas taxas de drop
function rollRarity() {
  const random = Math.random() * 100;
  let cumulative = 0;

  const rarityOrder = ['Cósmico', 'Estelar', 'Elite', 'Comandante', 'Explorador', 'Cadete'];

  for (const rarity of rarityOrder) {
    cumulative += RARITIES[rarity].dropRate;
    if (random <= cumulative) {
      return rarity;
    }
  }

  return 'Cadete'; // Fallback
}

// Função para calcular recompensa acumulada
function calculateAccumulatedReward(ranger) {
  if (!ranger.lastRewardDate) {
    return 0;
  }

  const now = new Date();
  const lastReward = new Date(ranger.lastRewardDate);
  const daysPassed = Math.floor((now - lastReward) / (1000 * 60 * 60 * 24));

  return daysPassed * ranger.dailyReward;
}

// Função para verificar se pode fazer claim
function canClaim(ranger) {
  if (!ranger.lastRewardDate) {
    return true; // Primeira vez
  }

  const now = new Date();
  const lastReward = new Date(ranger.lastRewardDate);
  const hoursPassed = (now - lastReward) / (1000 * 60 * 60);

  return hoursPassed >= 24; // Pode fazer claim a cada 24h
}

module.exports = {
  RARITIES,
  rollRarity,
  calculateAccumulatedReward,
  canClaim
};
