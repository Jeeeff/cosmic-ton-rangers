const express = require('express');
const router = express.Router();
const GlobalStats = require('../models/GlobalStats');

// GET - Buscar estatísticas globais
router.get('/global', async (req, res) => {
  try {
    const stats = await GlobalStats.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST - Incrementar venda de baú (chamado após compra)
router.post('/increment-sale', async (req, res) => {
  try {
    const { chestType, price } = req.body;

    if (!chestType || !price) {
      return res.status(400).json({ 
        success: false, 
        error: 'chestType e price são obrigatórios' 
      });
    }

    const stats = await GlobalStats.incrementChestSale(chestType, price);

    res.json({
      success: true,
      message: 'Estatísticas atualizadas',
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
