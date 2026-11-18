import { renderer } from './core/renderer.js';
import { signs } from './scene/signs.js';

const __errs = [];
addEventListener('error', e => __errs.push(String(e.message)));
const __ce = console.error.bind(console);
console.error = (...a) => {
  __errs.push(a.map(String).join(' ').slice(0, 200));
  __ce(...a);
};
const __cw = console.warn.bind(console);
console.warn = (...a) => {
  __errs.push('W: ' + a.map(String).join(' ').slice(0, 200));
  __cw(...a);
};
export function showDebug() {
  const gl = renderer.getContext(),
    dbg = gl.getExtension('WEBGL_debug_renderer_info');
  let px = '?';
  try {
    const s = signs[0],
      d = s.cv.getContext('2d').getImageData(s.cv.width >> 1, s.cv.height >> 1, 1, 1).data;
    px = [...d].join(',');
  } catch (e) {
    px = 'ERR ' + e.name;
  }
  const t = signs[0] && signs[0].t,
    tex = t
      ? t.isDataTexture
        ? 'data ' +
          t.image.width +
          'x' +
          t.image.height +
          ' sum=' +
          t.image.data.slice(0, 4000).reduce((a, b) => a + b, 0)
        : 'canvas'
      : 'none';
  const el = document.createElement('pre');
  el.style.cssText =
    'position:fixed;z-index:99;left:8px;right:8px;bottom:8px;max-height:45vh;overflow:auto;background:#fff;color:#000;font:11px/1.3 monospace;padding:8px;white-space:pre-wrap;direction:ltr;text-align:left';
  el.textContent = [
    'UA ' + navigator.userAgent,
    'GL ' +
      (dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) +
      ' webgl2=' +
      renderer.capabilities.isWebGL2,
    'maxTex ' + renderer.capabilities.maxTextureSize,
    'sign px ' + px,
    'tex ' + tex,
    'errors:',
    ...__errs.slice(-12),
  ].join('\n');
  document.body.appendChild(el);
}
