import { html } from '../core/config.js';
import { canvas } from '../core/renderer.js';
import { state } from '../core/state.js';
import { dirS } from '../scene/book.js';
import { closeCard, openCard } from './cards.js';
import { findClue } from './clues.js';
import { closeColo } from './colophon.js';
import { hop, pick, setHover } from './picking.js';

export function now() {
  return performance.now() / 1000;
}
function input(d) {
  if (!state.open || state.card || state.colo) return;
  state.target += d;
  state.lastInput = now();
  markTurned();
}
let turned = false;
export function markTurned() {
  if (!turned && Math.abs(state.target) > 0.3) {
    turned = true;
    html.classList.add('turned');
  }
}
addEventListener(
  'wheel',
  e => {
    if (state.colo) return;
    e.preventDefault();
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
    const d = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * k;
    input(Math.max(-0.5, Math.min(0.5, (d / 240) * 0.15)));
  },
  { passive: false }
);
canvas.addEventListener('pointerdown', e => {
  if (!state.open) return;
  state.drag = {
    x: e.clientX,
    y: e.clientY,
    x0: e.clientX,
    y0: e.clientY,
    t: now(),
    id: e.pointerId,
    type: e.pointerType,
  };
  state.vel = 0;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', e => {
  state.mx = e.clientX;
  state.my = e.clientY;
  state.moved = true;
  const d = state.drag;
  if (!d || d.id !== e.pointerId) return;
  const dx = e.clientX - d.x,
    dy = e.clientY - d.y;
  d.x = e.clientX;
  d.y = e.clientY;
  const k =
    d.type === 'touch'
      ? ((-dirS * dx) / innerWidth) * 1.5 - (dy / innerHeight) * 1.2
      : ((-dirS * dx) / innerWidth) * 1.7;
  input(k);
  state.vel = state.vel * 0.6 + k * 0.4;
});
function endDrag(e) {
  const d = state.drag;
  if (!d) return;
  state.drag = null;
  if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 7 && now() - d.t < 0.6) {
    clickAt(e.clientX, e.clientY);
    state.vel = 0;
  }
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave', () => {
  state.mx = -1;
  setHover(null);
});
addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCard();
    closeColo();
    return;
  }
  if (!state.open || state.card || state.colo) return;
  if ([dirS > 0 ? 'ArrowRight' : 'ArrowLeft', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
    e.preventDefault();
    state.target = Math.round(state.target) + 1;
    state.lastInput = now();
    markTurned();
  }
  if ([dirS > 0 ? 'ArrowLeft' : 'ArrowRight', 'ArrowUp', 'PageUp'].includes(e.key)) {
    e.preventDefault();
    state.target = Math.round(state.target) - 1;
    state.lastInput = now();
    markTurned();
  }
});
function clickAt(x, y) {
  const p = pick(x, y);
  if (!p) return;
  hop(p);
  if (p.userData.clue != null) findClue(p.userData.clue);
  if (p.userData.card) setTimeout(() => openCard(p), 160);
}
