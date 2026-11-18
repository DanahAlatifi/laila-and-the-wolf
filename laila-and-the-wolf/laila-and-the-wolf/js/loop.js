import * as THREE from 'three';
import { D2R, PHONE, PORTRAIT } from './core/config.js';
import { tickPct } from './core/loading.js';
import { anims, hangers, springs, swayers } from './core/registry.js';
import { CAM, ZOOMS, camera, scene } from './core/renderer.js';
import { state, win, zoom } from './core/state.js';
import { composer, grade } from './render/post.js';
import { book, dirS } from './scene/book.js';
import { updateChrome } from './ui/chapters-nav.js';
import { now } from './ui/controls.js';
import { pick, setHover, tip } from './ui/picking.js';

const look = new THREE.Vector3(),
  tmp = new THREE.Vector3();
let lastT = now(),
  prevCur = 0,
  angVel = 0;
export function frameLoop() {
  const t = now(),
    dt = Math.min(0.05, t - lastT);
  lastT = t;
  tickPct();
  if (!state.drag && Math.abs(state.vel) > 1e-4) {
    state.target += state.vel;
    state.vel *= 0.9;
  }
  if (!state.drag && t - state.lastInput > 0.9 && Math.abs(state.vel) < 0.002) {
    if (state.snap == null) {
      const dl = state.target - state.rest;
      state.snap =
        Math.abs(dl) < 0.035
          ? state.rest
          : state.rest + Math.sign(dl) * Math.max(1, Math.round(Math.abs(dl)));
      state.rest = state.snap;
    }
    state.target += (state.snap - state.target) * (1 - Math.exp(-dt * 3.2));
  } else state.snap = null;
  state.cur += (state.target - state.cur) * (1 - Math.exp(-dt * 4.6));
  let ip = 1;
  if (state.introT > 0) ip = Math.min(1, Math.max(0, (t - state.introT) / 2.4));
  else if (!state.open) ip = 0;
  const ie = ip < 0.5 ? 4 * ip * ip * ip : 1 - Math.pow(-2 * ip + 2, 3) / 2;
  const sway = 0.55 + 0.32 * Math.sin(t * 0.32);
  book.rotation.y = -dirS * (state.cur - sway * (1 - ie)) * 60 * D2R;
  const w = (state.cur - prevCur) / Math.max(dt, 1e-3);
  const acc = (w - angVel) / Math.max(dt, 1e-3);
  angVel = w;
  prevCur = state.cur;
  zoom.f += (ZOOMS[zoom.i] - zoom.f) * (1 - Math.exp(-dt * 5));
  const par = state.mx >= 0 && !PHONE ? [state.mx / innerWidth - 0.5, state.my / innerHeight - 0.5] : [0, 0];
  state.px += (par[0] - state.px) * (1 - Math.exp(-dt * 3));
  state.py += (par[1] - state.py) * (1 - Math.exp(-dt * 3));
  const W = innerWidth,
    Hh = innerHeight,
    { wr, wy } = win;
  const vw = (7.6 * W) / (1.75 * wr),
    vh = vw / (W / Hh),
    dPre = 22;
  const fovPre = (2 * Math.atan(vh / (2 * dPre))) / D2R;
  look.copy(CAM.look);
  look.y -= (1 - zoom.f) * 0.35 * ie;
  tmp
    .set(0, Math.sin(18 * D2R), Math.cos(18 * D2R))
    .multiplyScalar(dPre)
    .add(CAM.look);
  camera.position.lerpVectors(tmp, CAM.pos, ie);
  camera.position.x += state.px * 0.35 * ie;
  camera.position.y -= state.py * 0.18 * ie;
  const baseFov =
    PHONE && PORTRAIT
      ? CAM.fov
      : Math.min(62, (2 * Math.atan(Math.tan((CAM.fov * D2R) / 2) * Math.max(1, 1.6 / (W / Hh)))) / D2R);
  camera.fov = THREE.MathUtils.lerp(fovPre, baseFov * zoom.f, ie);
  if (ie < 1) camera.setViewOffset(W, Hh, 0, (0.5 - wy) * Hh * (1 - ie), W, Hh);
  else if (camera.view) camera.clearViewOffset();
  camera.updateProjectionMatrix();
  camera.lookAt(look);
  scene.fog.near = 13 + (1 - ie) * 15;
  scene.fog.far = 30 + (1 - ie) * 15;
  for (const h of hangers) {
    h.v += (-26 * h.a - 2.2 * h.v + (acc * 0.012 * h.r) / h.len) * dt;
    h.a += h.v * dt;
    h.piv.rotation.x = Math.max(-0.6, Math.min(0.6, h.a)) + Math.sin(t * 0.9 + h.ph) * 0.02;
    h.piv.rotation.z = Math.sin(t * 0.7 + h.ph * 1.3) * 0.025;
  }
  for (let i = springs.length - 1; i >= 0; i--) {
    const p = springs[i],
      s = p.userData.s,
      ch = p.children[0];
    s.v += (-160 * s.a - 9 * s.v) * dt;
    s.a += s.v * dt;
    s.vy += (-120 * s.y - 10 * s.vy) * dt;
    s.y += s.vy * dt;
    p.rotation.z = s.a * 0.09 + (p.userData.sa ? Math.sin(t * 1.1 + p.userData.sw) * p.userData.sa : 0);
    ch.scale.y = p.userData.h * (1 + s.a * 0.015 - Math.max(0, -s.y) * 0.4);
    ch.position.y = Math.max(0, s.y) * 0.18;
    if (Math.abs(s.a) + Math.abs(s.v) + Math.abs(s.y) + Math.abs(s.vy) < 1e-3) {
      s.a = s.v = s.y = s.vy = 0;
      p.rotation.z = 0;
      ch.scale.y = p.userData.h;
      ch.position.y = 0;
      springs.splice(i, 1);
    }
  }
  for (const p of swayers)
    if (!springs.includes(p)) {
      p.rotation.z = Math.sin(t * 1.1 + p.userData.sw) * p.userData.sa;
    }
  for (const f of anims) f(t, dt);
  if (Math.abs(state.target - state.cur) > 0.002 || springs.length) state.moved = true;
  if (state.open && !PHONE && state.moved && !state.drag && !state.card && !state.colo) {
    state.moved = false;
    setHover(state.mx >= 0 ? pick(state.mx, state.my) : null);
  }
  if (state.hover) {
    tip.style.left = state.mx + 'px';
    tip.style.top = state.my + 'px';
  }
  updateChrome();
  grade.uniforms.uTime.value = t;
  composer.render(dt);
  requestAnimationFrame(frameLoop);
}
