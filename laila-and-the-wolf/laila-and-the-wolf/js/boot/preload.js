(function () {
  var l = null;
  try {
    l = localStorage.getItem('lw-lang');
  } catch (e) {}
  if (location.hash === '#en' || location.hash === '#ar') l = location.hash.slice(1);
  if (l !== 'en') l = 'ar';
  var d = document.documentElement;
  d.lang = l;
  d.dir = l === 'ar' ? 'rtl' : 'ltr';
})();
(function () {
  function cv(w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }
  function seedR(s) {
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }
  var c = cv(256, 256),
    x = c.getContext('2d'),
    r = seedR(7),
    i;
  x.fillStyle = '#ebe1cc';
  x.fillRect(0, 0, 256, 256);
  for (i = 0; i < 5000; i++) {
    x.fillStyle = 'rgba(' + (r() < 0.5 ? '120,95,60' : '255,252,240') + ',' + r() * 0.09 + ')';
    x.fillRect(r() * 256, r() * 256, 1 + r() * 3, 1 + r() * 2);
  }
  x.lineWidth = 0.6;
  for (i = 0; i < 160; i++) {
    x.strokeStyle = 'rgba(110,85,50,' + r() * 0.12 + ')';
    x.beginPath();
    var a = r() * 256,
      b = r() * 256,
      t = r() * 6.28;
    x.moveTo(a, b);
    x.quadraticCurveTo(
      a + Math.cos(t) * 6 + r() * 4,
      b + Math.sin(t) * 6,
      a + Math.cos(t) * 12,
      b + Math.sin(t) * 12
    );
    x.stroke();
  }
  window.__RAG = c.toDataURL('image/png');
  var d = cv(128, 128),
    y = d.getContext('2d');
  r = seedR(3);
  y.fillStyle = '#1f3d2b';
  y.fillRect(0, 0, 128, 128);
  for (i = 0; i < 128; i += 2) {
    y.fillStyle = 'rgba(220,255,225,' + (0.03 + r() * 0.04) + ')';
    y.fillRect(0, i, 128, 1);
    y.fillStyle = 'rgba(0,0,0,' + (0.05 + r() * 0.06) + ')';
    y.fillRect(i, 0, 1, 128);
  }
  for (i = 0; i < 1400; i++) {
    y.fillStyle = 'rgba(' + (r() < 0.5 ? '0,0,0' : '210,240,215') + ',' + r() * 0.08 + ')';
    y.fillRect(r() * 128, r() * 128, 1, 1);
  }
  window.__CLOTH = d.toDataURL('image/png');
  var s = document.documentElement.style;
  s.setProperty('--rag', 'url(' + window.__RAG + ')');
  s.setProperty('--clothtex', 'url(' + window.__CLOTH + ')');
})();
