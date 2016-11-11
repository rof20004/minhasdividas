<login>

  <h5>Sistema de Registro de Dívidas Pessoais</h5>

  <div class="alert alert-danger" role="alert" show="{messageError}">
    <strong>Erro:
    </strong>{messageError}
  </div>

  <form onsubmit="{doLogin}">
    <div class="form-group">
      <label for="email">E-mail</label>
      <input class="form-control" type="text" name="email" id="email">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input class="form-control" type="password" name="password" id="password">
    </div>
    <button class="btn btn-primary">Entrar</button>
    <button class="btn btn-info" onclick="{goToUserRegister}">Criar Usuário</button>
  </form>

  <style scoped>
    :scope {
      width: 55%;
      margin: 0 auto;
    }

    :scope h5 {
      text-align: center;
    }
  </style>

  <script>
    var self = this;
    self.messageError = null;

    doLogin(e) {
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

          // Mount Navbar and Footer
          riot.mount(document.getElementById('header-tag'), 'header');
        },
        error: function (data, status, xhr) {
          self.messageError = 'Ocorreu um erro no servidor';
          self.update();
        }
      });
    }

    goToUserRegister(e) {
      riot.mount('#mounted', 'user_add');
      riot.route('/user');
    }
  </script>

</login>
