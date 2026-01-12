import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// ============================================
// MIDDLEWARES
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// CONECTAR AO MONGODB
// ============================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// ============================================
// SCHEMAS
// ============================================

// User Schema
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  balance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Ranger Schema
const rangerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rarity: { type: String, required: true },
  dailyReward: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  totalEarned: { type: Number, default: 0 },
  maxProfit: { type: Number, required: true },
  roiDays: { type: Number, required: true },
  isActive: { type: Boolean, default: false },
  lastActivation: Date,
  lastClaim: Date,
  createdAt: { type: Date, default: Date.now }
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['purchase', 'claim', 'withdrawal', 'energy'], required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  description: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  walletAddress: String,
  createdAt: { type: Date, default: Date.now }
});

// FarmProgress Schema
const farmProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  daysCompleted: { type: Number, default: 0, max: 50 },
  tonAccumulated: { type: Number, default: 0, max: 2.0 },
  lastCheckIn: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  usedFarmTON: { type: Boolean, default: false },
  checkInHistory: [{
    day: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    tonEarned: { type: Number, default: 0.04 }
  }],
  deactivatedAt: { type: Date, default: null }
}, { timestamps: true });

// GlobalStats Schema
const globalStatsSchema = new mongoose.Schema({
  totalChestsSold: { type: Number, default: 0 },
  chestsSoldByType: {
    cadete: { type: Number, default: 0 },
    explorador: { type: Number, default: 0 },
    comandante: { type: Number, default: 0 },
    elite: { type: Number, default: 0 },
    estelar: { type: Number, default: 0 },
    cosmico: { type: Number, default: 0 }
  },
  totalRevenue: { type: Number, default: 0 },
  totalFees: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// ============================================
// MODELS
// ============================================
const User = mongoose.model('User', userSchema);
const Ranger = mongoose.model('Ranger', rangerSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const FarmProgress = mongoose.model('FarmProgress', farmProgressSchema);
const GlobalStats = mongoose.model('GlobalStats', globalStatsSchema);

// ============================================
// CONSTANTES DO SISTEMA
// ============================================
const TRANSACTION_FEE = 0.01; // 1% de taxa
const ENERGY_COST_PERCENTAGE = 0.03; // 3% do farm diário

// ============================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ============================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// ROTAS DE AUTENTICAÇÃO
// ============================================

app.post('/api/auth/telegram', async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body;

    let user = await User.findOne({ telegramId });

    if (!user) {
      user = new User({
        telegramId,
        username,
        firstName,
        lastName
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, telegramId: user.telegramId },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// ============================================
// FUNÇÃO PARA DETERMINAR RANGER DO BAÚ
// ============================================
function determineRanger(chestType) {
  const random = Math.random() * 100;

  const chestContents = {
    common: [
      { rarity: 'Cadete', chance: 100, dailyReward: 0.025, roiDays: 80, baseValue: 2 }
    ],
    rare: [
      { rarity: 'Cadete', chance: 70, dailyReward: 0.025, roiDays: 200, baseValue: 2 },
      { rarity: 'Explorador', chance: 30, dailyReward: 0.0667, roiDays: 75, baseValue: 5 }
    ],
    stellar: [
      { rarity: 'Explorador', chance: 50, dailyReward: 0.0667, roiDays: 180, baseValue: 5 },
      { rarity: 'Comandante', chance: 35, dailyReward: 0.1846, roiDays: 65, baseValue: 12 },
      { rarity: 'Elite', chance: 15, dailyReward: 0.2182, roiDays: 55, baseValue: 20 }
    ],
    elite: [
      { rarity: 'Comandante', chance: 50, dailyReward: 0.1846, roiDays: 108, baseValue: 12 },
      { rarity: 'Elite', chance: 40, dailyReward: 0.2182, roiDays: 92, baseValue: 20 },
      { rarity: 'Estelar', chance: 10, dailyReward: 0.4444, roiDays: 45, baseValue: 40 }
    ],
    cosmic: [
      { rarity: 'Elite', chance: 60, dailyReward: 0.2182, roiDays: 137, baseValue: 20 },
      { rarity: 'Estelar', chance: 35, dailyReward: 0.4444, roiDays: 67, baseValue: 40 },
      { rarity: 'Cósmico', chance: 5, dailyReward: 0.8571, roiDays: 35, baseValue: 80 }
    ]
  };

  const options = chestContents[chestType];
  let cumulative = 0;

  for (const option of options) {
    cumulative += option.chance;
    if (random <= cumulative) {
      return option;
    }
  }

  return options[0]; // Fallback
}

// ============================================
// ROTAS DE RANGERS
// ============================================

app.post('/api/rangers/buy', authenticateToken, async (req, res) => {
  try {
    const { chestType, walletAddress } = req.body;
    const userId = req.user.id;

    const chestPrices = {
      common: 2,
      rare: 5,
      stellar: 12,
      elite: 20,
      cosmic: 30
    };

    const basePrice = chestPrices[chestType];
    if (!basePrice) {
      return res.status(400).json({ error: 'Tipo de baú inválido' });
    }

    const totalPrice = basePrice * (1 + TRANSACTION_FEE);
    const fee = basePrice * TRANSACTION_FEE;

    const rangerData = determineRanger(chestType);
    const maxProfit = (rangerData.baseValue * 2) * 1.1;

    const newRanger = new Ranger({
      userId,
      name: `${rangerData.rarity} #${Math.floor(Math.random() * 10000)}`,
      rarity: rangerData.rarity,
      dailyReward: rangerData.dailyReward,
      purchasePrice: totalPrice,
      maxProfit: maxProfit,
      roiDays: rangerData.roiDays,
      isActive: false,
      lastActivation: null
    });

    await newRanger.save();

    const transaction = new Transaction({
      userId,
      type: 'purchase',
      amount: totalPrice,
      fee: fee,
      description: `Compra de baú ${chestType}`,
      status: 'completed',
      walletAddress
    });

    await transaction.save();

    // Incrementar estatísticas globais
    let stats = await GlobalStats.findOne();
    if (!stats) {
      stats = await GlobalStats.create({
        totalChestsSold: 0,
        chestsSoldByType: {
          cadete: 0,
          explorador: 0,
          comandante: 0,
          elite: 0,
          estelar: 0,
          cosmico: 0
        },
        totalRevenue: 0,
        totalFees: 0
      });
    }

    stats.totalChestsSold += 1;
    stats.chestsSoldByType[chestType] += 1;
    stats.totalRevenue += basePrice;
    stats.totalFees += fee;
    stats.lastUpdated = new Date();
    await stats.save();

    res.json({
      message: 'Ranger comprado com sucesso!',
      ranger: newRanger,
      totalPaid: totalPrice,
      fee: fee
    });
  } catch (error) {
    console.error('Erro ao comprar Ranger:', error);
    res.status(500).json({ error: 'Erro ao processar compra' });
  }
});

app.get('/api/rangers', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const rangers = await Ranger.find({ userId });
    res.json({ rangers });
  } catch (error) {
    console.error('Erro ao buscar Rangers:', error);
    res.status(500).json({ error: 'Erro ao buscar Rangers' });
  }
});

app.post('/api/rangers/:id/activate', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ranger = await Ranger.findOne({ _id: id, userId });

    if (!ranger) {
      return res.status(404).json({ error: 'Ranger não encontrado' });
    }

    if (ranger.totalEarned >= ranger.maxProfit) {
      return res.status(400).json({ error: 'Ranger atingiu o lucro máximo e se aposentou' });
    }

    const energyCost = ranger.dailyReward * ENERGY_COST_PERCENTAGE;
    const user = await User.findById(userId);

    if (user.balance < energyCost) {
      return res.status(400).json({ error: 'Saldo insuficiente para pagar energia' });
    }

    user.balance -= energyCost;
    await user.save();

    ranger.isActive = true;
    ranger.lastActivation = new Date();
    await ranger.save();

    const transaction = new Transaction({
      userId,
      type: 'energy',
      amount: energyCost,
      description: `Ativação de ${ranger.name}`,
      status: 'completed'
    });

    await transaction.save();

    res.json({
      message: 'Ranger ativado com sucesso!',
      energyCost,
      ranger,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Erro ao ativar Ranger:', error);
    res.status(500).json({ error: 'Erro ao ativar Ranger' });
  }
});

app.post('/api/rangers/:id/claim', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ranger = await Ranger.findOne({ _id: id, userId });

    if (!ranger) {
      return res.status(404).json({ error: 'Ranger não encontrado' });
    }

    if (!ranger.isActive) {
      return res.status(400).json({ error: 'Ranger não está ativo' });
    }

    const now = new Date();
    const hoursSinceActivation = (now - ranger.lastActivation) / (1000 * 60 * 60);

    if (hoursSinceActivation < 24) {
      return res.status(400).json({ 
        error: 'Ainda não passou 24h desde a ativação',
        hoursRemaining: 24 - hoursSinceActivation
      });
    }

    if (ranger.totalEarned >= ranger.maxProfit) {
      ranger.isActive = false;
      await ranger.save();
      return res.status(400).json({ error: 'Ranger atingiu o lucro máximo e se aposentou' });
    }

    let reward = ranger.dailyReward;
    if (ranger.totalEarned + reward > ranger.maxProfit) {
      reward = ranger.maxProfit - ranger.totalEarned;
    }

    const user = await User.findById(userId);
    user.balance += reward;
    user.totalEarned += reward;
    await user.save();

    ranger.totalEarned += reward;
    ranger.lastClaim = now;
    ranger.isActive = false;
    await ranger.save();

    const transaction = new Transaction({
      userId,
      type: 'claim',
      amount: reward,
      description: `Claim de ${ranger.name}`,
      status: 'completed'
    });

    await transaction.save();

    res.json({
      message: 'Recompensa coletada com sucesso!',
      reward,
      newBalance: user.balance,
      ranger
    });
  } catch (error) {
    console.error('Erro ao fazer claim:', error);
    res.status(500).json({ error: 'Erro ao processar claim' });
  }
});

// ============================================
// ROTAS DE TRANSAÇÕES
// ============================================

app.post('/api/transactions/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    const fee = amount * TRANSACTION_FEE;
    const netAmount = amount - fee;

    user.balance -= amount;
    await user.save();

    const transaction = new Transaction({
      userId,
      type: 'withdrawal',
      amount: netAmount,
      fee: fee,
      description: `Saque para carteira`,
      status: 'completed',
      walletAddress
    });

    await transaction.save();

    res.json({
      message: 'Saque realizado com sucesso!',
      amount: netAmount,
      fee: fee,
      walletAddress,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Erro ao fazer saque:', error);
    res.status(500).json({ error: 'Erro ao processar saque' });
  }
});

app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ transactions });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// ============================================
// ROTAS DE ESTATÍSTICAS
// ============================================

