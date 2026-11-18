import { html } from '../core/config.js';
import { state } from '../core/state.js';
import { setHover } from './picking.js';

const coloEl = document.getElementById('colophon');
export function openColo() {
  html.classList.add('colo');
  state.colo = true;
  setHover(null);
  placeCorners();
  coloEl.setAttribute('aria-hidden', 'false');
  document.getElementById('colox').focus({ preventScroll: true });
}
export function closeColo() {
  if (!state.colo) return;
  html.classList.remove('colo');
  state.colo = false;
  coloEl.setAttribute('aria-hidden', 'true');
  document.getElementById('colo').focus({ preventScroll: true });
}
document.getElementById('colo').addEventListener('click', openColo);
document.getElementById('colox').addEventListener('click', closeColo);
document.getElementById('cocred').addEventListener('click', () => {
  if (!state.open) {
    state.wantColo = true;
    window.__fwOpen();
  }
});
const stageEl = document.getElementById('stage');
function placeNow() {
  const r = stageEl.getBoundingClientRect();
  const cs = [
    ['pc1', r.left - 6, r.top - 6, 0],
    ['pc2', r.right - 54, r.top - 6, 90],
    ['pc3', r.right - 54, r.bottom - 54, 180],
    ['pc4', r.left - 6, r.bottom - 54, 270],
  ];
  for (const [id, x, y, rot] of cs)
    Object.assign(document.getElementById(id).style, {
      left: x + 'px',
      top: y + 'px',
      clipPath: 'polygon(0 0,100% 0,0 100%)',
      transform: `rotate(${rot}deg)`,
    });
}
function placeCorners() {
  requestAnimationFrame(() => setTimeout(placeNow, 950));
}
stageEl.addEventListener('transitionend', e => {
  if (e.target === stageEl && e.propertyName === 'transform' && state.colo) placeNow();
});
addEventListener('resize', () => {
  if (state.colo) setTimeout(placeNow, 50);
});
