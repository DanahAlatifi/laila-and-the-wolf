import * as THREE from 'three';
import { CH } from '../content/chapters.js';
import { UIT } from '../content/texts.js';
import { GOLD, LANG, PHONE, PORTRAIT, R, SPARK, SPARKD, TAU } from '../core/config.js';
import { MAXANI } from '../core/renderer.js';
import { paper, sparkMat } from '../paper/materials.js';
import { cvs, rnd } from '../paper/textures.js';

const nolig = t => (LANG === 'en' ? t.replace(/f([ilf])/g, 'f‌$1') : t);
function drawRich(x, line, start, y, rtl) {
  let cx = start;
  line.split(/(\*[^*]+\*)/).forEach(seg => {
    if (!seg) return;
    const hl = seg.startsWith('*'),
      s = nolig(hl ? seg.slice(1, -1) : seg);
    x.fillStyle = hl ? SPARKD : '#2a2420';
    x.fillText(s, cx, y);
    cx += (rtl ? -1 : 1) * x.measureText(s).width;
  });
}
function pixelTex(cv, old) {
  let data = null;
  try {
    const w = cv.width,
      h = cv.height,
      row = w * 4,
      id = cv.getContext('2d').getImageData(0, 0, w, h).data;
    data = new Uint8Array(id.length);
    for (let y = 0; y < h; y++) data.set(id.subarray((h - 1 - y) * row, (h - y) * row), y * row);
  } catch (e) {
    console.warn('pixelTex', e);
  }
  if (!data) {
    if (old) {
      old.needsUpdate = true;
      return old;
    }
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  if (old && old.isDataTexture) {
    old.image.data.set(data);
    old.needsUpdate = true;
    return old;
  }
  const t = new THREE.DataTexture(data, cv.width, cv.height, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.colorSpace = THREE.SRGBColorSpace;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.anisotropy = Math.min(8, MAXANI);
  t.needsUpdate = true;
  return t;
}
export const signs = [];
let _signPaper;
function signPaper() {
  if (_signPaper) return _signPaper;
  const n = 256,
    c = cvs(n, n),
    x = c.getContext('2d'),
    r = rnd(7);
  x.fillStyle = '#ebe1cc';
  x.fillRect(0, 0, n, n);
  for (let i = 0; i < 5000; i++) {
    x.fillStyle = `rgba(${r() < 0.5 ? '120,95,60' : '255,252,240'},${r() * 0.09})`;
    x.fillRect(r() * n, r() * n, 1 + r() * 3, 1 + r() * 2);
  }
  x.lineWidth = 0.6;
  for (let i = 0; i < 160; i++) {
    x.strokeStyle = `rgba(110,85,50,${r() * 0.12})`;
    const a = r() * n,
      b = r() * n,
      t = r() * 6.28;
    x.beginPath();
    x.moveTo(a, b);
    x.lineTo(a + Math.cos(t) * 12, b + Math.sin(t) * 12);
    x.stroke();
  }
  return (_signPaper = c);
}
function drawSign(cv, c) {
  const W = 1100,
    Hh = 760,
    x = cv.getContext('2d'),
    rtl = LANG === 'ar',
    s = c.sign[LANG];
  x.setTransform(cv.width / W, 0, 0, cv.height / Hh, 0, 0);
  x.globalAlpha = 1;
  x.fillStyle = '#ece2cd';
  x.fillRect(0, 0, W, Hh);
  x.fillStyle = x.createPattern(signPaper(), 'repeat');
  x.fillRect(0, 0, W, Hh);
  x.strokeStyle = 'rgba(42,36,32,.32)';
  x.lineWidth = 3;
  x.strokeRect(26, 26, W - 52, Hh - 52);
  x.direction = rtl ? 'rtl' : 'ltr';
  x.textAlign = rtl ? 'right' : 'left';
  x.textBaseline = 'alphabetic';
  const X0 = rtl ? W - 64 : 64;
  x.fillStyle = c.ink;
  x.font = rtl ? '700 72px "Reem Kufi"' : '600 70px "Pixelify Sans"';
  x.fillText(nolig(s.t), X0, 140);
  x.fillStyle = SPARK;
  x.fillRect(rtl ? W - 64 - 120 : 64, 166, 120, 7);
  let y = 248;
  x.font = rtl ? '400 43px "Marhey"' : '700 47px "Gaegu"';
  for (const line of s.b) {
    if (!line) {
      y += 22;
      continue;
    }
    drawRich(x, line, X0, y, rtl);
    y += 66;
  }
  x.textAlign = rtl ? 'left' : 'right';
  x.fillStyle = 'rgba(42,36,32,.55)';
  x.font = rtl ? '600 30px "Reem Kufi"' : '500 30px "Pixelify Sans"';
  x.fillText(nolig(UIT[LANG].chapter(CH.indexOf(c))), rtl ? 64 : W - 64, Hh - 54);
}
export function sign(c) {
  const w = PHONE && PORTRAIT ? 1.5 : 1.36,
    h = (w * 760) / 1100;
  const cv = cvs(PHONE ? 1024 : 2048, PHONE ? 512 : 1024);
  cv.getContext('2d', { willReadFrequently: true });
  drawSign(cv, c);
  const t = pixelTex(cv);
  signs.push({ cv, t, c });
  const side = paper('#eadfca', { ns: 0.2 });
  const face = new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), [
    side,
    side,
    side,
    side,
    face,
    paper('#eadfca'),
  ]);
  m.castShadow = m.receiveShadow = true;
  m.position.y = -h / 2 - 0.08;
  const grp = new THREE.Group();
  grp.add(m);
  for (const sx of [-0.42, 0.42]) {
    const th = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.11, 5), sparkMat);
    th.position.set(sx * w, -0.045, 0);
    grp.add(th);
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 8), sparkMat);
    pin.position.set(sx * w, -0.1, 0.02);
    pin.castShadow = true;
    grp.add(pin);
  }
  return grp;
}
export let bandTex, bandCv;
export function drawBand() {
  const tw = 2048,
    f = LANG === 'ar' ? '600 54px "Reem Kufi"' : '500 54px "Pixelify Sans"',
    txt = UIT[LANG].band;
  if (!bandCv) {
    bandCv = cvs(tw, 128);
    bandCv.getContext('2d', { willReadFrequently: true });
  }
  const bcv = bandCv,
    bx = bcv.getContext('2d');
  bx.setTransform(1, 0, 0, 1, 0, 0);
  bx.fillStyle = '#1f3d2b';
  bx.fillRect(0, 0, tw, 128);
  bx.fillStyle = GOLD;
  bx.fillRect(0, 12, tw, 3);
  bx.fillRect(0, 113, tw, 3);
  bx.font = f;
  bx.textBaseline = 'middle';
  bx.direction = LANG === 'ar' ? 'rtl' : 'ltr';
  bx.textAlign = 'center';
  const w = bx.measureText(txt).width;
  bx.translate(tw / 2, 68);
  bx.scale(Math.min(1, (tw - 30) / w), 1);
  bx.fillText(txt, 0, 0);
  bandCv = bcv;
  if (!bandTex) {
    bandTex = pixelTex(bcv);
    bandTex.wrapS = THREE.RepeatWrapping;
    bandTex.repeat.set(Math.max(1, Math.round((TAU * (R + 0.34)) / ((0.12 * tw) / 128))), 1);
  } else pixelTex(bcv, bandTex);
}
export function refreshCanvases() {
  for (const s of signs) {
    drawSign(s.cv, s.c);
    pixelTex(s.cv, s.t);
  }
  drawBand();
}
