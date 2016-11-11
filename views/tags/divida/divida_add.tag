<divida_add>

  <div class="alert alert-success" role="alert" show="{messageSuccess}">
    <strong>Ok: </strong>{messageSuccess}
  </div>

  <div class="alert alert-danger" role="alert" show="{messageError}">
    <strong>Erro: </strong>{messageError}
  </div>

  <form onsubmit="{add}">
    <div class="form-group">
      <div class="row">
        <div class="col-md-6">
          <label class="form-control-label" for="descricao">Descrição</label>
          <input class="form-control" type="text" name="descricao" id="descricao">
        </div>
        <div class="col-md-6">
          <label for="valor">Valor</label>
          <input class="form-control" type="text" name="valor" id="valor" data-prefix="R$ " data-thousands="." data-decimal="," data-allow-negative="false" data-precision="2" data-affixes-stay="false">
        </div>
      </div>
    </div>
    <button class="btn btn-success">Salvar</button>
  </form>

  <br>

  <p>
    (*) Campos obrigatórios
  </p>

  <script>
    var self = this;

    self.messageSuccess = null;
    self.messageError = null;

    add(e) {
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
    }

    self.on('updated', function() {
      $('#valor').maskMoney();
    });

    function clearFormFields() {
      self.descricao.value = '';
      self.valor.value = '';
    }
  </script>

</divida_add>
