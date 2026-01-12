const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const rewardService = require('../services/rewardService');
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

// GET /api/transactions - Lista todas as transações do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: transactions.length,
      transactions: transactions.map(t => ({
        id: t._id,
        type: t.type,
        amount: t.amount,
        status: t.status,
        description: t.description,
        createdAt: t.createdAt
      }))
    });
  } catch (error) {
    console.error('Error in GET /transactions:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// POST /api/transactions/claim - Processa claim de recompensas
router.post('/claim', authMiddleware, async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ 
        error: 'Endereço da carteira é obrigatório' 
      });
    }

    // Processa o claim
    const result = await rewardService.processClaim(req.userId, walletAddress);

    if (!result.success) {
      return res.status(400).json({ 
        error: result.message 
      });
    }

    res.json({
      success: true,
      amount: result.amount,
      rangers: result.rangers,
      message: result.message
    });
  } catch (error) {
    console.error('Error in POST /transactions/claim:', error);
    res.status(500).json({ error: 'Erro ao processar claim' });
  }
});

// GET /api/transactions/stats - Estatísticas do usuário
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await rewardService.getUserStats(req.userId);

    if (!stats) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error in GET /transactions/stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// GET /api/transactions/pending-reward - Calcula recompensa pendente
router.get('/pending-reward', authMiddleware, async (req, res) => {
  try {
    const pendingReward = await rewardService.calculateTotalReward(req.userId);

    res.json({
      success: true,
      pendingReward: parseFloat(pendingReward.toFixed(2))
    });
  } catch (error) {
    console.error('Error in GET /transactions/pending-reward:', error);
    res.status(500).json({ error: 'Erro ao calcular recompensa' });
  }
});

module.exports = router;
