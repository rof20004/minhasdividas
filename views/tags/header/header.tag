<header>
  <nav class="navbar navbar-light navbar-fixed-top bg-faded">
    <button class="navbar-toggler hidden-lg-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button>
    <div class="collapse navbar-toggleable-md" id="navbarResponsive">
      <a class="navbar-brand" href="#">SRDP</a>
      <ul class="nav navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="/">Home
            <span class="sr-only">(current)</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href onclick="{goToDivida}">Dívida</a>
        </li>
      </ul>
      <ul class="nav navbar-nav pull-md-right">
        <li class="nav-item active">
          <button_logout></button_logout>
        </li>
      </ul>
    </div>
  </nav>

  <script>
    var self = this;

    goToDivida(e) {
      riot.mount('#mounted', 'divida');
      riot.route('/divida');
    }
  </script>
</header>
