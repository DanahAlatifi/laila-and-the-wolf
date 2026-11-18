import * as THREE from 'three';
import { SPARK } from '../core/config.js';
import { detailTex, normalTex, ragNormal } from './textures.js';

export function worldUV(g, s = 0.62) {
  const p = g.attributes.position,
    n = g.attributes.normal,
    uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)),
      ay = Math.abs(n.getY(i)),
      az = Math.abs(n.getZ(i));
    let u, v;
    if (ay >= ax && ay >= az) {
      u = p.getX(i);
      v = p.getZ(i);
    } else if (ax >= az) {
      u = p.getZ(i);
      v = p.getY(i);
    } else {
      u = p.getX(i);
      v = p.getY(i);
    }
    uv[2 * i] = u * s;
    uv[2 * i + 1] = v * s;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}
const mats = new Map();
export function paper(hex, { ns = 0.5, rough = 0.94, lift = 1.14, nmap, side = THREE.FrontSide } = {}) {
  nmap = nmap || normalTex;
  const k = hex + ns + rough + lift + side + (nmap === ragNormal ? 'r' : 'n');
  if (mats.has(k)) return mats.get(k);
  const m = new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex).multiplyScalar(lift),
    map: detailTex,
    normalMap: nmap,
    normalScale: new THREE.Vector2(ns, ns),
    roughness: rough,
    metalness: 0,
    side,
  });
  mats.set(k, m);
  return m;
}
export function edgeOf(hex, amt = 0.38) {
  return paper('#' + new THREE.Color(hex).lerp(new THREE.Color('#f1e7d3'), amt).getHexString(), { ns: 0.2 });
}
export let sparkMat;
export function makeSpark() {
  sparkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(SPARK),
    roughness: 0.7,
    emissive: new THREE.Color('#0fb3a4'),
    emissiveIntensity: 0.14,
  });
}
