const mongoose = require('../../database');

const AuthHistorySchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


const AuthHistory = mongoose.model('AuthHistory', AuthHistorySchema);

module.exports = AuthHistory;