const mongoose = require('mongoose');

const farmProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  daysCompleted: {
    type: Number,
    default: 0,
    max: 50
  },
  tonAccumulated: {
    type: Number,
    default: 0,
    max: 2.0
  },
  lastCheckIn: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usedFarmTON: {
    type: Boolean,
    default: false
  },
  checkInHistory: [{
    day: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    tonEarned: {
      type: Number,
      default: 0.04
    }
  }],
  deactivatedAt: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
});

// Método para verificar se pode fazer check-in
farmProgressSchema.methods.canCheckIn = function() {
  if (!this.isActive || this.usedFarmTON || this.daysCompleted >= 50) {
    return false;
  }

  if (!this.lastCheckIn) {
    return true;
  }

  const today = new Date().setHours(0, 0, 0, 0);
  const lastCheckIn = new Date(this.lastCheckIn).setHours(0, 0, 0, 0);

  return today > lastCheckIn;
};

// Método para fazer check-in
farmProgressSchema.methods.doCheckIn = async function() {
  if (!this.canCheckIn()) {
    throw new Error('Check-in não disponível');
  }

  this.daysCompleted += 1;
  this.tonAccumulated = parseFloat((this.tonAccumulated + 0.04).toFixed(2));
  this.lastCheckIn = new Date();

  this.checkInHistory.push({
    day: this.daysCompleted,
    date: new Date(),
    tonEarned: 0.04
  });

  await this.save();
  return this;
};

// Método para usar TON farmado
farmProgressSchema.methods.useFarmTON = async function() {
  if (this.tonAccumulated < 2.0) {
    throw new Error('TON insuficiente. Você precisa de 2 TON para usar.');
  }

  if (this.usedFarmTON) {
    throw new Error('TON farmado já foi usado anteriormente.');
  }

  this.usedFarmTON = true;
  this.isActive = false;
  this.deactivatedAt = new Date();

  await this.save();
  return this;
};

module.exports = mongoose.model('FarmProgress', farmProgressSchema);
