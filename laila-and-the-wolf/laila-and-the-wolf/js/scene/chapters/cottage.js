import * as THREE from 'three';
import { FLOOR, RED, TAU } from '../../core/config.js';
import { anims } from '../../core/registry.js';
import { ext } from '../../paper/geometry.js';
import { prop, ribbonTag } from '../../props/prop.js';
import {
  SX,
  at,
  bunting,
  cloudsOn,
  floorSector,
  glowLamp,
  hang,
  layer,
  skipSign,
  sunOn,
  thread,
  treeLine,
} from '../builders.js';
import { sign } from '../signs.js';

export default function build(b, c, k) {
  floorSector(b, c.floor);
  sunOn(b, 1, 1.5, 1.7, 0.4, '#f08a4a');
  cloudsOn(
    b,
    [
      [-1, 2.0, 2.5, 0.8, 3],
      [1, 2.4, 2.6, 0.6, 11],
    ],
    '#f0c8b0'
  );
  layer(b, 0.7, '#3a4a3a', treeLine(1.35, 0.42, 4), { n: 140 });
  const ct = at(prop('cottage', 1.05, { bay: k }), 0, 1.25, FLOOR, 0);
  b.add(ct);
  glowLamp(ct, -0.3, 0.36, 0.0, '#ffc46b', 0.6, 1.4);
  const puffs = [0, 1, 2].map(() => {
    const m = ext(
      (() => {
        const s = new THREE.Shape();
        s.absarc(0, 0, 0.06, 0, TAU, false);
        return s;
      })(),
      0.02,
      '#e8e0d4'
    );
    b.add(m);
    return m;
  });
  anims.push(t =>
    puffs.forEach((m, i) => {
      const u = (t * 0.25 + i / 3) % 1;
      m.position.set(0.32 + Math.sin(u * 6) * 0.05 + u * 0.12, 1.15 + u * 0.9, 1.25);
      m.scale.setScalar(0.6 + u * 1.4);
    })
  );
  b.add(at(prop('wolf_knock', 0.78, { bay: k }), -0.32, 1.62, FLOOR, 6));
  b.add(at(prop('well', 0.55, { bay: k }), -0.85, 1.85, FLOOR, 18));
  b.add(at(prop('fence', 0.36, { bay: k }), -0.95, 2.2, FLOOR, 22));
  const fn = at(prop('fence2', 0.36, { bay: k }), 0.95, 2.2, FLOOR, -22);
  b.add(fn);
  const rb = ribbonTag(3, 0.15);
  rb.position.set(0.2, 0.32, 0.04);
  fn.add(rb);
  b.add(at(prop('hen', 0.22, { bay: k }), 0.62, 2.55, FLOOR, -12));
  b.add(at(prop('laila_walk', 0.9, { bay: k }), 0.22, 2.55, FLOOR, -4));
  [
    ['tulip', -0.55, 2.75, 0.2],
    ['daisy', -0.2, 2.85, 0.18],
    ['flower', 1.15, 2.75, 0.2],
    ['bluebell', -1.15, 2.7, 0.2],
  ].forEach(([n, x, z, h]) => b.add(at(prop(n, h, { bay: k }), x, z, FLOOR, -x * 20)));
  const th = thread(b, 2.85, 2.62, 0.13);
  bunting(b, th, ['#efe5d1', RED, '#e2a33b'], 0.2, [...skipSign(c), [-1.0, -0.6]]);
  const lp = prop('lantern', 0.3, { bay: k });
  hang(b, th, -0.8, at(lp, 0, 0, -0.42), 0.06);
  glowLamp(lp, 0, 0.21, 0, '#ffc46b', 0.6, 1.3);
  hang(b, th, SX(c), sign(c), 0, { len: 0.55 });
}
