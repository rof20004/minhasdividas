'use strict';

var Mongoose = require('../../db').Mongoose;

var userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: {unique: true},
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  scope: {
    type: String,
    enum: ['Admin', 'Customer'],
    required: true
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  needResetPassword: {
    type: Boolean,
    default: false
  }
});

module.exports = Mongoose.model('User', userSchema, 'user');
