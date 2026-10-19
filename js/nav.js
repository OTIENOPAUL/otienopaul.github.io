// nav.js: mobile menu, current-page link, footer year.
(function () {
  var toggle = document.querySelector('.menu');
  var panel = document.querySelector('.mobile-nav');

  function setOpen(open) {
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setOpen(false);
    });
  }

  // Mark the link for the page being viewed (home-page anchors are left alone).
  var current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.indexOf('#') === -1 && href.split('/').pop() === current) a.setAttribute('aria-current', 'page');
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
