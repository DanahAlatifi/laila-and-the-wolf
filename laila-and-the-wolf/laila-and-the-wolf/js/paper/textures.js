import * as THREE from 'three';
import { TAU } from '../core/config.js';
import { MAXANI } from '../core/renderer.js';

export function rnd(seed) {
  let s = seed * 9301 + 49297;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}
export function cvs(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}
function texFrom(cv, { srgb = true, rep = 1 } = {}) {
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rep, rep);
  t.anisotropy = Math.min(8, MAXANI);
  return t;
}
function fibreCanvas(seed, n = 512) {
  const c = cvs(n, n),
    x = c.getContext('2d'),
    r = rnd(seed);
  x.fillStyle = '#f4f2ee';
  x.fillRect(0, 0, n, n);
  for (let i = 0; i < n * 30; i++) {
    x.fillStyle = `rgba(${r() < 0.5 ? '90,80,70' : '255,255,255'},${r() * 0.07})`;
    x.fillRect(r() * n, r() * n, 1 + r() * 3, 1 + r() * 2);
  }
  x.lineWidth = 0.7;
  for (let i = 0; i < n * 0.8; i++) {
    x.strokeStyle = `rgba(100,85,70,${r() * 0.12})`;
    const a = r() * n,
      b = r() * n,
      t = r() * 6.28,
      L = 6 + r() * 16;
    x.beginPath();
    x.moveTo(a, b);
    x.quadraticCurveTo(
      a + (Math.cos(t + 0.5) * L) / 2,
      b + (Math.sin(t + 0.5) * L) / 2,
      a + Math.cos(t) * L,
      b + Math.sin(t) * L
    );
    x.stroke();
  }
  return c;
}
function normalCanvas(seed, n = 256, strength = 2.2) {
  const r = rnd(seed),
    h = new Float32Array(n * n);
  for (const [cell, amp] of [
    [32, 1],
    [16, 0.6],
    [8, 0.4],
    [4, 0.25],
    [2, 0.12],
  ]) {
    const g = n / cell,
      gr = [];
    for (let i = 0; i < (g + 1) * (g + 1); i++) gr.push(r());
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        const gx = x / cell,
          gy = y / cell,
          x0 = Math.floor(gx),
          y0 = Math.floor(gy),
          fx = gx - x0,
          fy = gy - y0;
        const s = t => t * t * (3 - 2 * t),
          G = (a, b) => gr[(b % g) * (g + 1) + (a % g)];
        const v =
          G(x0, y0) * (1 - s(fx)) * (1 - s(fy)) +
          G(x0 + 1, y0) * s(fx) * (1 - s(fy)) +
          G(x0, y0 + 1) * (1 - s(fx)) * s(fy) +
          G(x0 + 1, y0 + 1) * s(fx) * s(fy);
        h[y * n + x] += v * amp;
      }
  }
  const c = cvs(n, n),
    x = c.getContext('2d'),
    im = x.createImageData(n, n);
  for (let y = 0; y < n; y++)
    for (let X = 0; X < n; X++) {
      const dx = (h[y * n + ((X + 1) % n)] - h[y * n + ((X - 1 + n) % n)]) * strength,
        dy = (h[((y + 1) % n) * n + X] - h[((y - 1 + n) % n) * n + X]) * strength;
      const l = Math.hypot(dx, dy, 1),
        i = (y * n + X) * 4;
      im.data[i] = ((-dx / l) * 0.5 + 0.5) * 255;
      im.data[i + 1] = ((dy / l) * 0.5 + 0.5) * 255;
      im.data[i + 2] = ((1 / l) * 0.5 + 0.5) * 255;
      im.data[i + 3] = 255;
    }
  x.putImageData(im, 0, 0);
  return c;
}
function woodCanvas() {
  const n = 1024,
    c = cvs(n, n),
    x = c.getContext('2d'),
    r = rnd(21);
  x.fillStyle = '#dcc6a2';
  x.fillRect(0, 0, n, n);
  for (let p = 0; p < n; p += 128) {
    x.fillStyle = `rgba(120,80,40,${0.03 + r() * 0.05})`;
    x.fillRect(p, 0, 1 + r() * 2, n);
  }
  for (let i = 0; i < 420; i++) {
    const y0 = r() * n,
      a = 2 + r() * 6,
      f = 0.004 + r() * 0.01,
      ph = r() * 6;
    x.strokeStyle = `rgba(${110 + r() * 40},${70 + r() * 30},${30},${0.04 + r() * 0.1})`;
    x.lineWidth = 0.6 + r() * 1.6;
    x.beginPath();
    for (let X = 0; X <= n; X += 8) {
      const Y = y0 + Math.sin(X * f + ph) * a;
      X ? x.lineTo(X, Y) : x.moveTo(X, Y);
    }
    x.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const cx = r() * n,
      cy = r() * n;
    for (let k = 1; k < 7; k++) {
      x.strokeStyle = `rgba(110,70,35,${0.12 - k * 0.012})`;
      x.beginPath();
      x.ellipse(cx, cy, k * 7, k * 2.5, 0, 0, TAU);
      x.stroke();
    }
  }
  return c;
}
export let detailTex, normalTex, ragNormal, woodTex, atlasNormal;
export function buildTextures() {
  detailTex = texFrom(fibreCanvas(3), { srgb: false });
  normalTex = texFrom(normalCanvas(5, 256, 2.4), { srgb: false });
  ragNormal = texFrom(normalCanvas(9, 256, 3.5), { srgb: false });
  woodTex = texFrom(woodCanvas(), { rep: 5 });
  atlasNormal = normalTex.clone();
  atlasNormal.repeat.set(4, 4);
  atlasNormal.needsUpdate = true;
}
export function canvasTex(w, h, draw, rep = 1) {
  const cv = cvs(w, h);
  draw(cv.getContext('2d'), w, h);
  return texFrom(cv, { rep });
}
export function grain(x, w, h, amt = 18, n = 9000) {
  for (let i = 0; i < n; i++) {
    x.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${(Math.random() * amt) / 255})`;
    x.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
}
let _glow;
export function glowTex() {
  if (_glow) return _glow;
  const cv = cvs(64, 64),
    x = cv.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,240,200,.6)');
  g.addColorStop(1, 'rgba(255,220,150,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  _glow = new THREE.CanvasTexture(cv);
  return _glow;
}
