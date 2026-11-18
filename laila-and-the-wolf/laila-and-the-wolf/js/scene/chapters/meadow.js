import { FLOOR, RED, TAU } from '../../core/config.js';
import { anims } from '../../core/registry.js';
import { canvasTex, grain } from '../../paper/textures.js';
import { prop, ribbonTag } from '../../props/prop.js';
import {
  SX,
  at,
  bunting,
  cloudsOn,
  floorSector,
  hang,
  layer,
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
    canvasTex(512, 512, (x, w, h) => {
      x.fillStyle = '#7aa35a';
      x.fillRect(0, 0, w, h);
      const cols = ['#f8f4ec', '#e9d24a', '#e9837a', '#9a6ab8'];
      for (let i = 0; i < 260; i++) {
        x.fillStyle = cols[i % 4];
        x.beginPath();
        x.arc(Math.random() * w, Math.random() * h, 2 + Math.random() * 3, 0, TAU);
        x.fill();
      }
      grain(x, w, h, 14);
    })
  );
  sunOn(b, -1, 1.0, 2.3, 0.32, '#f0c050');
  cloudsOn(b, [
    [1, 2.0, 2.55, 0.8, 3],
    [1, 1.0, 2.6, 0.7, 5],
    [-1, 2.3, 2.1, 0.55, 7],
    [-1, 1.7, 2.8, 0.5, 9],
  ]);
  layer(b, 0.75, '#3a6a48', treeLine(0.95, 0.35, 4.5), { n: 140 });
  const run = at(prop('wolfrun', 0.42, { bay: k }), 0, 0.98, 0.38, 0);
  b.add(run);
  anims.push(t => {
    const u = (t * 0.18) % 1;
    run.position.x = -0.62 + u * 1.24;
    run.children[0].position.y = Math.abs(Math.sin(t * 9)) * 0.03;
  });
  layer(b, 1.1, '#5f8f4a', x => 0.48 + 0.1 * Math.sin(x * 4 + 1));
  layer(b, 1.7, '#6f9f55', x => 0.24 + 0.07 * Math.sin(x * 5 + 2));
  b.add(at(prop('deer', 0.5, { bay: k }), 0.72, 1.55, FLOOR, -10));
  b.add(at(prop('laila_pick', 0.9, { bay: k }), -0.25, 2.35, FLOOR, 6));
  const rbush = at(prop('rosebush', 0.5, { bay: k }), 0.55, 2.42, FLOOR, -10);
  b.add(rbush);
  const rb = ribbonTag(2, 0.15);
  rb.position.set(0.02, 0.44, 0.06);
  rbush.add(rb);
  [
    ['flower', -0.9, 2.55, 0.26],
    ['daisy', -0.6, 2.8, 0.22],
    ['tulip', 0.1, 2.85, 0.24],
    ['bluebell', 0.95, 2.65, 0.24],
    ['daisy2', 1.2, 2.8, 0.2],
    ['tulip2', -1.2, 2.75, 0.22],
    ['flower2', 0.35, 2.75, 0.2],
  ].forEach(([n, x, z, h]) => b.add(at(prop(n, h, { bay: k }), x, z, FLOOR, -x * 20)));
  b.add(at(prop('snail', 0.12, { bay: k }), -0.05, 2.92, FLOOR, 4));
  b.add(at(prop('rosebush2', 0.36, { bay: k }), -0.95, 1.95, FLOOR, 16));
  const th = thread(b, 2.85, 2.62, 0.13);
  const th2 = thread(b, 1.5, 2.25, 0.1);
  [
    [-0.45, 'butterfly', 0.35],
    [0.4, 'butterfly2', 0.55],
    [0.05, 'butterfly3', 0.2],
  ].forEach(([x, n, d], i) => {
    const bf = prop(n, 0.22, { bay: k });
    hang(b, th2, x, bf, d);
    anims.push(t => {
      bf.children[0].scale.x = bf.userData.h * (0.55 + 0.45 * Math.abs(Math.cos(t * 5 + i * 2)));
      bf.position.y = -d + Math.sin(t * 1.4 + i) * 0.04;
    });
  });
  bunting(b, th, ['#e9d24a', '#efe5d1', '#e9837a', RED], 0.2, skipSign(c));
  hang(b, th, SX(c), sign(c), 0, { len: 0.55 });
}
