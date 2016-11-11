<main>

  <div id="header-tag"></div>

  <div class="container">
    <div id="mounted"></div>
  </div>

  <script>
    var self = this;

    riot.route.base('/');

    self.on('updated', function() {
      riot.mount('#mounted', opts.tag, opts);
      riot.route(opts.path);

      // Mount Navbar and Footer
      if (opts.isAuthenticated) {
        riot.mount('#header-tag', 'header');
      }
    });
  </script>

</main>
