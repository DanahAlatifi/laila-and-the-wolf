import { FLOOR, RED, TAU } from '../../core/config.js';
import { canvasTex, grain } from '../../paper/textures.js';
import { prop, ribbonTag } from '../../props/prop.js';
import {
  SX,
  at,
  bunting,
  floorSector,
  hang,
  layer,
  onWall,
  skipSign,
  thread,
  treeLine,
} from '../builders.js';
import { sign } from '../signs.js';

export default function build(b, c, k) {
  floorSector(
    b,
    c.floor,
    canvasTex(512, 512, (x, w, h) => {
      x.fillStyle = '#4a6a3a';
      x.fillRect(0, 0, w, h);
      for (let i = 0; i < 400; i++) {
        x.fillStyle = `rgba(${Math.random() < 0.5 ? '30,60,25' : '120,160,80'},.25)`;
        x.beginPath();
        x.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 8, 0, TAU);
        x.fill();
      }
      x.fillStyle = '#a8865a';
      for (const off of [0, w]) {
        x.beginPath();
        for (let y = 0; y <= h; y += 8) x.lineTo(off - 40 + Math.sin(y * 0.02) * 18, y);
        for (let y = h; y >= 0; y -= 8) x.lineTo(off + 40 + Math.sin(y * 0.02) * 18, y);
        x.fill();
      }
      grain(x, w, h, 16);
    })
  );
  layer(b, 0.75, '#1f3a28', treeLine(1.35, 0.5, 4), { n: 140 });
  layer(b, 1.25, '#2a4a33', treeLine(0.75, 0.42, 3.2, 0.3), { n: 140 });
  layer(b, 1.9, '#35603f', treeLine(0.25, 0.22, 4.5, 0.6), { n: 140 });
  b.add(at(prop('oak', 1.4, { bay: k }), -0.5, 1.5, FLOOR, 4));
  b.add(at(prop('pine', 1.3, { bay: k }), 0.55, 1.35, FLOOR, 0));
  b.add(at(prop('pine2', 1.0, { bay: k }), -0.98, 2.05, FLOOR, 18));
  b.add(at(prop('oak2', 1.1, { bay: k }), 0.98, 2.02, FLOOR, -20));
  const wf = at(prop('wolf', 0.95, { bay: k }), -0.3, 2.0, FLOOR, 12);
  b.add(wf);
  b.add(at(prop('laila_walk', 0.9, { bay: k }), 0.32, 2.45, FLOOR, -8));
  const sp = at(prop('signpost', 0.62, { bay: k }), -0.92, 2.6, FLOOR, 18);
  b.add(sp);
  const rb = ribbonTag(1, 0.15);
  rb.position.set(0, 0.58, 0.03);
  sp.add(rb);
  b.add(at(prop('mushroom', 0.16, { bay: k }), 0.78, 2.72, FLOOR, -10));
  b.add(at(prop('mushroom2', 0.12, { bay: k }), -0.1, 2.88, FLOOR, 6));
  b.add(at(prop('rabbit', 0.26, { bay: k }), 1.12, 2.66, FLOOR, -26));
  b.add(at(prop('squirrel', 0.28, { bay: k }), -0.78, 1.72, FLOOR, 14));
  b.add(at(prop('hedgehog', 0.16, { bay: k }), 0.2, 2.9, FLOOR, -6));
  b.add(onWall(prop('owl', 0.4, { bay: k }), 1, 1.7, 1.55, 0.06, -8));
  const th = thread(b, 2.85, 2.62, 0.13);
  bunting(b, th, ['#4e7a40', '#efe5d1', RED], 0.2, skipSign(c));
  hang(b, th, -0.6, at(prop('bird2', 0.22, { bay: k }), 0, 0, -0.3), 0.18);
  hang(b, th, SX(c), sign(c), 0, { len: 0.55 });
}
