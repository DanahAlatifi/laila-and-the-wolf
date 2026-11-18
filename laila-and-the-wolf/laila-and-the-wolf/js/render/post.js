import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import * as THREE from 'three';
import { PHONE, Q } from '../core/config.js';
import { DPR, camera, renderer, scene } from '../core/renderer.js';

export let composer, gtao, grade;
export function buildPost() {
  const rt = new THREE.WebGLRenderTarget(innerWidth * DPR, innerHeight * DPR, {
    type: THREE.HalfFloatType,
    samples: 4,
  });
  composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(DPR);
  composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  if (!PHONE && !Q.has('noao')) {
    gtao = new GTAOPass(scene, camera, innerWidth, innerHeight);
    gtao.updateGtaoMaterial({ radius: 0.32, distanceExponent: 1.4, thickness: 0.6, scale: 1.0, samples: 16 });
    gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
    gtao.blendIntensity = 0.85;
    composer.addPass(gtao);
  }
  composer.addPass(new OutputPass());
  grade = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
    },
    vertexShader:
      'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
      void main(){
        vec3 c = texture2D(tDiffuse, vUv).rgb;
        float l = dot(c, vec3(.299,.587,.114));
        c = mix(vec3(l), c, .95);
        c *= vec3(1.03, 1.0, .97);
        c = mix(c, c*c*(3.-2.*c), .18);
        vec2 q = vUv - .5; q.x *= uRes.x/uRes.y;
        c *= 1. - .22*smoothstep(.42, 1.12, length(q));
        c += (h(floor(vUv*uRes) + fract(uTime*7.)*97.) - .5) * .032;
        gl_FragColor = vec4(c, 1.);
      }`,
  });
  composer.addPass(grade);
}
