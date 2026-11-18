import * as THREE from 'three';
import { CH } from '../content/chapters.js';
import { PHONE, SPARK, TAU } from '../core/config.js';
import { anims } from '../core/registry.js';
import { scene } from '../core/renderer.js';
import { ext } from '../paper/geometry.js';
import { paper, worldUV } from '../paper/materials.js';
import { canvasTex, glowTex, ragNormal, rnd, woodTex } from '../paper/textures.js';

export function buildBackdrop() {
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color('#4a4434') },
      mid: { value: new THREE.Color('#5a5440') },
      glow: { value: new THREE.Color('#c0a57a') },
    },
    vertexShader:
      'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform vec3 top, mid, glow; varying vec3 vD;
      void main(){ float y = vD.y; vec3 c = mix(mid, top, smoothstep(0.02, 0.5, y));
        float g = pow(max(0., dot(normalize(vD), normalize(vec3(0.25, 0.12, -1.)))), 6.); c = mix(c, glow, g*.8);
        gl_FragColor = vec4(c, 1.); }`,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(45, 32, 16), m));
  scene.background = null;
}
export function buildDust() {
  const N = PHONE ? 40 : 90,
    pos = new Float32Array(N * 3),
    seed = [];
  for (let i = 0; i < N; i++)
    seed.push([
      (Math.random() - 0.5) * 7,
      Math.random() * 3.2,
      0.5 + Math.random() * 4.5,
      Math.random() * 6,
      0.3 + Math.random() * 0.7,
    ]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({
    map: glowTex(),
    color: '#fff1d6',
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(g, m));
  anims.push(t => {
    for (let i = 0; i < N; i++) {
      const [x, y, z, p, sp] = seed[i];
      pos[i * 3] = x + Math.sin(t * 0.13 * sp + p) * 0.4;
      pos[i * 3 + 1] = ((y + t * 0.035 * sp) % 3.4) + 0.05;
      pos[i * 3 + 2] = z + Math.cos(t * 0.11 * sp + p) * 0.3;
    }
    g.attributes.position.needsUpdate = true;
  });
}
export function buildTable() {
  const t = new THREE.Mesh(
    new THREE.CircleGeometry(26, 64),
    new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.82, color: new THREE.Color('#d8c0a8') })
  );
  t.rotation.x = -Math.PI / 2;
  t.position.y = -0.12;
  t.receiveShadow = true;
  scene.add(t);
  const mat = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.02, 7.2), paper('#2e4a3e', { ns: 0.3 }));
  worldUV(mat.geometry, 0.4);
  mat.position.set(-0.4, -0.11, -0.4);
  mat.rotation.y = -0.12;
  mat.receiveShadow = true;
  scene.add(mat);
  const pen = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 5.2, 10), paper('#c79b45', { ns: 0.3 }));
  body.rotation.z = Math.PI / 2;
  for (let i = -2; i <= 2; i++) {
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 10), paper('#9a7430'));
    n.rotation.z = Math.PI / 2;
    n.position.x = i * 1.0;
    pen.add(n);
  }
  const nib = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 10), paper('#e8cfa4'));
  nib.rotation.z = -Math.PI / 2;
  nib.position.x = 2.9;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 8), paper('#2a2420'));
  tip.rotation.z = -Math.PI / 2;
  tip.position.x = 3.24;
  pen.add(body, nib, tip);
  pen.traverse(o => {
    o.castShadow = o.receiveShadow = true;
  });
  pen.position.set(5.3, 0.03, 2.6);
  pen.rotation.y = 0.95 + Math.PI;
  scene.add(pen);
  const ink = new THREE.Group();
  const jar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.65, 0.7, 8),
    new THREE.MeshStandardMaterial({ color: '#1e3a4a', roughness: 0.25, metalness: 0.1 })
  );
  jar.position.y = 0.23;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.25, 16), paper('#9a7430'));
  neck.position.y = 0.7;
  ink.add(jar, neck);
  ink.traverse(o => {
    o.castShadow = o.receiveShadow = true;
  });
  ink.position.set(-5.2, -0.12, 0.6);
  scene.add(ink);
  const spool = new THREE.Group();
  const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.12, 40), paper('#cfa874'));
  const s2 = s1.clone();
  s2.position.y = 1.18;
  const th = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.62, 1.06, 40),
    new THREE.MeshStandardMaterial({
      color: SPARK,
      roughness: 0.85,
      normalMap: ragNormal,
      normalScale: new THREE.Vector2(0.6, 0.6),
    })
  );
  s1.position.y = 0.06;
  th.position.y = 0.6;
  spool.add(s1, s2, th);
  spool.traverse(o => {
    o.castShadow = o.receiveShadow = true;
  });
  spool.position.set(-4.4, -0.12, -1.9);
  scene.add(spool);
  const rul = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.05, 0.7),
    new THREE.MeshStandardMaterial({
      map: canvasTex(1024, 128, (x, w, h) => {
        x.fillStyle = '#efe6cf';
        x.fillRect(0, 0, w, h);
        x.fillStyle = '#3a3633';
        for (let i = 0; i < 100; i++) {
          const Lh = i % 10 === 0 ? 46 : i % 5 === 0 ? 30 : 18;
          x.fillRect(12 + i * 10, 0, 2, Lh);
          if (i % 10 === 0) {
            x.font = '600 22px "Reem Kufi"';
            x.fillText(String(i / 10), 16 + i * 10, 78);
          }
        }
      }),
      roughness: 0.6,
    })
  );
  rul.position.set(-3.4, -0.08, 4.6);
  rul.rotation.y = -0.32;
  rul.receiveShadow = true;
  rul.castShadow = true;
  scene.add(rul);
  const r = rnd(11);
  for (let i = 0; i < 18; i++) {
    const a = r() * TAU,
      d = 4.0 + r() * 3.0;
    if (Math.cos(a) > 0.55 && d < 5) continue;
    const s = new THREE.Shape();
    const n = 3 + Math.floor(r() * 3);
    for (let j = 0; j < n; j++) {
      const aa = (j / n) * TAU + r() * 0.6,
        rr = 0.12 + r() * 0.2;
      j ? s.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr) : s.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr);
    }
    const m = ext(s, 0.01, [...CH.map(c => c.wall), '#efe5d1'][i % 7]);
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = r() * 6;
    m.position.set(Math.sin(a) * d, -0.095, Math.cos(a) * d);
    scene.add(m);
  }
}
