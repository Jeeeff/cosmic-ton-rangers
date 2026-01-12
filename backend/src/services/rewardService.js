const User = require('../models/User');
const Ranger = require('../models/Ranger');
const Transaction = require('../models/Transaction');
const { calculateAccumulatedReward, canClaim } = require('../utils/raritySystem');
const tonService = require('./tonService');

class RewardService {
  // Calcula recompensa total disponível para claim
  async calculateTotalReward(userId) {
    try {
      const rangers = await Ranger.find({ 
        owner: userId, 
        isActive: true 
      });

      let totalReward = 0;

      for (const ranger of rangers) {
        const reward = calculateAccumulatedReward(ranger);
        totalReward += reward;
      }

      return totalReward;
    } catch (error) {
      console.error('Error calculating total reward:', error);
      return 0;
    }
  }

  // Processa o claim de recompensas
  async processClaim(userId, walletAddress) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, message: 'Usuário não encontrado' };
      }

      const rangers = await Ranger.find({ 
        owner: userId, 
        isActive: true 
      });

      if (rangers.length === 0) {
        return { success: false, message: 'Você não possui Rangers ativos' };
      }

      let totalReward = 0;
      const updatedRangers = [];

      // Calcula recompensa de cada Ranger
      for (const ranger of rangers) {
        if (canClaim(ranger)) {
          const reward = calculateAccumulatedReward(ranger);
          totalReward += reward;

          // Atualiza o Ranger
          ranger.totalEarned += reward;
          ranger.daysActive += 1;
          ranger.lastRewardDate = new Date();
          await ranger.save();

          updatedRangers.push(ranger);
        }
      }

      if (totalReward === 0) {
        return { 
          success: false, 
          message: 'Nenhuma recompensa disponível. Aguarde 24h desde o último claim.' 
        };
      }

      // Envia TON para o usuário (testnet)
      const sendResult = await tonService.sendTon(
        walletAddress,
        totalReward,
        `Cosmic Rangers Reward: ${totalReward.toFixed(2)} TON`
      );

      if (!sendResult.success) {
        return { 
          success: false, 
          message: 'Erro ao enviar recompensa. Tente novamente.' 
        };
      }

      // Atualiza dados do usuário
      user.totalEarned += totalReward;
      user.totalClaimed += totalReward;
      user.lastClaimDate = new Date();
      await user.save();

      // Registra a transação
      await Transaction.create({
        user: userId,
        type: 'claim',
        amount: totalReward,
        status: 'completed',
        description: `Claim de ${updatedRangers.length} Rangers`
      });

      return {
        success: true,
        amount: totalReward,
        rangers: updatedRangers.length,
        message: `${totalReward.toFixed(2)} TON enviados para sua carteira!`
      };
    } catch (error) {
      console.error('Error processing claim:', error);
      return { 
        success: false, 
        message: 'Erro ao processar claim. Tente novamente.' 
      };
    }
  }

  // Calcula estatísticas do usuário
  async getUserStats(userId) {
    try {
      const user = await User.findById(userId);
      const rangers = await Ranger.find({ owner: userId, isActive: true });

      const totalInvested = rangers.reduce((sum, r) => sum + r.purchasePrice, 0);
      const totalEarned = user.totalEarned;
      const pendingReward = await this.calculateTotalReward(userId);
      const dailyIncome = rangers.reduce((sum, r) => sum + r.dailyReward, 0);

      return {
        totalRangers: rangers.length,
        totalInvested,
        totalEarned,
        pendingReward,
        dailyIncome,
        roi: totalInvested > 0 ? ((totalEarned / totalInvested) * 100).toFixed(2) : 0
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }
}

module.exports = new RewardService();
