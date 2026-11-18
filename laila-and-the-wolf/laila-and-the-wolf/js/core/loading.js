import { CH } from '../content/chapters.js';
import { UIT } from '../content/texts.js';
import { LANG, NUM } from './config.js';

const pops = [...document.querySelectorAll('.pop i')];
const pcts = document.querySelectorAll('.pct');
let shownPct = 0,
  realPct = 0;
export function setPct(p) {
  realPct = Math.max(realPct, p);
}
export function tickPct() {
  shownPct += (realPct - shownPct) * 0.12 + (realPct > shownPct ? 0.25 : 0);
  shownPct = Math.min(shownPct, realPct);
  const v = Math.round(shownPct);
  pcts.forEach(e => (e.textContent = UIT[LANG].folding + NUM(String(v).padStart(3, '0'))));
  const n = Math.floor((v / 100) * 6 + 0.001);
  pops.forEach((e, i) => {
    e.classList.toggle('up', i < n);
    e.style.background = CH[i].wall;
  });
}
export const frameWait = () => new Promise(r => requestAnimationFrame(() => r()));
export const fontsP = Promise.all([
  document.fonts.load('600 60px "Pixelify Sans"'),
  document.fonts.load('700 40px "Gaegu"'),
  document.fonts.load('700 60px "Reem Kufi"'),
  document.fonts.load('400 40px "Marhey"'),
  document.fonts.load('700 40px "Marhey"'),
]).catch(() => {});
export const patient = (p, ms = 5000) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
