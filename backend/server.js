import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Schemas
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  balance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

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

const User = mongoose.model('User', userSchema);
const Ranger = mongoose.model('Ranger', rangerSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Constantes do sistema
const TRANSACTION_FEE = 0.01; // 1% de taxa
const ENERGY_COST_PERCENTAGE = 0.03; // 3% do farm diário

// Middleware de autenticação
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

// Rotas de autenticação
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

// Função para determinar qual Ranger vem no baú
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

// Rotas de Rangers
app.post('/api/rangers/buy', authenticateToken, async (req, res) => {
  try {
    const { chestType, walletAddress } = req.body;
    const userId = req.user.id;

    // Preços dos baús
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

    // Calcula preço com taxa de 1%
    const totalPrice = basePrice * (1 + TRANSACTION_FEE);
    const fee = basePrice * TRANSACTION_FEE;

    // Aqui você vai integrar com TON Connect para verificar pagamento
    // Por enquanto, vamos simular

    // Determina qual Ranger vem no baú
    const rangerData = determineRanger(chestType);

    // Calcula lucro máximo (2x valor base + 10%)
    const maxProfit = (rangerData.baseValue * 2) * 1.1;

    // Cria o Ranger no banco
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

    // Registra a transação
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

// Rota para ativar Ranger (pagar energia)
app.post('/api/rangers/:id/activate', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ranger = await Ranger.findOne({ _id: id, userId });
    if (!ranger) {
      return res.status(404).json({ error: 'Ranger não encontrado' });
    }

    // Verifica se o Ranger já atingiu o lucro máximo
    if (ranger.totalEarned >= ranger.maxProfit) {
      return res.status(400).json({ error: 'Ranger atingiu o lucro máximo e se aposentou' });
    }

    // Calcula custo de energia (3% do farm diário)
    const energyCost = ranger.dailyReward * ENERGY_COST_PERCENTAGE;

    const user = await User.findById(userId);
    if (user.balance < energyCost) {
      return res.status(400).json({ error: 'Saldo insuficiente para pagar energia' });
    }

    // Desconta energia do saldo
    user.balance -= energyCost;
    await user.save();

    ranger.isActive = true;
    ranger.lastActivation = new Date();
    await ranger.save();

    // Registra a transação de energia
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

// Rota para fazer claim de recompensas
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

    // Verifica se passou 24h desde a última ativação
    const now = new Date();
    const hoursSinceActivation = (now - ranger.lastActivation) / (1000 * 60 * 60);

    if (hoursSinceActivation < 24) {
      return res.status(400).json({ 
        error: 'Ainda não passou 24h desde a ativação',
        hoursRemaining: 24 - hoursSinceActivation
      });
    }

    // Verifica se o Ranger já atingiu o lucro máximo
    if (ranger.totalEarned >= ranger.maxProfit) {
      ranger.isActive = false;
      await ranger.save();
      return res.status(400).json({ error: 'Ranger atingiu o lucro máximo e se aposentou' });
    }

    // Calcula recompensa (não pode ultrapassar maxProfit)
    let reward = ranger.dailyReward;
    if (ranger.totalEarned + reward > ranger.maxProfit) {
      reward = ranger.maxProfit - ranger.totalEarned;
    }

    // Atualiza saldo do usuário
    const user = await User.findById(userId);
    user.balance += reward;
    user.totalEarned += reward;
    await user.save();

    // Atualiza Ranger
    ranger.totalEarned += reward;
    ranger.lastClaim = now;
    ranger.isActive = false; // Desativa após 24h
    await ranger.save();

    // Registra transação
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

// Rota para fazer saque (com taxa de 1%)
app.post('/api/transactions/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Calcula taxa de 1%
    const fee = amount * TRANSACTION_FEE;
    const netAmount = amount - fee;

    // Desconta do saldo
    user.balance -= amount;
    await user.save();

    // Aqui você vai integrar com TON Connect para enviar TON
    // Por enquanto, vamos simular

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

// Rota para buscar transações
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

// Rota de estatísticas
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
