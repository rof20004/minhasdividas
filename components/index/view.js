'use strict';

exports.index = {
  handler: function(request, reply) {
    var opts = {
      isAuthenticated: request.auth.isAuthenticated,
      tag: 'index',
      path: '/',
      nomeUsuario: request.auth.credentials[0].name
    };

    reply.view('tags/main/main', opts);
  }
};
