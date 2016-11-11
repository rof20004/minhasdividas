<divida_list>

  <!-- Tabela com a lista de Dívidas  -->
  <small class="text-muted" style="float: left;">Para atualizar os dados das colunas 'Descrição' e/ou 'Valor' basta selecionar uma célula da tabela, alterar o conteúdo e clicar fora do campo após a atualização</small>
  <label style="float: right;" show="{rows}">Valor Total: <span id="valorTotal" >{valorTotal}</span></label>
  <table id="tbDivida" class="table table-striped" show="{rows}">
    <thead class="thead-inverse">
      <tr>
        <th>Descrição</th>
        <th>Valor</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr each="{row in rows}" no-reorder>
        <td contenteditable="true" onblur="{mergeDescricao.bind(this, row['_id'])}">{row['descricao']}</td>
        <td contenteditable="true" onblur="{mergeValor.bind(this, row['_id'])}">{row['valor']}</td>
        <td>
          <a href onclick="{remove.bind(this, row['descricao'], row['_id'])}">Remover</a>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Dialog Modal para exibir mensagem de sucesso ou erro  -->
  <div class="modal fade" id="myModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Mensagem</h4>
        </div>
        <div class="modal-body">
          <p>{message}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        </div>
      </div>
      <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
  </div>
  <!-- /.modal -->

  <script>
    var self = this;
    self.valorTotal = 0;
    self.rows = null;

    mergeDescricao(id, e) {
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
    }

    mergeValor(id, e) {
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
    }

    remove(descricao, id) {
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
    }

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
  </script>
</divida_list>
