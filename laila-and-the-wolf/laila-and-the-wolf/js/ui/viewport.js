import { html } from '../core/config.js';
import { DPR, camera, renderer } from '../core/renderer.js';
import { win } from '../core/state.js';
import { drawFrame } from '../render/frame.js';
import { composer, grade, gtao } from '../render/post.js';

export function measureWin() {
  if (html.classList.contains('swing')) return;
  const r = document.querySelector('.board.l .ring').getBoundingClientRect();
  if (r.width) {
    win.wr = (r.width - 28) / 2;
    win.wy = (r.top + r.height / 2) / innerHeight;
  }
}
measureWin();
function resize() {
  measureWin();
  const w = innerWidth,
    h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  if (composer) {
    composer.setSize(w, h);
    grade.uniforms.uRes.value.set(w, h);
  }
  if (gtao) gtao.setSize(w * DPR, h * DPR);
  drawFrame();
}
addEventListener('resize', resize);
