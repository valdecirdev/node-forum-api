// const mongoose = require('../../database');
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const QuestionSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer',
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

QuestionSchema.plugin(mongoosePaginate);


const Question = model('Question', QuestionSchema);

module.exports = Question;