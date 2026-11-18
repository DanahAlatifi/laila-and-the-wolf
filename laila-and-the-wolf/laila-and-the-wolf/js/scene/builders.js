import * as THREE from 'three';
import { D2R, FLOOR, PHONE, PORTRAIT, R, TAN, TAU } from '../core/config.js';
import { anims, hangers } from '../core/registry.js';
import { cloudShape, ext, profileShape } from '../paper/geometry.js';
import { edgeOf, paper, sparkMat, worldUV } from '../paper/materials.js';
import { glowTex, grain } from '../paper/textures.js';

export function at(obj, x, z, y = FLOOR, ry = 0) {
  obj.position.set(x, y, z);
  obj.rotation.y = ry * D2R;
  return obj;
}
export function onWall(obj, side, s, y, off = 0.025, tilt = 0) {
  const dir = new THREE.Vector2(side * Math.sin(30 * D2R), Math.cos(30 * D2R));
  const nrm = new THREE.Vector2(-side * Math.cos(30 * D2R), Math.sin(30 * D2R));
  obj.position.set(dir.x * s + nrm.x * off, y, dir.y * s + nrm.y * off);
  obj.rotation.y = Math.atan2(nrm.x, nrm.y) + tilt * D2R;
  return obj;
}
export function layer(bay, z, hex, fn, { y0 = FLOOR, n = 72, holes = [], d = 0.022, inset = 0.004 } = {}) {
  const hw = z * TAN - inset;
  const s = profileShape(hw, (x, t) => fn(x, t, hw), n, y0);
  for (const h of holes) s.holes.push(h);
  const m = ext(s, d, hex);
  m.position.z = z;
  bay.add(m);
  return m;
}
export function thread(bay, z, y, sag = 0.12, inset = 0.03) {
  const hw = z * TAN - inset;
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24,
      x = -hw + 2 * hw * t;
    pts.push(new THREE.Vector3(x, y - sag * 4 * t * (1 - t), z));
  }
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.0065, 5), sparkMat);
  m.castShadow = true;
  bay.add(m);
  return {
    at: x => new THREE.Vector3(x, y - sag * 4 * ((x + hw) / (2 * hw)) * (1 - (x + hw) / (2 * hw)), z),
    hw,
  };
}
export function hang(bay, th, x, obj, drop = 0.0, opts = {}) {
  const piv = new THREE.Group();
  piv.position.copy(th.at(x));
  bay.add(piv);
  obj.position.y -= drop;
  piv.add(obj);
  if (drop > 0.02 && !opts.nostring) {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, drop, 4), sparkMat);
    s.position.y = -drop / 2;
    piv.add(s);
  }
  hangers.push({
    piv,
    a: 0,
    v: 0,
    ph: Math.random() * 6,
    r: th.at(x).z,
    len: Math.max(0.2, drop + (opts.len || 0.3)),
  });
  return piv;
}
export function bunting(bay, th, colors, step = 0.2, skip = []) {
  const tri = new THREE.Shape();
  tri.moveTo(-0.075, 0);
  tri.lineTo(0.075, 0);
  tri.lineTo(0, -0.15);
  tri.closePath();
  let i = 0;
  for (let x = -th.hw + 0.12; x < th.hw - 0.08; x += step) {
    if (skip.some(([a, b]) => x > a && x < b)) continue;
    const m = ext(tri, 0.008, colors[i++ % colors.length]);
    hang(bay, th, x, m, 0.0, { nostring: true, len: 0.1 });
  }
}
export function floorSector(bay, hex, map) {
  const s = new THREE.Shape();
  s.moveTo(0, 0.02);
  for (let i = 0; i <= 24; i++) {
    const a = (-30 + (60 * i) / 24) * D2R;
    s.lineTo(Math.sin(a) * (R + 0.01), Math.cos(a) * (R + 0.01));
  }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: FLOOR, bevelEnabled: false, curveSegments: 4 });
  g.rotateX(Math.PI / 2);
  g.translate(0, FLOOR, 0);
  worldUV(g, 0.5);
  let mat = paper(hex, { ns: 0.4 });
  if (map) {
    mat = mat.clone();
    mat.map = map;
    mat.color = new THREE.Color(1, 1, 1);
  }
  const m = new THREE.Mesh(g, [mat, edgeOf(hex)]);
  m.receiveShadow = true;
  bay.add(m);
  return m;
}
export const SX = c => (PORTRAIT ? 0 : c.sx);
export const skipSign = c => [[SX(c) - 0.75, SX(c) + 0.75]];
export function glowLamp(parent, x, y, z, color = '#ffc46b', I = 2.2, dist = 2.6) {
  const lamp = new THREE.PointLight(color, PHONE ? I * 0.64 : I, dist, 1.6);
  lamp.position.set(x, y, z + 0.06);
  parent.add(lamp);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex(),
      color: '#ffcf7a',
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    })
  );
  glow.scale.set(0.5, 0.5, 1);
  glow.position.set(x, y, z + 0.04);
  parent.add(glow);
  const base = lamp.intensity,
    ph = Math.random() * 6;
  anims.push(t => {
    const f = 0.85 + Math.sin(t * 7 + ph) * 0.05 + Math.sin(t * 13.3 + ph) * 0.04;
    lamp.intensity = base * f;
    glow.material.opacity = 0.7 * f;
  });
  return lamp;
}
const tri = t => 1 - 2 * Math.abs(t - Math.floor(t) - 0.5);
export const treeLine =
  (base, amp, f = 3.5, ph = 0) =>
  x =>
    base + amp * tri(x * f + ph) + 0.06 * Math.sin(x * 7 + ph);
export function planks(x, w, h, col) {
  x.fillStyle = col;
  x.fillRect(0, 0, w, h);
  for (let i = 0; i < 8; i++) {
    x.fillStyle = `rgba(${i % 2 ? '255,230,200' : '40,20,10'},${0.05 + (i % 3) * 0.02})`;
    x.fillRect(i * 64, 0, 64, h);
    x.fillStyle = 'rgba(30,15,5,.35)';
    x.fillRect(i * 64, 0, 2, h);
    for (let k = 0; k < 3; k++) x.fillRect(i * 64, (i * 97 + k * 173) % h, 64, 2);
  }
  grain(x, w, h, 16);
}
export function flatOn(b, obj, x, z, rz = 0, y = FLOOR + 0.008) {
  obj.position.set(x, y, z);
  obj.rotation.x = -Math.PI / 2;
  obj.rotation.z = rz;
  b.add(obj);
  return obj;
}
export function sunOn(b, side, s, y, r, col) {
  const m = ext(
    (() => {
      const sh = new THREE.Shape();
      sh.absarc(0, 0, r, 0, TAU, false);
      return sh;
    })(),
    0.02,
    col
  );
  onWall(m, side, s, y, 0.03);
  b.add(m);
}
export function cloudsOn(b, list, col = '#eee6d6') {
  list.forEach(([sd, s, y, w, seed]) => {
    const m = ext(cloudShape(w, w * 0.45, seed), 0.03, col);
    onWall(m, sd, s, y, 0.05);
    b.add(m);
  });
}
