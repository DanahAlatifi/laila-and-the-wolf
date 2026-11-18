import { html } from '../core/config.js';
import { canvas } from '../core/renderer.js';
import { state } from '../core/state.js';
import { openColo } from './colophon.js';
import { now } from './controls.js';

window.__fwOpen = function () {
  if (html.classList.contains('opening')) return;
  html.classList.add('opening');
  setTimeout(() => html.classList.add('swing'), 420);
  state.introT = now() + 0.35;
  setTimeout(() => {
    html.classList.add('open');
    state.open = true;
    canvas.focus({ preventScroll: true });
    if (state.wantColo) openColo();
  }, 1900);
};
