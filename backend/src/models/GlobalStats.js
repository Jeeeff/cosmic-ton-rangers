const mongoose = require('mongoose');

const globalStatsSchema = new mongoose.Schema({
  totalChestsSold: {
    type: Number,
    default: 0
  },
  chestsSoldByType: {
    cadete: { type: Number, default: 0 },
    explorador: { type: Number, default: 0 },
    comandante: { type: Number, default: 0 },
    elite: { type: Number, default: 0 },
    estelar: { type: Number, default: 0 },
    cosmico: { type: Number, default: 0 }
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalFees: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Método estático para obter ou criar stats
globalStatsSchema.statics.getStats = async function() {
  let stats = await this.findOne();

  if (!stats) {
    stats = await this.create({
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

  return stats;
};

// Método para incrementar venda de baú
globalStatsSchema.statics.incrementChestSale = async function(chestType, price) {
  const stats = await this.getStats();

  stats.totalChestsSold += 1;
  stats.chestsSoldByType[chestType] += 1;
  stats.totalRevenue += price;
  stats.totalFees += price * 0.01; // Taxa de 1%
  stats.lastUpdated = new Date();

  await stats.save();
  return stats;
};

module.exports = mongoose.model('GlobalStats', globalStatsSchema);
