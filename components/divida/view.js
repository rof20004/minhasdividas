'use strict';

exports.index = {
  handler: function(request, reply) {
    var opts = {
      isAuthenticated: request.auth.isAuthenticated,
      tag: 'divida',
      path: '/divida'
    };

    reply.view('tags/main/main', opts);
  }
};
