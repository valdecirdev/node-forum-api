// const mongoose = require('../../database');
const { Schema, model } = require('mongoose');

const AuthHistorySchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
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


const AuthHistory = model('AuthHistory', AuthHistorySchema);

module.exports = AuthHistory;