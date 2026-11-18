import * as THREE from 'three';
import { PHONE, PORTRAIT } from './config.js';

export const canvas = document.getElementById('gl');
export let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
} catch (e) {
  window.__fwFail && window.__fwFail('renderer');
  throw e;
}
export const DPR = Math.min(devicePixelRatio || 1, PHONE ? 1.6 : 1.5);
renderer.setPixelRatio(DPR);
renderer.setSize(innerWidth, innerHeight, false);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
export const MAXANI = renderer.capabilities.getMaxAnisotropy();

export const scene = new THREE.Scene();
const BG = new THREE.Color('#5a5440');
scene.background = BG;
scene.fog = new THREE.Fog(BG, 13, 30);
export const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 80);
export const CAM =
  PHONE && PORTRAIT
    ? { pos: new THREE.Vector3(0, 2.45, 6.5), look: new THREE.Vector3(0, 1.5, 1.7), fov: 47 }
    : { pos: new THREE.Vector3(0, 2.95, 7.3), look: new THREE.Vector3(0, 1.3, 1.25), fov: 34 };
export const ZOOMS = PHONE && PORTRAIT ? [1, 0.86, 0.74] : [1, 0.8, 0.64];

scene.add(new THREE.HemisphereLight('#fff3e8', '#5e5a44', 1.45));
const key = new THREE.DirectionalLight('#fff0db', 2.35);
key.position.set(4.2, 8.5, 6.5);
key.target.position.set(0, 0.9, 0.4);
key.castShadow = true;
key.shadow.mapSize.set(PHONE ? 1024 : 2048, PHONE ? 1024 : 2048);
Object.assign(key.shadow.camera, { left: -4.4, right: 4.4, top: 4.4, bottom: -4.4, near: 2, far: 22 });
key.shadow.intensity = 0.72;
key.shadow.bias = -0.0005;
key.shadow.normalBias = 0.025;
key.shadow.radius = 3;
scene.add(key, key.target);
const fill = new THREE.DirectionalLight('#dfe7ff', 0.45);
fill.position.set(-6, 3, 4);
scene.add(fill);
const rim = new THREE.DirectionalLight('#ffd9c0', 0.5);
rim.position.set(-2, 6, -7);
scene.add(rim);
