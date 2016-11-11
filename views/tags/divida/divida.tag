<divida>

  <h5>Módulo de Dívidas</h5>

  <br>

  <divida_add />

  <divida_list />

  <script>
    var self = this;

    self.tags.divida_add.on('add', function() {
      self.tags.divida_list.trigger('recarregarTabela');
    });
  </script>

</divida>
