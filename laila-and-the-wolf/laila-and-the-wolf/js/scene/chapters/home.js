import { FLOOR, RED } from '../../core/config.js';
import { archHole, box, ellipseShape, ext } from '../../paper/geometry.js';
import { canvasTex } from '../../paper/textures.js';
import { prop, ribbonTag } from '../../props/prop.js';
import {
  SX,
  at,
  bunting,
  flatOn,
  floorSector,
  hang,
  layer,
  onWall,
  planks,
  skipSign,
  thread,
} from '../builders.js';
import { sign } from '../signs.js';

export default function build(b, c, k) {
  floorSector(
    b,
    c.floor,
    canvasTex(512, 512, (x, w, h) => planks(x, w, h, '#9a6a44'))
  );
  flatOn(b, ext(ellipseShape(0.75, 0.42), 0.008, '#a85a6a'), 0.05, 2.25);
  flatOn(b, ext(ellipseShape(0.6, 0.3), 0.008, '#e2a33b'), 0.05, 2.25, 0, FLOOR + 0.017);
  layer(b, 0.68, '#7aa35a', x => 1.45 + 0.08 * Math.sin(x * 6));
  layer(b, 0.85, '#efe0c0', () => 2.35, { n: 4, holes: [archHole(-0.22, 0.22, 1.25, 1.95)] });
  for (const [w, hgt, x, y] of [
    [0.02, 0.7, 0, 1.6],
    [0.44, 0.02, 0, 1.55],
  ]) {
    const m = box(w, hgt, 0.02, '#8a5a3c');
    m.position.set(x, y, 0.87);
    b.add(m);
  }
  for (const x of [-0.27, 0.27]) {
    const m = box(0.1, 0.78, 0.012, RED);
    m.position.set(x, 1.62, 0.9);
    b.add(m);
  }
  const top = box(1.2, 0.045, 0.44, '#c9a46a');
  at(top, -0.2, 1.5, 0.55);
  b.add(top);
  for (const sx of [-0.52, 0.52]) {
    const l = box(0.05, 0.5, 0.4, '#a8834e');
    at(l, -0.2 + sx, 1.5, FLOOR + 0.25);
    b.add(l);
  }
  b.add(at(prop('bread', 0.13, { bay: k }), -0.62, 1.55, 0.575, 6));
  b.add(at(prop('honey', 0.18, { bay: k }), -0.38, 1.6, 0.575, 0));
  b.add(at(prop('basket', 0.3, { bay: k }), -0.08, 1.56, 0.575, -4));
  b.add(at(prop('apple', 0.1, { bay: k }), 0.2, 1.62, 0.575, 0));
  b.add(onWall(prop('clock', 0.62, { bay: k }), -1, 1.45, 1.25, 0.04));
  const sh = box(0.62, 0.035, 0.2, '#c9a46a');
  onWall(sh, 1, 1.8, 1.3, 0.11);
  b.add(sh);
  [
    ['plant', 0.3],
    ['apple2', 0.12],
  ].forEach(([n, h], i) => {
    const p = prop(n, h, { bay: k });
    onWall(p, 1, 1.8 + (i - 0.5) * 0.3, 1.318, 0.12);
    b.add(p);
  });
  b.add(at(prop('mother', 1.0, { bay: k }), 0.55, 1.9, FLOOR, -10));
  b.add(at(prop('laila_walk', 0.95, { bay: k }), -0.15, 2.35, FLOOR, 6));
  b.add(at(prop('cat', 0.45, { bay: k }), -0.85, 2.45, FLOOR, 14));
  const gate = at(prop('gate', 0.55, { bay: k }), 0.98, 2.62, FLOOR, -26);
  b.add(gate);
  const rb = ribbonTag(0, 0.15);
  rb.position.set(-0.2, 0.47, 0.03);
  gate.add(rb);
  const th = thread(b, 2.85, 2.62, 0.14);
  bunting(b, th, [RED, '#efe5d1', '#3a5a7a', '#e2a33b'], 0.19, skipSign(c));
  hang(b, th, -0.95, at(prop('bird', 0.22, { bay: k }), 0, 0, -0.3), 0.08);
  hang(b, th, SX(c), sign(c), 0.0, { len: 0.55 });
}
