import { FLOOR, RED } from '../../core/config.js';
import { anims } from '../../core/registry.js';
import { archHole, box } from '../../paper/geometry.js';
import { canvasTex } from '../../paper/textures.js';
import { prop, ribbonTag } from '../../props/prop.js';
import {
  SX,
  at,
  bunting,
  floorSector,
  hang,
  layer,
  planks,
  skipSign,
  sunOn,
  thread,
  treeLine,
} from '../builders.js';
import { sign } from '../signs.js';

export default function build(b, c, k) {
  floorSector(
    b,
    c.floor,
    canvasTex(512, 512, (x, w, h) => planks(x, w, h, '#9a6a44'))
  );
  sunOn(b, -1, 0.9, 1.5, 0.3, '#f0c050');
  layer(b, 0.7, '#4e7a40', treeLine(1.1, 0.35, 4), { n: 140 });
  layer(b, 0.85, '#efe0c0', () => 2.35, {
    n: 4,
    holes: [archHole(-0.42, -0.08, FLOOR + 0.002, 1.35), archHole(0.12, 0.42, 1.25, 1.85)],
  });
  const wc = at(prop('woodcutter', 1.12, { bay: k }), -0.25, 1.02, FLOOR, 4);
  b.add(wc);
  const rb = ribbonTag(5, 0.13);
  rb.position.set(-0.24, 0.43, 0.05);
  wc.add(rb);
  b.add(at(prop('grandma_pin', 0.9, { bay: k }), 0.5, 1.9, FLOOR, -12));
  b.add(at(prop('laila_happy', 0.88, { bay: k }), -0.08, 2.42, FLOOR, 4));
  const tb = box(0.5, 0.04, 0.32, '#c9a46a');
  at(tb, -0.72, 1.95, 0.4);
  b.add(tb);
  const tl = box(0.06, 0.38, 0.06, '#a8834e');
  at(tl, -0.72, 1.95, FLOOR + 0.18);
  b.add(tl);
  b.add(at(prop('cake', 0.16, { bay: k }), -0.8, 1.98, 0.42, 14));
  b.add(at(prop('teapot', 0.18, { bay: k }), -0.6, 1.93, 0.42, 14));
  const fl = at(prop('wolfflee', 0.42, { bay: k }), 0.6, 2.55, FLOOR, -10);
  b.add(fl);
  anims.push(t => {
    const u = (t * 0.22) % 1;
    fl.position.x = 0.35 + u * 1.15;
    fl.position.z = 2.62 - u * 0.25;
    fl.children[0].position.y = Math.abs(Math.sin(t * 8)) * 0.06;
    fl.visible = u < 0.92;
  });
  b.add(at(prop('logs', 0.26, { bay: k }), 1.05, 2.0, FLOOR, -26));
  b.add(at(prop('cat2', 0.34, { bay: k }), -1.0, 2.6, FLOOR, 22));
  b.add(at(prop('flower2', 0.2, { bay: k }), -0.4, 2.85, FLOOR, 6));
  const th = thread(b, 2.85, 2.62, 0.13);
  bunting(b, th, [RED, '#efe5d1', '#e2a33b', '#4e7a40'], 0.18, skipSign(c));
  hang(b, th, 0.7, at(prop('bird', 0.22, { bay: k }), 0, 0, -0.3), 0.12);
  hang(b, th, SX(c), sign(c), 0, { len: 0.55 });
}
