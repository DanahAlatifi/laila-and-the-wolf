import * as THREE from 'three';
import { TAU } from '../core/config.js';
import { edgeOf, paper, worldUV } from './materials.js';
import { rnd } from './textures.js';

export function ext(shape, depth, hex, { edge, center = true, ns } = {}) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 20 });
  if (center) g.translate(0, 0, -depth / 2);
  worldUV(g);
  const m = new THREE.Mesh(g, [
    paper(hex, ns != null ? { ns } : {}),
    edge ? paper(edge, { ns: 0.2 }) : edgeOf(hex),
  ]);
  m.castShadow = m.receiveShadow = true;
  return m;
}
export function box(w, h, d, hex, edge) {
  const g = worldUV(new THREE.BoxGeometry(w, h, d));
  const f = paper(hex),
    e = edge ? paper(edge, { ns: 0.2 }) : edgeOf(hex);
  const m = new THREE.Mesh(g, [e, e, f, f, f, f]);
  m.castShadow = m.receiveShadow = true;
  return m;
}
export function profileShape(hw, fn, n = 64, y0 = 0) {
  const s = new THREE.Shape();
  s.moveTo(-hw, y0);
  for (let i = 0; i <= n; i++) {
    const x = -hw + (2 * hw * i) / n;
    s.lineTo(x, fn(x, i / n));
  }
  s.lineTo(hw, y0);
  s.closePath();
  return s;
}
export function cloudShape(w, h, seed = 1) {
  const r = rnd(seed);
  const cs = [];
  const k = 4 + Math.floor(r() * 2);
  for (let i = 0; i < k; i++) {
    const t = (i + 0.5) / k;
    cs.push([
      (t - 0.5) * w * 0.8,
      h * (0.25 + 0.5 * Math.sin(t * Math.PI) * (0.7 + r() * 0.5)),
      h * (0.35 + r() * 0.25),
    ]);
  }
  return profileShape(
    w / 2,
    x => {
      let m = 0;
      for (const [cx, cy, cr] of cs) {
        const d = cr * cr - (x - cx) ** 2;
        if (d > 0) m = Math.max(m, cy + Math.sqrt(d) * 0.75);
      }
      return Math.max(0.02, m);
    },
    56
  );
}
export function starShape(ro, ri = ro * 0.45, k = 5) {
  const s = new THREE.Shape();
  for (let i = 0; i < 2 * k; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / k,
      r = i % 2 ? ri : ro;
    const x = Math.cos(a) * r,
      y = Math.sin(a) * r;
    i ? s.lineTo(x, y) : s.moveTo(x, y);
  }
  s.closePath();
  return s;
}
export function ellipseShape(rx, ry) {
  const s = new THREE.Shape();
  s.absellipse(0, 0, rx, ry, 0, TAU, false, 0);
  return s;
}
export function archHole(x0, x1, y0, y1) {
  const p = new THREE.Path(),
    r = (x1 - x0) / 2;
  p.moveTo(x0, y0);
  p.lineTo(x1, y0);
  p.lineTo(x1, y1 - r);
  p.absarc((x0 + x1) / 2, y1 - r, r, 0, Math.PI, false);
  p.lineTo(x0, y0);
  return p;
}
