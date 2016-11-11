'use strict';

var Mongoose = require('../../db').Mongoose;

var dividaSchema = new Mongoose.Schema({
  descricao: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  id_usuario: {
    type: String,
    required: true
  }
});

module.exports = Mongoose.model('Divida', dividaSchema, 'divida');
