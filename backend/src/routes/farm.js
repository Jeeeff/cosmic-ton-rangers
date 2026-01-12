const express = require('express');
const router = express.Router();
const FarmProgress = require('../models/FarmProgress');

// GET - Buscar progresso do farm do usuário
router.get('/progress/:userId', async (req, res) => {
  try {
    let progress = await FarmProgress.findOne({ userId: req.params.userId });

    // Se não existir, criar novo
    if (!progress) {
      progress = await FarmProgress.create({ 
        userId: req.params.userId 
      });
    }

    // Verificar se pode fazer check-in
    const canCheckIn = progress.canCheckIn();

    res.json({
      success: true,
      data: {
        ...progress.toObject(),
        canCheckIn,
        daysRemaining: 50 - progress.daysCompleted,
        tonRemaining: parseFloat((2.0 - progress.tonAccumulated).toFixed(2)),
        progressPercentage: (progress.daysCompleted / 50 * 100).toFixed(1)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST - Fazer check-in diário
router.post('/checkin/:userId', async (req, res) => {
  try {
    let progress = await FarmProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      progress = await FarmProgress.create({ userId: req.params.userId });
    }

    // Verificar se pode fazer check-in
    if (!progress.canCheckIn()) {
      let reason = '';

      if (!progress.isActive) {
        reason = 'Sistema de farm desativado';
      } else if (progress.usedFarmTON) {
        reason = 'TON farmado já foi usado';
      } else if (progress.daysCompleted >= 50) {
        reason = 'Você já completou os 50 dias';
      } else {
        reason = 'Check-in já realizado hoje';
      }

      return res.status(400).json({ 
        success: false, 
        error: reason 
      });
    }

    // Fazer check-in
    await progress.doCheckIn();

    res.json({
      success: true,
      message: `🎉 Check-in dia ${progress.daysCompleted} realizado com sucesso!`,
      data: {
        daysCompleted: progress.daysCompleted,
        tonAccumulated: progress.tonAccumulated,
        daysRemaining: 50 - progress.daysCompleted,
        tonRemaining: parseFloat((2.0 - progress.tonAccumulated).toFixed(2)),
        canBuyChest: progress.tonAccumulated >= 2.0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST - Usar TON farmado para comprar baú
router.post('/use-farm-ton/:userId', async (req, res) => {
  try {
    const progress = await FarmProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      return res.status(404).json({ 
        success: false, 
        error: 'Progresso de farm não encontrado' 
      });
    }

    // Usar TON farmado
    await progress.useFarmTON();

    res.json({
      success: true,
      message: '✅ TON farmado usado com sucesso! Sistema de farm desativado.',
      data: {
        usedFarmTON: true,
        isActive: false,
        deactivatedAt: progress.deactivatedAt
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Histórico de check-ins
router.get('/history/:userId', async (req, res) => {
  try {
    const progress = await FarmProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      return res.status(404).json({ 
        success: false, 
        error: 'Progresso não encontrado' 
      });
    }

    res.json({
      success: true,
      data: progress.checkInHistory
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