app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const rangers = await Ranger.find({ userId });

    const activeRangers = rangers.filter(r => r.isActive).length;
    const totalRangers = rangers.length;
    const totalInvested = rangers.reduce((sum, r) => sum + r.purchasePrice, 0);
    const totalEarned = user.totalEarned;
    const currentBalance = user.balance;

    res.json({
      stats: {
        totalRangers,
        activeRangers,
        totalInvested,
        totalEarned,
        currentBalance,
        roi: totalInvested > 0 ? ((totalEarned / totalInvested) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// ============================================
// ROTAS DE FARM (50 DIAS)
// ============================================

app.get('/api/farm/progress/:userId', authenticateToken, async (req, res) => {
  try {
    let progress = await FarmProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      progress = await FarmProgress.create({ userId: req.params.userId });
    }

    const canCheckIn = () => {
      if (!progress.isActive || progress.usedFarmTON || progress.daysCompleted >= 50) {
        return false;
      }

      if (!progress.lastCheckIn) {
        return true;
      }

      const today = new Date().setHours(0, 0, 0, 0);
      const lastCheckIn = new Date(progress.lastCheckIn).setHours(0, 0, 0, 0);

      return today > lastCheckIn;
    };

    res.json({
      success: true,
      data: {
        ...progress.toObject(),
        canCheckIn: canCheckIn(),
        daysRemaining: 50 - progress.daysCompleted,
        tonRemaining: parseFloat((2.0 - progress.tonAccumulated).toFixed(2)),
        progressPercentage: (progress.daysCompleted / 50 * 100).toFixed(1)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/farm/checkin/:userId', authenticateToken, async (req, res) => {
  try {
    let progress = await FarmProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      progress = await FarmProgress.create({ userId: req.params.userId });
    }

    const canCheckIn = () => {
      if (!progress.isActive || progress.usedFarmTON || progress.daysCompleted >= 50) {
        return false;
      }

      if (!progress.lastCheckIn) {
        return true;
      }

      const today = new Date().setHours(0, 0, 0, 0);
      const lastCheckIn = new Date(progress.lastCheckIn).setHours(0, 0, 0, 0);

      return today > lastCheckIn;
    };

    if (!canCheckIn()) {
      let reason = '';
      if (!progress.isActive) reason = 'Sistema de farm desativado';
      else if (progress.usedFarmTON) reason = 'TON farmado já foi usado';
      else if (progress.daysCompleted >= 50) reason = 'Você já completou os 50 dias';
      else reason = 'Check-in já realizado hoje';

      return res.status(400).json({ success: false, error: reason });
    }

    progress.daysCompleted += 1;
    progress.tonAccumulated = parseFloat((progress.tonAccumulated + 0.04).toFixed(2));
    progress.lastCheckIn = new Date();

    progress.checkInHistory.push({
      day: progress.daysCompleted,
      date: new Date(),
      tonEarned: 0.04
    });

    await progress.save();

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
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/farm/use-farm-ton/:userId', authenticateToken, async (req, res) => {
  try {
    const progress = await FarmProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progresso não encontrado' });
    }

    if (progress.tonAccumulated < 2.0) {
      return res.status(400).json({ 
        success: false, 
        error: 'TON insuficiente. Você precisa de 2 TON.' 
      });
    }

    if (progress.usedFarmTON) {
      return res.status(400).json({ 
        success: false, 
        error: 'TON farmado já foi usado anteriormente.' 
      });
    }

    progress.usedFarmTON = true;
    progress.isActive = false;
    progress.deactivatedAt = new Date();
    await progress.save();

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
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/farm/history/:userId', authenticateToken, async (req, res) => {
  try {
    const progress = await FarmProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progresso não encontrado' });
    }

    res.json({
      success: true,
      data: progress.checkInHistory
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ROTAS DE ESTATÍSTICAS GLOBAIS
// ============================================

app.get('/api/stats/global', async (req, res) => {
  try {
    let stats = await GlobalStats.findOne();

    if (!stats) {
      stats = await GlobalStats.create({
        totalChestsSold: 0,
        chestsSoldByType: {
          cadete: 0,
          explorador: 0,
          comandante: 0,
          elite: 0,
          estelar: 0,
          cosmico: 0
        },
        totalRevenue: 0,
        totalFees: 0
      });
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/stats/increment-sale', async (req, res) => {
  try {
    const { chestType, price } = req.body;

    if (!chestType || !price) {
      return res.status(400).json({ 
        success: false, 
        error: 'chestType e price são obrigatórios' 
      });
    }

    let stats = await GlobalStats.findOne();

    if (!stats) {
      stats = await GlobalStats.create({
        totalChestsSold: 0,
        chestsSoldByType: {
          cadete: 0,
          explorador: 0,
          comandante: 0,
          elite: 0,
          estelar: 0,
          cosmico: 0
        },
        totalRevenue: 0,
        totalFees: 0
      });
    }

    stats.totalChestsSold += 1;
    stats.chestsSoldByType[chestType] += 1;
    stats.totalRevenue += price;
    stats.totalFees += price * 0.01;
    stats.lastUpdated = new Date();

    await stats.save();

    res.json({
      success: true,
      message: 'Estatísticas atualizadas',
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cosmic TON Rangers API is running!' });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
