// main.js, mobile nav, active link, scroll reveal
(function () {
  var toggle = document.querySelector('.menu');
  var mobileMenu = document.querySelector('.mobile-nav');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && href.split('#')[0].split('/').pop() === current) {
      a.setAttribute('aria-current', 'page');
    }
  });

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // A quiet reading indicator makes long case studies easier to navigate.
  var progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  var progressQueued = false;
  function updateReadingProgress() {
    var root = document.documentElement;
    var range = root.scrollHeight - window.innerHeight;
    var amount = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    progress.style.transform = 'scaleX(' + amount + ')';
    progressQueued = false;
  }
  function queueReadingProgress() {
    if (progressQueued) return;
    progressQueued = true;
    window.requestAnimationFrame(updateReadingProgress);
  }
  window.addEventListener('scroll', queueReadingProgress, { passive: true });
  window.addEventListener('resize', queueReadingProgress);
  updateReadingProgress();

  // The hero workflow is an explorable summary, not a live system monitor.
  var workflow = document.querySelector('[data-workflow]');
  if (workflow) {
    var flowTabs = Array.prototype.slice.call(workflow.querySelectorAll('[data-flow-step]'));
    var flowPanel = workflow.querySelector('#flow-panel');
    var flowLabel = workflow.querySelector('.flow-label');
    var flowDescription = workflow.querySelector('.flow-description');
    var flowDetails = {
      it: {
        label: 'IT OPERATIONS',
        text: "Managed the resort's IT environment, including networks, Wi-Fi and the HotelMaster property management system."
      },
      data: {
        label: 'DATA ANALYSIS',
        text: 'Built Power BI and Excel reports and a forecasting model to help managers plan demand, labor and purchasing.'
      },
      growth: {
        label: 'DIGITAL MARKETING & REVENUE',
        text: 'Helped restore the resort’s Booking.com account and restructure pricing; the portfolio reports a 13% revenue lift, growing to 20% of total revenue.'
      }
    };

    function selectFlowStep(tab, moveFocus) {
      var key = tab.getAttribute('data-flow-step');
      var detail = flowDetails[key];
      if (!detail) return;
      flowTabs.forEach(function (item) {
        var selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      flowPanel.setAttribute('aria-labelledby', tab.id);
      flowPanel.setAttribute('data-active-step', key);
      flowLabel.textContent = detail.label;
      flowDescription.textContent = detail.text;
      if (moveFocus) tab.focus();
    }

    flowTabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { selectFlowStep(tab, false); });
      tab.addEventListener('keydown', function (event) {
        var nextIndex = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % flowTabs.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + flowTabs.length) % flowTabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = flowTabs.length - 1;
        else return;
        event.preventDefault();
        selectFlowStep(flowTabs[nextIndex], true);
      });
    });
  }

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // project category filter (work.html)
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        projectCards.forEach(function (card) {
          var show = cat === 'all' || card.getAttribute('data-category').indexOf(cat) !== -1;
          card.hidden = !show;
        });
      });
    });
  }
})();
