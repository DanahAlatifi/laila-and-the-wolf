import { FLOOR, TAU } from '../../core/config.js';
import { archHole, box, ext, starShape } from '../../paper/geometry.js';
import { canvasTex } from '../../paper/textures.js';
import { prop, ribbonTag } from '../../props/prop.js';
import { SX, at, flatOn, floorSector, glowLamp, hang, layer, onWall, planks, thread } from '../builders.js';
import { sign } from '../signs.js';

export default function build(b, c, k) {
  floorSector(
    b,
    c.floor,
    canvasTex(512, 512, (x, w, h) => {
      planks(x, w, h, '#6a4a3a');
      x.fillStyle = '#7a3b3b';
      x.fillRect(96, 96, 320, 320);
      x.strokeStyle = '#e2a33b';
      x.lineWidth = 8;
      x.strokeRect(116, 116, 280, 280);
      x.fillStyle = '#e2a33b';
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++) {
          x.beginPath();
          x.arc(156 + i * 66, 156 + j * 66, 10, 0, TAU);
          x.fill();
        }
    })
  );
  [
    [-1, 1.0, 2.6, 0.07],
    [-1, 2.2, 2.25, 0.05],
    [1, 2.35, 2.5, 0.06],
    [1, 0.7, 2.75, 0.045],
  ].forEach(([sd, s, y, r]) => {
    const m = ext(starShape(r), 0.012, '#f0d58a');
    onWall(m, sd, s, y, 0.03);
    b.add(m);
  });
  b.add(at(prop('moon', 0.45, { bay: k }), -0.25, 0.62, 1.5, 0));
  layer(b, 0.85, '#55639a', () => 2.35, { n: 4, holes: [archHole(-0.44, -0.06, 1.25, 1.95)] });
  for (const [w, hgt, x, y] of [
    [0.02, 0.7, -0.25, 1.6],
    [0.38, 0.02, -0.25, 1.57],
  ]) {
    const m = box(w, hgt, 0.02, '#e8dcc0');
    m.position.set(x, y, 0.87);
    b.add(m);
  }
  const bed = at(prop('wolfbed', 1.0, { bay: k }), 0.0, 1.5, FLOOR, 0);
  b.add(bed);
  const rb = ribbonTag(4, 0.13);
  rb.position.set(0.62, 0.66, 0.04);
  bed.add(rb);
  b.add(at(prop('wardrobe', 1.0, { bay: k }), -0.98, 2.15, FLOOR, 28));
  const ns = box(0.26, 0.36, 0.22, '#7a4a2e');
  at(ns, 0.85, 1.85, FLOOR + 0.18);
  b.add(ns);
  const cd = at(prop('candle', 0.24, { bay: k }), 0.85, 1.87, FLOOR + 0.36, -10);
  b.add(cd);
  glowLamp(cd, 0, 0.8, 0, '#ffb45a', 2.0, 2.4);
  b.add(onWall(prop('clock', 0.5, { bay: k }), 1, 1.95, 1.3, 0.04));
  b.add(at(prop('laila_scared', 0.88, { bay: k }), 0.55, 2.5, FLOOR, -10));
  b.add(at(prop('basket', 0.22, { bay: k }), 0.2, 2.7, FLOOR, -8));
  flatOn(b, prop('slippers', 0.16, { bay: k }), -0.3, 2.35, 0.3);
  const th = thread(b, 2.85, 2.62, 0.13);
  [-1.25, -0.4, -0.05].forEach((x, i) => {
    if (Math.abs(x - SX(c)) < 0.75) return;
    hang(b, th, x, ext(starShape(0.07 + i * 0.01), 0.012, '#f0d58a'), 0.18 + i * 0.12);
  });
  hang(b, th, SX(c), sign(c), 0, { len: 0.55 });
}
