// lightbox.js: click a project screenshot to open it full size. Without JS the link opens the image file.
(function () {
  var triggers = document.querySelectorAll('[data-lightbox]');
  if (!triggers.length || typeof HTMLDialogElement === 'undefined') return;

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Project screenshot');
  dialog.innerHTML = '<form method="dialog"><span></span><button type="submit">Close (Esc)</button></form><img alt="">';
  document.body.appendChild(dialog);
  var img = dialog.querySelector('img');
  var caption = dialog.querySelector('span');
  var lastTrigger = null;

  triggers.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      lastTrigger = a;
      var thumb = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      caption.textContent = a.getAttribute('data-caption') || '';
      dialog.showModal();
    });
  });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () { if (lastTrigger) lastTrigger.focus(); });
})();
