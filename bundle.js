riot.tag2('button_logout', '<a href onclick="{doLogout}" class="nav-link">Logout <span class="sr-only">(current)</span> </a>', '', '', function(opts) {
    this.doLogout = function(e) {
      $.ajax({
        url: '/logout',
        method: 'POST',
        success: function (data, status, xhr) {

          var header = riot.mount(document.getElementById('header-tag'));
          header[0].unmount(true);

          riot.mount('#mounted', 'login');
          riot.route('/security/login');
        }
      });
    }.bind(this)
});

riot.tag2('divida_add', '<div class="alert alert-success" role="alert" show="{messageSuccess}"> <strong>Ok: </strong>{messageSuccess} </div> <div class="alert alert-danger" role="alert" show="{messageError}"> <strong>Erro: </strong>{messageError} </div> <form onsubmit="{add}"> <div class="form-group"> <div class="row"> <div class="col-md-6"> <label class="form-control-label" for="descricao">Descrição</label> <input class="form-control" type="text" name="descricao" id="descricao"> </div> <div class="col-md-6"> <label for="valor">Valor</label> <input class="form-control" type="text" name="valor" id="valor" data-prefix="R$ " data-thousands="." data-decimal="," data-allow-negative="false" data-precision="2" data-affixes-stay="false"> </div> </div> </div> <button class="btn btn-success">Salvar</button> </form> <br> <p> (*) Campos obrigatórios </p>', '', '', function(opts) {
    var self = this;

    self.messageSuccess = null;
    self.messageError = null;

    this.add = function(e) {
      $.ajax({
        url: '/divida/add',
        method: 'POST',
        data: {
          descricao: self.descricao.value,
          valor: $('#valor').maskMoney('unmasked')[0]
        },
        dataType: 'json',
        success: function (data, status, xhr) {
          self.messageError = null;
          self.messageSuccess = data.messageSuccess;
          clearFormFields();
          self.update();
          self.trigger('add');
        },
        error: function (data, status, xhr) {
          self.messageSuccess = null;
          self.messageError = 'Ocorreu um erro no servidor';
          self.update();
        }
      });
    }.bind(this)

    self.on('updated', function() {
      $('#valor').maskMoney();
    });

    function clearFormFields() {
      self.descricao.value = '';
      self.valor.value = '';
    }
});

riot.tag2('divida_list', '<small class="text-muted" style="float: left;">Para atualizar os dados das colunas \'Descrição\' e/ou \'Valor\' basta selecionar uma célula da tabela, alterar o conteúdo e clicar fora do campo após a atualização</small> <label style="float: right;" show="{rows}">Valor Total: <span id="valorTotal">{valorTotal}</span></label> <table id="tbDivida" class="table table-striped" show="{rows}"> <thead class="thead-inverse"> <tr> <th>Descrição</th> <th>Valor</th> <th>Ações</th> </tr> </thead> <tbody> <tr each="{row in rows}" no-reorder> <td contenteditable="true" onblur="{mergeDescricao.bind(this, row[\'_id\'])}">{row[\'descricao\']}</td> <td contenteditable="true" onblur="{mergeValor.bind(this, row[\'_id\'])}">{row[\'valor\']}</td> <td> <a href onclick="{remove.bind(this, row[\'descricao\'], row[\'_id\'])}">Remover</a> </td> </tr> </tbody> </table> <div class="modal fade" id="myModal"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title">Mensagem</h4> </div> <div class="modal-body"> <p>{message}</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button> </div> </div> </div> </div>', '', '', function(opts) {
    var self = this;
    self.valorTotal = 0;
    self.rows = null;

    this.mergeDescricao = function(id, e) {
      $.ajax({
        url: '/divida/' + id,
        method: 'PUT',
        data: {descricao: e.target.textContent},
        dataType: 'json',
        error: function (data, status, xhr) {
          self.message = 'Ocorreu um erro no servidor';
          $('#myModal').modal('show');
          self.update();
        }
      });
    }.bind(this)

    this.mergeValor = function(id, e) {
      $.ajax({
        url: '/divida/' + id,
        method: 'PUT',
        data: {valor: e.target.textContent},
        dataType: 'json',
        error: function (data, status, xhr) {
          self.message = 'Ocorreu um erro no servidor';
          $('#myModal').modal('show');
          self.update();
        }
      });
    }.bind(this)

    this.remove = function(descricao, id) {
      if (confirm('Deseja remover o item selecionado (' + descricao + ')?')) {
        $.ajax({
          url: '/divida/' + id,
          method: 'DELETE',
          dataType: 'json',
          success: function (data, status, xhr) {
            self.message = data.messageSuccess;
            $('#myModal').modal('show');
            self.trigger('recarregarTabela');
          },
          error: function (data, status, xhr) {
            self.update();
            self.message = 'Ocorreu um erro no servidor';
            $('#myModal').modal('show');
            self.update();
          }
        });
      }
    }.bind(this)

    function formataDinheiro(valor) {
      return "R$ " + valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    }

    function calculaValorTotal(dividas) {
      self.valorTotal = 0;
      if (dividas) {
        dividas.forEach(function(divida) {
          if (divida['valor']) {
            self.valorTotal += divida['valor'];
          }
        });
        $('#valorTotal').text(formataDinheiro(self.valorTotal));
      }
    }

    self.on('recarregarTabela', function () {
      $.ajax({
        url: '/divida/list',
        method: 'GET',
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data.length > 0) {
            self.rows = data;
          } else {
            self.rows = null;
          }
          calculaValorTotal(self.rows);
          self.update();
        },
        error: function (data, status, xhr) {
          self.rows = null;
          self.update();
        }
      });
    });

    self.on('mount', function () {
      self.trigger('recarregarTabela');
    });
});

