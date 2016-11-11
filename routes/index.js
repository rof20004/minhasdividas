'use strict';

const Index 	 = require('../components/index');
const Security = require('../components/security');
const User 		 = require('../components/user');
const Divida 	 = require('../components/divida');

exports.endpoints = [

	// Views
	{method: 'GET',    	path: '/',													config: Index.View.index},
	{method: 'GET',    	path: '/security/login',						config: Security.View.index},
	{method: 'GET',    	path: '/user',											config: User.View.index},
	{method: 'GET',     path: '/divida',										config: Divida.View.index},

	// Controllers
	{method: 'POST',    path: '/user/add',									config: User.Controller.add},
	{method: 'POST',    path: '/login',											config: Security.Controller.login},
	{method: 'POST',    path: '/logout',										config: Security.Controller.logout},
	{method: 'POST',    path: '/divida/add',								config: Divida.Controller.add},
	{method: 'GET',     path: '/divida/list',								config: Divida.Controller.list},
	{method: 'DELETE',  path: '/divida/{id}',								config: Divida.Controller.remove},
	{method: 'PUT',  		path: '/divida/{id}',								config: Divida.Controller.update}

];
