const bcrypt = require('bcryptjs');
const { Schema, model } = require('mongoose');
// const mongoose = require('../../database');

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  display_name: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  linkedin: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  confirmToken: {
    type: String,
    required: false,
  },
  passwordResetToken: {
    type: String,
    required: false,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    required: false,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

UserSchema.pre('save', async function (next) {
  if( this.password !== undefined ) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }

  next();
});

const User = model('User', UserSchema);

module.exports = User;