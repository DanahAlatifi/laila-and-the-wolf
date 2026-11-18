window.__booted = true;

if (!document.documentElement.classList.contains('nogl')) {
  import('./app.js').catch(e => window.__fwFail && window.__fwFail('module: ' + e.message));
}
