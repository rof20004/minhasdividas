'use strict';

const Boom = require('boom');
const Joi = require('joi');
const User = require('../user/model');
const Bcrypt = require('bcrypt');

exports.login = {
  auth: {
    mode: 'try'
  },
  handler: function(request, reply) {
    User.find({email: request.payload.email}, (err, user) => {
      if (err) {
        return reply(Boom.badData('Erro no servidor', err));
      }

      if (user.length === 1) {
        if (Bcrypt.compareSync(request.payload.password, user[0].password)) {
          request.cookieAuth.set(user);
          return reply({nomeUsuario: user[0].name});
        } else {
          return reply(Boom.unauthorized('Usuário ou senha inválidos', err));
        }
      } else {
        return reply(Boom.unauthorized('Usuário ou senha inválidos', err));
      }
    });
  },
  plugins: {
    'hapi-auth-cookie': {
      redirectTo: false
    }
  }
}

exports.logout = {
  auth: {
    mode: 'try'
  },
  handler: function(request, reply) {
    request.cookieAuth.clear();
    reply.continue();
  },
  plugins: {
    'hapi-auth-cookie': {
      redirectTo: false
    }
  }
}
