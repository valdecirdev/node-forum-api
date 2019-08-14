const mongoose = require('../../database');
const mongoosePaginate = require('mongoose-paginate');

const AnswerSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
  }],
  upVotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  downVotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

AnswerSchema.plugin(mongoosePaginate);

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;