import * as THREE from 'three';
import { D2R, TAU } from '../core/config.js';

export const C = (c, x, y, r) => ['c', c, x, y, r];
export const E = (c, x, y, rx, ry, rot = 0) => ['e', c, x, y, rx, ry, rot];
export const Rr = (c, x, y, w, h, rad = 0) => ['r', c, x, y, w, h, rad];
export const P = (c, ...pts) => ['p', c, pts];
export const Sg = (c, x, y, r, a0, a1) => ['s', c, x, y, r, a0, a1];
export function L(c, x1, y1, x2, y2, w) {
  const dx = x2 - x1,
    dy = y2 - y1,
    l = Math.hypot(dx, dy) || 1,
    nx = ((-dy / l) * w) / 2,
    ny = ((dx / l) * w) / 2;
  return P(c, x1 + nx, y1 + ny, x2 + nx, y2 + ny, x2 - nx, y2 - ny, x1 - nx, y1 - ny);
}
export function crescent(c, x, y, r, dk = 0.48) {
  const d = r * dk,
    yy = Math.sqrt(r * r - (d * d) / 4),
    th = Math.atan2(yy, d / 2),
    be = Math.atan2(yy, d / 2),
    pts = [];
  for (let i = 0; i <= 28; i++) {
    const t = th + ((TAU - 2 * th) * i) / 28;
    pts.push(x + Math.cos(t) * r, y + Math.sin(t) * r);
  }
  for (let i = 0; i <= 28; i++) {
    const t = Math.PI + be - (2 * be * i) / 28;
    pts.push(x + d + Math.cos(t) * r, y + Math.sin(t) * r);
  }
  return P(c, ...pts);
}
export const tint = (hex, f) =>
  '#' + new THREE.Color(hex).lerp(new THREE.Color(f > 0 ? '#ffffff' : '#000000'), Math.abs(f)).getHexString();
export function partShape(p) {
  const [t, , ...a] = p,
    s = new THREE.Shape();
  if (t === 'c') s.absarc(a[0], a[1], a[2], 0, TAU, false);
  else if (t === 'e') s.absellipse(a[0], a[1], a[2], a[3], 0, TAU, false, (a[4] || 0) * D2R);
  else if (t === 'r') {
    const [x, y, w, h, rr = 0] = a,
      x0 = x - w / 2,
      y0 = y - h / 2,
      r = Math.min(rr, w / 2, h / 2);
    if (r > 0) {
      s.moveTo(x0 + r, y0);
      s.lineTo(x0 + w - r, y0);
      s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
      s.lineTo(x0 + w, y0 + h - r);
      s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
      s.lineTo(x0 + r, y0 + h);
      s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
      s.lineTo(x0, y0 + r);
      s.quadraticCurveTo(x0, y0, x0 + r, y0);
    } else {
      s.moveTo(x0, y0);
      s.lineTo(x0 + w, y0);
      s.lineTo(x0 + w, y0 + h);
      s.lineTo(x0, y0 + h);
    }
  } else if (t === 'p') {
    const q = a[0];
    s.moveTo(q[0], q[1]);
    for (let i = 2; i < q.length; i += 2) s.lineTo(q[i], q[i + 1]);
  } else if (t === 's') {
    s.absarc(a[0], a[1], a[2], a[3] * D2R, a[4] * D2R, false);
  } else if (t === 'a') {
    s.moveTo(a[0], a[1]);
    s.absarc(a[0], a[1], a[2], a[3] * D2R, a[4] * D2R, false);
  }
  s.closePath();
  return s;
}
export function drawParts(x, parts) {
  for (const p of parts) {
    const [t, c, ...a] = p;
    x.fillStyle = c;
    x.beginPath();
    if (t === 'c') x.arc(a[0], a[1], a[2], 0, TAU);
    else if (t === 'e') x.ellipse(a[0], a[1], a[2], a[3], (a[4] || 0) * D2R, 0, TAU);
    else if (t === 'r') {
      const [cx, cy, w, h, rr = 0] = a;
      x.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2));
    } else if (t === 'p') {
      const q = a[0];
      x.moveTo(q[0], q[1]);
      for (let i = 2; i < q.length; i += 2) x.lineTo(q[i], q[i + 1]);
      x.closePath();
    } else if (t === 's') {
      x.arc(a[0], a[1], a[2], a[3] * D2R, a[4] * D2R);
      x.closePath();
    } else if (t === 'a') {
      x.moveTo(a[0], a[1]);
      x.arc(a[0], a[1], a[2], a[3] * D2R, a[4] * D2R);
      x.closePath();
    }
    x.fill();
  }
}
