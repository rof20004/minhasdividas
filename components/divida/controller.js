'use strict';

const Joi = require('joi');
const Divida = require('./model');
const Bcrypt = require('bcrypt');

exports.add = {
  handler: function(request, reply) {
    const divida = new Divida(request.payload);
    divida.id_usuario = request.auth.credentials[0]._id;
    divida.save((err, divida) => {
      if (err) {
        return reply({messageError: 'Erro no servidor'}).code(400);
      }
      reply({messageSuccess: 'Dívida cadastrada com sucesso'});
    });
  },
  validate: {
    payload: {
      descricao: Joi.string().trim().required(),
      valor: Joi.number().positive().required()
    },
    failAction: function(request, reply, source, error) {
      return reply({messageError: 'Existem informações incompletas ou inválidas'}).code(400);
    }
  }
}

exports.list = {
  handler: function(request, reply) {
    Divida.find({id_usuario: request.auth.credentials[0]._id}, (err, dividas) => {
      if (err) {
        return reply({messageError: 'Ocorreu um erro no servidor'}).code(400);
      }
      reply(dividas);
    });
  }
}

exports.remove = {
  handler: function(request, reply) {
    Divida.findByIdAndRemove({_id: request.params.id, id_usuario: request.auth.credentials[0]._id}, (err) => {
      if (err) {
        return reply({messageError: 'Ocorreu um erro no servidor'}).code(400);
      }
      reply({messageSuccess: 'Dívida removida com sucesso'});
    });
  },
  validate: {
    params: {
      id: Joi.string().trim().required()
    },
    failAction: function(request, reply, source, error) {
      return reply({messageError: 'Existem informações incompletas ou inválidas'}).code(400);
    }
  }
}

exports.update = {
  handler: function(request, reply) {
    Divida.findByIdAndUpdate({_id: request.params.id, id_usuario: request.auth.credentials[0]._id}, {$set: {descricao: request.payload.descricao}}, (err, divida) => {
      if (err) {
        return reply({messageError: 'Ocorreu um erro no servidor'}).code(400);
      }
      reply({messageSuccess: 'Dívida atualizada com sucesso'});
    });
  },
  validate: {
    params: {
      id: Joi.string().trim().required()
    },
    payload: {
      descricao: Joi.string().trim().required()
    },
    failAction: function(request, reply, source, error) {
      return reply({messageError: 'Existem informações incompletas ou inválidas'}).code(400);
    }
  }
}
