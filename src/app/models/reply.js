// const mongoose = require('../../database');
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ReplySchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  answer: {
    type: Schema.Types.ObjectId,
    ref: 'Answer',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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

ReplySchema.plugin(mongoosePaginate);

const Reply = model('Reply', ReplySchema);

module.exports = Reply;