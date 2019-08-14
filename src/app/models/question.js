const mongoose = require('../../database');
const mongoosePaginate = require('mongoose-paginate');

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
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

QuestionSchema.plugin(mongoosePaginate);


const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;