import { clueFound } from '../core/state.js';
import { openFinal } from './cards.js';

const slots = [...document.querySelectorAll('#clues .slots i')],
  cluesEl = document.getElementById('clues');
export function findClue(i) {
  if (clueFound[i]) return;
  clueFound[i] = true;
  slots[i].classList.add('on');
  if (clueFound.every(Boolean)) cluesEl.classList.add('done');
}
cluesEl.addEventListener('click', () => {
  if (clueFound.every(Boolean)) openFinal();
});
