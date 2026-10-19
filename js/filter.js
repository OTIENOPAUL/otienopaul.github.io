// filter.js: project filter with fade transitions. Works without reloads and supports
// deep links such as index.html#ml-ai, #bi-dashboards, #data-engineering, #commercial-strategy.
(function () {
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.project-grid .card'));
  var status = document.getElementById('filter-status');
  if (!buttons.length || !cards.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FADE_MS = 170;
  var active = 'all';
  var timer = null;

  function label(btn) { return btn.getAttribute('data-label') || btn.textContent.trim(); }

  function announce(key, count) {
    if (!status) return;
    var btn = buttons.filter(function (b) { return b.getAttribute('data-filter') === key; })[0];
    status.textContent = key === 'all'
      ? 'Showing all ' + count + ' projects'
      : 'Showing ' + count + ' ' + (count === 1 ? 'project' : 'projects') + ' in ' + label(btn);
  }

  function matches(card, key) { return key === 'all' || card.getAttribute('data-category') === key; }

  function apply(key, animate) {
    if (key === active && animate) return;
    active = key;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === key)); });
    clearTimeout(timer);

    var next = cards.filter(function (c) { return matches(c, key); });
    announce(key, next.length);

    if (!animate || reduced) {
      cards.forEach(function (c) { c.classList.remove('is-fading'); c.hidden = !matches(c, key); });
      return;
    }

    // Fade the visible cards out, swap visibility, then fade the new set in.
    cards.forEach(function (c) { if (!c.hidden) c.classList.add('is-fading'); });
    timer = setTimeout(function () {
      cards.forEach(function (c) {
        var show = matches(c, key);
        c.hidden = !show;
        if (show) c.classList.add('is-fading');
      });
      // Force a reflow so the fade-in starts from the faded state.
      void document.body.offsetHeight;
      requestAnimationFrame(function () {
        cards.forEach(function (c) { c.classList.remove('is-fading'); });
      });
    }, FADE_MS);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      apply(btn.getAttribute('data-filter'), true);
      if (history.replaceState) {
        var key = btn.getAttribute('data-filter');
        history.replaceState(null, '', key === 'all' ? '#projects' : '#' + key);
      }
    });
  });

  function fromHash(animate) {
    var key = location.hash.slice(1);
    var known = buttons.some(function (b) { return b.getAttribute('data-filter') === key; });
    if (known && key !== 'all') {
      apply(key, animate);
      var section = document.getElementById('projects');
      if (section) section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  window.addEventListener('hashchange', function () { fromHash(true); });
  fromHash(false);
})();
