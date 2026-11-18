import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { C2, CARDS, CLUECARDS, LABELS, UIT } from '../content/texts.js';
import { anims, interactive, springs, swayers } from '../core/registry.js';
import { clueFound } from '../core/state.js';
import { atlasNormal, cvs, detailTex } from '../paper/textures.js';
import { PD } from './catalog.js';
import { drawParts, partShape } from './parts.js';

const propGeo = new Map(),
  propParts = new Map();
const tmpC = new THREE.Color(),
  creamC = new THREE.Color('#f1e7d3');
function propGeometry(name) {
  if (propGeo.has(name)) return propGeo.get(name);
  const parts = PD[name] ? PD[name]() : null;
  if (!parts) {
    console.warn('missing prop', name);
    return null;
  }
  propParts.set(name, parts);
  const geos = [],
    step = 0.0026,
    d = 0.011;
  parts.forEach((p, i) => {
    const g = new THREE.ExtrudeGeometry(partShape(p), { depth: d, bevelEnabled: false, curveSegments: 14 });
    g.translate(0, 0, i * step - d);
    const n = g.attributes.position.count,
      col = new Float32Array(n * 3);
    tmpC.set(p[1]);
    const side = tmpC.clone().lerp(creamC, 0.35);
    const capEnd = g.groups.length > 1 ? g.groups[0].count : n;
    for (let v = 0; v < n; v++) {
      const cc = v < capEnd ? tmpC : side;
      col[v * 3] = cc.r;
      col[v * 3 + 1] = cc.g;
      col[v * 3 + 2] = cc.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pos = g.attributes.position,
      uv = g.attributes.uv;
    for (let v = 0; v < n; v++) uv.setXY(v, pos.getX(v) * 1.3, pos.getY(v) * 1.3);
    g.clearGroups();
    geos.push(g);
  });
  const g = mergeGeometries(geos, false);
  geos.forEach(x => x.dispose());
  g.computeBoundingBox();
  g.computeBoundingSphere();
  propGeo.set(name, g);
  return g;
}
export function propArt(name, maxW, maxH) {
  propGeometry(name);
  const parts = propParts.get(name),
    bb = propGeo.get(name).boundingBox,
    w = bb.max.x - bb.min.x,
    h = bb.max.y - bb.min.y;
  const k = Math.min(maxW / w, maxH / h) * 2,
    cv = cvs(Math.ceil(w * k) + 8, Math.ceil(h * k) + 8),
    x = cv.getContext('2d');
  x.translate(4 - bb.min.x * k, 4 + bb.max.y * k);
  x.scale(k, -k);
  drawParts(x, parts);
  return { url: cv.toDataURL(), w: (w * k) / 2, h: (h * k) / 2 };
}
let propMat;
const SWAY =
  /^(laila|mother|grandma|woodcutter|wolf_knock|wolf$|pine|oak|flower|daisy|tulip|bluebell|rosebush|plant|signpost)/;
export function prop(name, h, opt = {}) {
  const g = propGeometry(name),
    pivot = new THREE.Group();
  if (!g) return pivot;
  if (!propMat)
    propMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      color: new THREE.Color(1.1, 1.1, 1.1),
      map: detailTex,
      normalMap: atlasNormal,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughness: 0.9,
      metalness: 0,
    });
  const mesh = new THREE.Mesh(g, propMat);
  mesh.scale.set(h, h, 1);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  pivot.add(mesh);
  const base = name.replace(/\d$/, '');
  pivot.userData = {
    name,
    bay: opt.bay,
    h,
    card: CARDS[name] || CARDS[base],
    label: LABELS[name] || LABELS[base] || LABELS[name.split('_')[0]] || name,
    s: { a: 0, v: 0, y: 0, vy: 0 },
  };
  mesh.userData.pivot = pivot;
  if (SWAY.test(name)) {
    pivot.userData.sw = Math.random() * 6;
    pivot.userData.sa = /^(laila|mother|grandma|woodcutter|wolf)/.test(name)
      ? 0.018
      : /^signpost/.test(name)
        ? 0.004
        : 0.012;
    swayers.push(pivot);
  }
  if (!opt.inert) interactive.push(mesh);
  return pivot;
}
export function ribbonTag(i, h = 0.16) {
  const pv = prop('bow', h, { bay: i });
  Object.assign(pv.userData, {
    name: 'ribbon' + i,
    clue: i,
    card: C2([UIT.ar.ribbonN(i), CLUECARDS[i].ar], [UIT.en.ribbonN(i), CLUECARDS[i].en]),
    label: C2(UIT.ar.ribbon, UIT.en.ribbon),
  });
  const ph = i * 1.3;
  anims.push(t => {
    if (!springs.includes(pv)) pv.rotation.z = Math.sin(t * 2.2 + ph) * (clueFound[i] ? 0.04 : 0.16);
  });
  return pv;
}
