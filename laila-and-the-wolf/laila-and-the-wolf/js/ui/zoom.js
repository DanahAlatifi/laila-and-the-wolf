import { zoom } from '../core/state.js';

const lv = [...document.querySelectorAll('#zoom .lv i')];
export function setZoom(i) {
  zoom.i = Math.max(0, Math.min(2, i));
  lv.forEach((e, j) => e.classList.toggle('on', j === zoom.i));
}
document.getElementById('zin').onclick = () => setZoom(zoom.i + 1);
document.getElementById('zout').onclick = () => setZoom(zoom.i - 1);
