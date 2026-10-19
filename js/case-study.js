// case-study.js: reading progress bar and contents highlight on case-study pages.
(function () {
  var progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  var queued = false;
  function update() {
    var range = document.documentElement.scrollHeight - window.innerHeight;
    var amount = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    progress.style.transform = 'scaleX(' + amount + ')';
    queued = false;
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  update();

  var sections = document.querySelectorAll('.case-body section[id]');
  var links = document.querySelectorAll('.case-index a[href^="#"]');
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -60% 0px' });
  sections.forEach(function (s) { observer.observe(s); });
})();
