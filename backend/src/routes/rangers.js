const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ranger = require('../models/Ranger');
const Transaction = require('../models/Transaction');
const { RARITIES, rollRarity } = require('../utils/raritySystem');
const jwt = require('jsonwebtoken');

// Middleware para autenticação
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// GET /api/rangers - Lista todos os Rangers do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rangers = await Ranger.find({ owner: req.userId }).sort({ purchaseDate: -1 });

    res.json({
      success: true,
      count: rangers.length,
      rangers: rangers.map(r => ({
        id: r._id,
        name: r.name,
        rarity: r.rarity,
        level: r.level,
        dailyReward: r.dailyReward,
        totalEarned: r.totalEarned,
        daysActive: r.daysActive,
        roiDays: r.roiDays,
        isActive: r.isActive,
        lastRewardDate: r.lastRewardDate,
        purchaseDate: r.purchaseDate
      }))
    });
  } catch (error) {
    console.error('Error in GET /rangers:', error);
    res.status(500).json({ error: 'Erro ao buscar Rangers' });
  }
});

// GET /api/rangers/:id - Detalhes de um Ranger específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const ranger = await Ranger.findOne({ 
      _id: req.params.id, 
      owner: req.userId 
    });

    if (!ranger) {
      return res.status(404).json({ error: 'Ranger não encontrado' });
    }

    const rarityInfo = RARITIES[ranger.rarity];

    res.json({
      success: true,
      ranger: {
        id: ranger._id,
        name: ranger.name,
        rarity: ranger.rarity,
        rarityInfo,
        level: ranger.level,
        dailyReward: ranger.dailyReward,
        purchasePrice: ranger.purchasePrice,
        totalEarned: ranger.totalEarned,
        daysActive: ranger.daysActive,
        roiDays: ranger.roiDays,
        isActive: ranger.isActive,
        lastRewardDate: ranger.lastRewardDate,
        purchaseDate: ranger.purchaseDate,
        roi: ((ranger.totalEarned / ranger.purchasePrice) * 100).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error in GET /rangers/:id:', error);
    res.status(500).json({ error: 'Erro ao buscar Ranger' });
  }
});

// POST /api/rangers/buy - Compra um novo Ranger
router.post('/buy', authMiddleware, async (req, res) => {
  try {
    const { tonTransactionHash, walletAddress } = req.body;

    if (!tonTransactionHash || !walletAddress) {
      return res.status(400).json({ 
        error: 'Transação TON e endereço da carteira são obrigatórios' 
      });
    }

    // Sorteia a raridade
    const rarity = rollRarity();
    const rarityInfo = RARITIES[rarity];

    // Cria o Ranger
    const ranger = await Ranger.create({
      owner: req.userId,
      name: `${rarity} #${Math.floor(Math.random() * 10000)}`,
      rarity,
      level: 1,
      dailyReward: rarityInfo.dailyReward,
      purchasePrice: rarityInfo.price,
      roiDays: rarityInfo.roiDays,
      imageUrl: `https://via.placeholder.com/300x300?text=${rarity}`
    });

    // Registra a transação
    await Transaction.create({
      user: req.userId,
      type: 'purchase',
      amount: rarityInfo.price,
      ranger: ranger._id,
      tonTransactionHash,
      status: 'completed',
      description: `Compra de ${rarity}`
    });

    // Atualiza saldo do usuário
    const user = await User.findById(req.userId);
    user.balance -= rarityInfo.price;
    await user.save();

    res.json({
      success: true,
      message: `Parabéns! Você adquiriu um ${rarity}!`,
      ranger: {
        id: ranger._id,
        name: ranger.name,
        rarity: ranger.rarity,
        dailyReward: ranger.dailyReward,
        purchasePrice: ranger.purchasePrice,
        roiDays: ranger.roiDays
      }
    });
  } catch (error) {
    console.error('Error in POST /rangers/buy:', error);
    res.status(500).json({ error: 'Erro ao comprar Ranger' });
  }
});

// POST /api/rangers/:id/upgrade - Melhora um Ranger
router.post('/:id/upgrade', authMiddleware, async (req, res) => {
  try {
    const ranger = await Ranger.findOne({ 
      _id: req.params.id, 
      owner: req.userId 
    });

    if (!ranger) {
      return res.status(404).json({ error: 'Ranger não encontrado' });
    }

    // Calcula custo do upgrade (10% do preço original)
    const upgradeCost = ranger.purchasePrice * 0.1;

    const user = await User.findById(req.userId);
    if (user.balance < upgradeCost) {
      return res.status(400).json({ 
        error: 'Saldo insuficiente para upgrade' 
      });
    }

    // Realiza o upgrade
    ranger.level += 1;
    ranger.dailyReward *= 1.1; // Aumenta recompensa em 10%
    await ranger.save();

    user.balance -= upgradeCost;
    await user.save();

    res.json({
      success: true,
      message: `Ranger evoluiu para nível ${ranger.level}!`,
      ranger: {
        id: ranger._id,
        level: ranger.level,
        dailyReward: ranger.dailyReward
      }
    });
  } catch (error) {
    console.error('Error in POST /rangers/:id/upgrade:', error);
    res.status(500).json({ error: 'Erro ao fazer upgrade' });
  }
});

// GET /api/rangers/rarities - Lista todas as raridades disponíveis
router.get('/info/rarities', (req, res) => {
  res.json({
    success: true,
    rarities: Object.entries(RARITIES).map(([key, value]) => ({
      name: key,
      price: value.price,
      dailyReward: value.dailyReward,
      roiDays: value.roiDays,
      dropRate: value.dropRate,
      emoji: value.emoji,
      color: value.color
    }))
  });
});

module.exports = router;
