<user_add>

  <h3>Cadastro de Usuário</h3>

  <div class="alert alert-success" role="alert" show="{messageSuccess}">
    <strong>Ok: </strong>{messageSuccess}
  </div>

  <div class="alert alert-danger" role="alert" show="{messageError}">
    <strong>Erro: </strong>{messageError}
  </div>

  <form onsubmit="{userAdd}">
    <div class="form-group">
      <div class="row">
        <div class="col-md-6">
          <label for="name">Nome
            <span>*</span>
          </label>
          <input class="form-control" type="text" name="name" id="name">
        </div>
        <div class="col-md-6">
          <label for="email">E-mail
            <span>*</span>
          </label>
          <input class="form-control" type="text" name="email" id="email">
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col-md-6">
          <label for="password">Senha
            <span>*</span>
          </label>
          <input class="form-control" type="password" name="password" id="password">
        </div>
        <div class="col-md-6">
          <label for="password">Repita a senha
            <span>*</span>
          </label>
          <input class="form-control" type="password" name="passwordRepeat" id="passwordRepeat">
        </div>
      </div>
    </div>
    <button class="btn btn-success">Salvar</button>
    <button class="btn btn-info" onclick="{goToLogin}">Voltar</button>
  </form>

  <br>

  <p>
    (*) Campos obrigatórios
  </p>

  <style scoped>
    :scope h3 {
      text-align: center;
    }
  </style>

  <script>
    var self = this;
    self.messageSuccess = null;
    self.messageError = null;

    userAdd(e) {
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
    }

    goToLogin(e) {
      riot.mount('#mounted', 'login');
      riot.route('/security/login');
    }

    function clearFormFields() {
      self.name.value = '';
      self.email.value = '';
      self.password.value = '';
      self.passwordRepeat.value = '';
    }
  </script>

</user_add>
