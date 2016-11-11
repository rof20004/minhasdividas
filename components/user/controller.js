'use strict';

const Joi = require('joi');
const User = require('./model');
const Bcrypt = require('bcrypt');

exports.add = {
  auth: false,
  handler: function(request, reply) {
    if (request.payload.password !== request.payload.passwordRepeat) {
      return reply({messageError: 'Senhas não conferem'}).code(400);
    }

    request.payload.password = Bcrypt.hashSync(request.payload.password, 10);
    request.payload.scope = 'Customer';

    const user = new User(request.payload);
    user.save((err, user) => {
      if (err) {
        return reply({messageError: 'Erro no servidor'}).code(400);
      }
      reply({messageSuccess: 'Usuário cadastrado com sucesso'});
    });
  },
  validate: {
    payload: {
      name: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().required(),
      passwordRepeat: Joi.string().trim().required()
    },
    failAction: function(request, reply, source, error) {
      return reply({messageError: 'Existem informações incompletas ou inválidas'}).code(400);
    }
  }
}