riot.tag2('divida', '<h5>Módulo de Dívidas</h5> <br> <divida_add></divida_add> <divida_list></divida_list>', '', '', function(opts) {
    var self = this;

    self.tags.divida_add.on('add', function() {
      self.tags.divida_list.trigger('recarregarTabela');
    });
});

riot.tag2('header', '<nav class="navbar navbar-light navbar-fixed-top bg-faded"> <button class="navbar-toggler hidden-lg-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button> <div class="collapse navbar-toggleable-md" id="navbarResponsive"> <a class="navbar-brand" href="#">SRDP</a> <ul class="nav navbar-nav"> <li class="nav-item active"> <a class="nav-link" href="/">Home <span class="sr-only">(current)</span> </a> </li> <li class="nav-item"> <a class="nav-link" href onclick="{goToDivida}">Dívida</a> </li> </ul> <ul class="nav navbar-nav pull-md-right"> <li class="nav-item active"> <button_logout></button_logout> </li> </ul> </div> </nav>', '', '', function(opts) {
    var self = this;

    this.goToDivida = function(e) {
      riot.mount('#mounted', 'divida');
      riot.route('/divida');
    }.bind(this)
});

riot.tag2('index', '<h3>Bem Vindo Srº(ª) {opts.nomeUsuario}</h3>', '', '', function(opts) {
    var self = this;
});

riot.tag2('login', '<h5>Sistema de Registro de Dívidas Pessoais</h5> <div class="alert alert-danger" role="alert" show="{messageError}"> <strong>Erro: </strong>{messageError} </div> <form onsubmit="{doLogin}"> <div class="form-group"> <label for="email">E-mail</label> <input class="form-control" type="text" name="email" id="email"> </div> <div class="form-group"> <label for="password">Password</label> <input class="form-control" type="password" name="password" id="password"> </div> <button class="btn btn-primary">Entrar</button> <button class="btn btn-info" onclick="{goToUserRegister}">Criar Usuário</button> </form>', 'login,[riot-tag="login"],[data-is="login"]{ width: 55%; margin: 0 auto; } login h5,[riot-tag="login"] h5,[data-is="login"] h5{ text-align: center; }', '', function(opts) {
    var self = this;
    self.messageError = null;

    this.doLogin = function(e) {
      $.ajax({
        url: '/login',
        method: 'POST',
        data: {
          email: self.email.value,
          password: self.password.value
        },
        dataType: 'json',
        success: function (data, status, xhr) {
          riot.mount('#mounted', 'index', data);
          riot.route('/');

          riot.mount(document.getElementById('header-tag'), 'header');
        },
        error: function (data, status, xhr) {
          self.messageError = 'Ocorreu um erro no servidor';
          self.update();
        }
      });
    }.bind(this)

    this.goToUserRegister = function(e) {
      riot.mount('#mounted', 'user_add');
      riot.route('/user');
    }.bind(this)
});

riot.tag2('main', '<div id="header-tag"></div> <div class="container"> <div id="mounted"></div> </div>', '', '', function(opts) {
    var self = this;

    riot.route.base('/');

    self.on('updated', function() {
      riot.mount('#mounted', opts.tag, opts);
      riot.route(opts.path);

      if (opts.isAuthenticated) {
        riot.mount('#header-tag', 'header');
      }
    });
});

riot.tag2('user_add', '<h3>Cadastro de Usuário</h3> <div class="alert alert-success" role="alert" show="{messageSuccess}"> <strong>Ok: </strong>{messageSuccess} </div> <div class="alert alert-danger" role="alert" show="{messageError}"> <strong>Erro: </strong>{messageError} </div> <form onsubmit="{userAdd}"> <div class="form-group"> <div class="row"> <div class="col-md-6"> <label for="name">Nome <span>*</span> </label> <input class="form-control" type="text" name="name" id="name"> </div> <div class="col-md-6"> <label for="email">E-mail <span>*</span> </label> <input class="form-control" type="text" name="email" id="email"> </div> </div> </div> <div class="form-group"> <div class="row"> <div class="col-md-6"> <label for="password">Senha <span>*</span> </label> <input class="form-control" type="password" name="password" id="password"> </div> <div class="col-md-6"> <label for="password">Repita a senha <span>*</span> </label> <input class="form-control" type="password" name="passwordRepeat" id="passwordRepeat"> </div> </div> </div> <button class="btn btn-success">Salvar</button> <button class="btn btn-info" onclick="{goToLogin}">Voltar</button> </form> <br> <p> (*) Campos obrigatórios </p>', 'user_add h3,[riot-tag="user_add"] h3,[data-is="user_add"] h3{ text-align: center; }', '', function(opts) {
    var self = this;
    self.messageSuccess = null;
    self.messageError = null;

    this.userAdd = function(e) {
      $.ajax({
        url: '/user/add',
        method: 'POST',
        data: {
          name: self.name.value,
          email: self.email.value,
          password: self.password.value,
          passwordRepeat: self.passwordRepeat.value
        },
        dataType: 'json',
        success: function (data, status, xhr) {
          self.messageError = null;
          self.messageSuccess = data.messageSuccess;
          clearFormFields();
          self.update();
        },
        error: function (data, status, xhr) {
          self.messageSuccess = null;
          self.messageError = data.responseJSON.messageError;
          self.update();
        }
      });
    }.bind(this)

    this.goToLogin = function(e) {
      riot.mount('#mounted', 'login');
      riot.route('/security/login');
    }.bind(this)

    function clearFormFields() {
      self.name.value = '';
      self.email.value = '';
      self.password.value = '';
      self.passwordRepeat.value = '';
    }
});
