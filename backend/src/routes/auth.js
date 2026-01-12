const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { isValidTelegramId } = require('../utils/validation');

// Gera código de referral único
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// POST /api/auth/telegram - Autenticação via Telegram
router.post('/telegram', async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body;

    if (!telegramId || !isValidTelegramId(telegramId)) {
      return res.status(400).json({ 
        error: 'Telegram ID inválido' 
      });
    }

    // Busca ou cria usuário
    let user = await User.findOne({ telegramId });

    if (!user) {
      // Cria novo usuário
      user = await User.create({
        telegramId,
        username: username || '',
        firstName: firstName || '',
        lastName: lastName || '',
        referralCode: generateReferralCode()
      });

      console.log(`✅ Novo usuário criado: ${telegramId}`);
    } else {
      // Atualiza informações do usuário
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      await user.save();
    }

    // Gera JWT token
    const token = jwt.sign(
      { userId: user._id, telegramId: user.telegramId },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        balance: user.balance,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    console.error('Error in /auth/telegram:', error);
    res.status(500).json({ 
      error: 'Erro ao autenticar usuário' 
    });
  }
});

// GET /api/auth/me - Retorna dados do usuário autenticado
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        balance: user.balance,
        totalEarned: user.totalEarned,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    console.error('Error in /auth/me:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = router;
