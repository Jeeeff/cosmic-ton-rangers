const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'claim', 'referral', 'bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  ranger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ranger',
    default: null
  },
  tonTransactionHash: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para buscar transações de um usuário
transactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
