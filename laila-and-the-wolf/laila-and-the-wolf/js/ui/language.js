import { setLanguage } from '../core/config.js';
import { state } from '../core/state.js';
import { applyDir, bays } from '../scene/book.js';
import { refreshCanvases } from '../scene/signs.js';
import { lastCard, openCard, openFinal } from './cards.js';
import { labelTabs, resetChapterLabel, updateChrome } from './chapters-nav.js';
import { setHover } from './picking.js';
import { measureWin } from './viewport.js';

window.__onLang = function (l) {
  setLanguage(l);
  labelTabs();
  resetChapterLabel();
  updateChrome();
  if (typeof refreshCanvases === 'function' && bays.length) {
    refreshCanvases();
    applyDir();
  }
  if (state.card) {
    if (lastCard === 'final') openFinal();
    else if (lastCard) openCard(lastCard);
  }
  setHover(null);
  measureWin();
};
