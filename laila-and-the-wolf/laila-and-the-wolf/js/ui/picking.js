import * as THREE from 'three';
import { UIT } from '../content/texts.js';
import { LANG, tr } from '../core/config.js';
import { springs } from '../core/registry.js';
import { camera, canvas } from '../core/renderer.js';
import { state } from '../core/state.js';
import { book } from '../scene/book.js';

const ray = new THREE.Raycaster(),
  ndc = new THREE.Vector2();
export const tip = document.getElementById('tip');
export function pick(x, y) {
  ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  for (const h of ray.intersectObject(book, true)) {
    if (!h.object.isMesh) continue;
    return h.object.userData.pivot || null;
  }
  return null;
}
export function setHover(p) {
  if (p === state.hover) return;
  state.hover = p;
  canvas.style.cursor = p ? 'pointer' : state.drag ? 'grabbing' : 'grab';
  if (p) {
    kick(p, 7);
    tip.innerHTML = tr(p.userData.label) + (p.userData.card ? '<i>' + UIT[LANG].hoverOpen + '</i>' : '');
    tip.classList.add('on');
  } else tip.classList.remove('on');
}
function kick(p, v) {
  const s = p.userData.s;
  s.v += v * (Math.random() < 0.5 ? -1 : 1);
  if (!springs.includes(p)) springs.push(p);
}
export function hop(p) {
  p.userData.s.vy += 2.2;
  kick(p, 9);
}
