export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const TON_NETWORK = import.meta.env.VITE_TON_NETWORK || 'testnet';

export const RARITIES = {
  Cadete: {
    name: 'Cadete',
    price: 5,
    dailyReward: 0.15,
    roiDays: 33,
    dropRate: 50,
    color: '#9CA3AF',
    emoji: '🌑',
    bgColor: 'from-gray-600 to-gray-700'
  },
  Explorador: {
    name: 'Explorador',
    price: 15,
    dailyReward: 0.40,
    roiDays: 37,
    dropRate: 25,
    color: '#10B981',
    emoji: '🌿',
    bgColor: 'from-green-600 to-green-700'
  },
  Comandante: {
    name: 'Comandante',
    price: 40,
    dailyReward: 1.00,
    roiDays: 40,
    dropRate: 15,
    color: '#3B82F6',
    emoji: '💎',
    bgColor: 'from-blue-600 to-blue-700'
  },
  Elite: {
    name: 'Elite',
    price: 100,
    dailyReward: 2.20,
    roiDays: 45,
    dropRate: 7,
    color: '#8B5CF6',
    emoji: '👑',
    bgColor: 'from-purple-600 to-purple-700'
  },
  Estelar: {
    name: 'Estelar',
    price: 250,
    dailyReward: 5.00,
    roiDays: 50,
    dropRate: 2.5,
    color: '#F59E0B',
    emoji: '⭐',
    bgColor: 'from-yellow-600 to-yellow-700'
  },
  Cósmico: {
    name: 'Cósmico',
    price: 1000,
    dailyReward: 18.00,
    roiDays: 55,
    dropRate: 0.5,
    color: '#EC4899',
    emoji: '🌌',
    bgColor: 'from-pink-600 to-pink-700'
  }
};

export const MENU_ITEMS = [
  { id: 'home', label: 'Home', path: '/', icon: '🏠' },
  { id: 'shop', label: 'Loja', path: '/shop', icon: '🛒' },
  { id: 'inventory', label: 'Inventário', path: '/inventory', icon: '🎮' },
  { id: 'stats', label: 'Estatísticas', path: '/stats', icon: '📊' }
];
