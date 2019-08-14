const mongoose = require('../../database');
const mongoosePaginate = require('mongoose-paginate');

const ReplySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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

ReplySchema.plugin(mongoosePaginate);

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;