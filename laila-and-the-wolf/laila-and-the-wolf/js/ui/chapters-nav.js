import { CH } from '../content/chapters.js';
import { UIT } from '../content/texts.js';
import { AR, LANG, tr } from '../core/config.js';
import { state } from '../core/state.js';
import { markTurned, now } from './controls.js';

const tabs = document.getElementById('tabs'),
  chapname = document.getElementById('chapname');
let shownChap = -1;
CH.forEach((c, i) => {
  const bt = document.createElement('button');
  bt.style.background = c.wall;
  bt.onclick = () => goTo(i);
  tabs.appendChild(bt);
});
export function labelTabs() {
  [...tabs.children].forEach((bt, i) => {
    bt.textContent = LANG === 'ar' ? AR(i + 1) : ['I', 'II', 'III', 'IV', 'V', 'VI'][i];
    bt.setAttribute('aria-label', UIT[LANG].chapter(i) + ': ' + tr(CH[i].n));
  });
}
labelTabs();
function goTo(i) {
  const cur = state.target,
    base = Math.round(cur);
  let best = base,
    bd = 99;
  for (let k = base - 6; k <= base + 6; k++)
    if (((k % 6) + 6) % 6 === i && Math.abs(k - cur) < bd) {
      bd = Math.abs(k - cur);
      best = k;
    }
  state.target = best;
  state.rest = best;
  state.lastInput = now();
  markTurned();
}
export function updateChrome() {
  const i = ((Math.round(state.cur) % 6) + 6) % 6;
  if (i === shownChap) return;
  shownChap = i;
  [...tabs.children].forEach((b, j) => b.classList.toggle('on', j === i));
  chapname.innerHTML = `<small>${UIT[LANG].chapter(i)}</small>${tr(CH[i].n)}`;
}
export function resetChapterLabel() {
  shownChap = -1;
}
