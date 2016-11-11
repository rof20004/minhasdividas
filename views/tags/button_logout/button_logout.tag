<button_logout>
  <a href onclick="{doLogout}" class="nav-link">Logout
    <span class="sr-only">(current)</span>
  </a>
  <script>
    doLogout(e) {
      $.ajax({
        url: '/logout',
        method: 'POST',
        success: function (data, status, xhr) {
          // Unmount Navbar and Footer
          var header = riot.mount(document.getElementById('header-tag'));
          header[0].unmount(true);

          // Mount login page and change URL
          riot.mount('#mounted', 'login');
          riot.route('/security/login');
        }
      });
    }
  </script>
</button_logout>
