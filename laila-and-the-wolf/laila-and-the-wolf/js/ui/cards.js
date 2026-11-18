import { CH } from '../content/chapters.js';
import { FINAL, UIT } from '../content/texts.js';
import { LANG, NUM, tr } from '../core/config.js';
import { canvas } from '../core/renderer.js';
import { clueFound, state } from '../core/state.js';
import { propArt } from '../props/prop.js';
import { setHover } from './picking.js';

const cardEl = document.getElementById('card');
export let finalPending = false,
  lastCard = null;
function showCard({ title, body, kicker, color, art }) {
  document.getElementById('cardh').textContent = title;
  document.getElementById('cardp').innerHTML = body.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  document.getElementById('cards').textContent = kicker;
  const el = cardEl.querySelector('.art');
  Object.assign(el.style, { width: art.w + 'px', height: art.h + 'px', backgroundImage: `url(${art.url})` });
  cardEl.querySelector('.half.top').style.setProperty('--cc', color);
  cardEl.classList.add('on');
  cardEl.setAttribute('aria-hidden', 'false');
  state.card = true;
  setHover(null);
  setTimeout(() => cardEl.querySelector('.x').focus({ preventScroll: true }), 50);
}
export function openCard(p) {
  lastCard = p;
  const [title, body] = tr(p.userData.card),
    i = p.userData.bay,
    c = CH[i];
  const kicker = UIT[LANG].chapter(i) + ' · ' + tr(c.n);
  const art = propArt(
    p.userData.name.startsWith('ribbon') ? 'bow' : p.userData.name,
    Math.min(300, innerWidth * 0.62),
    200
  );
  let extra = '';
  if (p.userData.clue != null)
    extra = clueFound.every(Boolean) ? UIT[LANG].all : UIT[LANG].found(NUM(clueFound.filter(Boolean).length));
  showCard({ title, body: body + extra, kicker, color: c.wall, art });
  if (p.userData.clue != null && clueFound.every(Boolean) && !window.__finalShown) finalPending = true;
}
export function openFinal() {
  lastCard = 'final';
  window.__finalShown = true;
  const [title, body] = tr(FINAL);
  showCard({ title, body, kicker: UIT[LANG].end, color: '#1f3d2b', art: propArt('laila_happy', 200, 200) });
}
export function closeCard() {
  if (!state.card) return;
  cardEl.classList.remove('on');
  cardEl.setAttribute('aria-hidden', 'true');
  state.card = false;
  canvas.focus({ preventScroll: true });
  if (finalPending) {
    finalPending = false;
    setTimeout(openFinal, 500);
  }
}
cardEl.querySelector('.x').addEventListener('click', closeCard);
cardEl.querySelector('.scrim').addEventListener('click', closeCard);
