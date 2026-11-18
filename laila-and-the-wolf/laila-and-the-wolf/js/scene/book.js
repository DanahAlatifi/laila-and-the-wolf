import * as THREE from 'three';
import { CH } from '../content/chapters.js';
import { D2R, H, HOUT, LANG, NB, R, T } from '../core/config.js';
import { scene } from '../core/renderer.js';
import { ext } from '../paper/geometry.js';
import { paper, worldUV } from '../paper/materials.js';
import { ragNormal } from '../paper/textures.js';
import { BUILD } from './chapters/index.js';
import { bandTex, drawBand } from './signs.js';

export const book = new THREE.Group();
scene.add(book);
export const bays = [];
function bayGroup(k) {
  const g = new THREE.Group();
  book.add(g);
  bays[k] = g;
  return g;
}
const walls = [];
export let dirS = LANG === 'ar' ? -1 : 1;
export function applyDir() {
  dirS = LANG === 'ar' ? -1 : 1;
  bays.forEach((g, k) => (g.rotation.y = dirS * k * 60 * D2R));
  for (const w of walls) {
    w.wg.rotation.y = dirS * (w.j * 60 + 30) * D2R - Math.PI / 2;
    const lo = CH[dirS > 0 ? w.j : (w.j + 1) % NB].wall,
      hi = CH[dirS > 0 ? (w.j + 1) % NB : w.j].wall;
    w.a.material = [paper(lo), paper('#efe5d1', { ns: 0.2 })];
    w.b.material = [paper(hi), paper('#efe5d1', { ns: 0.2 })];
  }
}
export function buildBook() {
  const top = new THREE.Mesh(
    worldUV(new THREE.CylinderGeometry(R + 0.32, R + 0.32, 0.02, 128, 1), 0.5),
    paper('#e6dac2', { ns: 0.3 })
  );
  top.position.y = -0.01;
  top.receiveShadow = true;
  book.add(top);
  drawBand();
  const band = bandTex;
  const side = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.32, R + 0.36, 0.12, 128, 1, true),
    new THREE.MeshStandardMaterial({
      map: band,
      roughness: 0.8,
      normalMap: ragNormal,
      normalScale: new THREE.Vector2(0.5, 0.5),
    })
  );
  side.position.y = -0.06;
  side.receiveShadow = true;
  book.add(side);
  const ps = new THREE.Shape();
  ps.moveTo(0.03, 0);
  ps.lineTo(R, 0);
  ps.lineTo(R, HOUT - 0.22);
  ps.quadraticCurveTo(R, HOUT, R - 0.22, HOUT);
  ps.bezierCurveTo(R * 0.58, HOUT + 0.02, R * 0.32, H, 0.03, H);
  ps.closePath();
  for (let j = 0; j < NB; j++) {
    const wg = new THREE.Group();
    book.add(wg);
    const a = ext(ps, T / 2, CH[j].wall, { center: false, edge: '#efe5d1' });
    const b = ext(ps, T / 2, CH[j].wall, { center: false, edge: '#efe5d1' });
    b.position.z = -T / 2;
    wg.add(a, b);
    walls.push({ wg, a, b, j });
  }
  const sp = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, H, 16),
    paper('#1f3d2b', { nmap: ragNormal, ns: 0.6 })
  );
  sp.position.y = H / 2;
  book.add(sp);
  CH.forEach((c, k) => {
    const b = bayGroup(k);
    BUILD[c.id](b, c, k);
  });
  applyDir();
  book.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
}
