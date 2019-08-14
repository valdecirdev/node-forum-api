// const mongoose = require('../../database');
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const AnswerSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Reply',
  }],
  upVotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  downVotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

AnswerSchema.plugin(mongoosePaginate);

const Answer = model('Answer', AnswerSchema);

module.exports = Answer;