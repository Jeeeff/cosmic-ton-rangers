const mongoose = require('mongoose');

const rangerSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['Cadete', 'Explorador', 'Comandante', 'Elite', 'Estelar', 'Cósmico'],
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  dailyReward: {
    type: Number,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  daysActive: {
    type: Number,
    default: 0
  },
  roiDays: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastRewardDate: {
    type: Date,
    default: null
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para buscar rangers de um usuário
rangerSchema.index({ owner: 1, isActive: 1 });

module.exports = mongoose.model('Ranger', rangerSchema);
