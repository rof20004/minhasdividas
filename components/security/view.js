'use strict';

exports.index = {
  auth: {
    mode: 'try'
  },
  handler: function(request, reply) {
    var opts = {};

    if (request.auth.isAuthenticated) {
      opts.tag = 'index';
      opts.path = '/';
      opts.nomeUsuario = request.auth.credentials[0].name;
    } else {
      opts.tag = 'login';
      opts.path = '/security/login';
    }

    opts.isAuthenticated = request.auth.isAuthenticated;

    reply.view('tags/main/main', opts);
  },
  plugins: {
    'hapi-auth-cookie': {
      redirectTo: false
    }
  }
};
