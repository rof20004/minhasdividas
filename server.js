'use strict';

const Hapi = require('hapi');
const Config = require('./config');
const Routes = require('./routes');
const Path = require('path');
const HapiRiot = require('hapi-riot');

const server = new Hapi.Server();
server.connection({
  host: Config.server.host,
  port: Config.server.port,
  routes: {
    cors: true
  }
});

server.register([
  require('vision'),
  require('inert'),
  require('hapi-auth-cookie')
], (err) => {

  if (err) {
    throw err;
  }

  server.auth.strategy('session', 'cookie', true, {
    password: 'SessionAuth_Pé_Sword_Hapi_Server_Stats', //Use something more secure in production
    redirectTo: '/security/login', //If there is no session, redirect here
    isSecure: false, //Should be set to true (which is the default) in production
    isHttpOnly: true,
    clearInvalid: true
  });

  server.route(Routes.endpoints);

  server.views({
    engines: {
      tag: HapiRiot
    },
    relativeTo: __dirname,
    compileOptions: {
      layoutPath: Path.join(__dirname, 'layout'),
      layout: 'layout.html',
      compiledFileRoute: '/bundle.js'
    },
    path: 'views'
  });

  server.route({
    method: "GET",
    path: "/lib/{path*}",
    config: {
      auth: false,
      handler: {
        directory: {
          path: "./bower_components",
          listing: false,
          index: false
        }
      }
    }
  });

  server.route({
    method: "GET",
    path: "/public/{path*}",
    config: {
      auth: false,
      handler: {
        directory: {
          path: "./public",
          listing: false,
          index: false
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/favicon.ico',
    config: {
      auth: false,
      handler: function(request, reply) {
        reply.file(Path.join(__dirname, 'favicon.ico'));
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/manifest.json',
    config: {
      auth: false,
      handler: function(request, reply) {
        reply.file(Path.join(__dirname, 'manifest.json'));
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/bundle.js',
    config: {
      auth: false,
      handler: function(request, reply) {
        reply.file(Path.join(__dirname, 'bundle.js'));
      }
    }
  });

  // Start the server
  server.start((err) => {
    console.log('Server started:', server.info.uri);
  });
});
