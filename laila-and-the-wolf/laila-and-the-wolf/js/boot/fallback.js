(function () {
  var d = document.documentElement;
  function gl() {
    try {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) {
      return false;
    }
  }
  window.__fwFail = function (why) {
    if (d.classList.contains('nogl')) return;
    d.classList.add('nogl', 'ready');
    console.warn('fallback:', why);
    var p = document.querySelectorAll('.pct');
    for (var i = 0; i < p.length; i++)
      p[i].textContent = window.__T ? window.__T[d.lang === 'en' ? 'en' : 'ar'].ready : 'READY';
    var t = document.querySelectorAll('.pop i');
    for (i = 0; i < t.length; i++) t[i].classList.add('up');
  };
  if (!gl()) window.__fwFail('no webgl');
  setTimeout(function () {
    if (!window.__ready) window.__fwFail(window.__booted ? 'assets slow' : 'module did not boot');
  }, 15000);
  function open() {
    if (d.classList.contains('opening')) return;
    if (window.__fwOpen) {
      window.__fwOpen();
      return;
    }
    d.classList.add('opening');
    setTimeout(function () {
      d.classList.add('swing');
    }, 420);
    setTimeout(function () {
      d.classList.add('open');
    }, 1900);
  }
  function ng() {
    return d.classList.contains('nogl');
  }
  var co = document.getElementById('colophon');
  function coOpen() {
    d.classList.add('colo');
    co.setAttribute('aria-hidden', 'false');
    document.getElementById('colox').focus({ preventScroll: true });
  }
  function coClose() {
    if (!d.classList.contains('colo')) return;
    d.classList.remove('colo');
    co.setAttribute('aria-hidden', 'true');
    document.getElementById('colo').focus({ preventScroll: true });
  }
  document.getElementById('colo').addEventListener('click', function () {
    if (ng()) coOpen();
  });
  document.getElementById('colox').addEventListener('click', function () {
    if (ng()) coClose();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ng()) coClose();
  });
  document.getElementById('cocred').addEventListener('click', function () {
    if (ng()) {
      open();
      setTimeout(coOpen, 1950);
    }
  });
  document.getElementById('open').addEventListener('click', open);
  document.getElementById('bow').addEventListener('click', function () {
    if (d.classList.contains('ready')) open();
  });
})();
