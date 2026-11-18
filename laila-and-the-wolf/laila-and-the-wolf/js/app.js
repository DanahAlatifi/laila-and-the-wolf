import { CH } from './content/chapters.js';
import { Q, html } from './core/config.js';
import { fontsP, frameWait, patient, setPct, tickPct } from './core/loading.js';
import { interactive } from './core/registry.js';
import { camera, renderer, scene } from './core/renderer.js';
import { state } from './core/state.js';
import { showDebug } from './debug.js';
import { frameLoop } from './loop.js';
import { makeSpark } from './paper/materials.js';
import { buildTextures } from './paper/textures.js';
import { drawFrame } from './render/frame.js';
import { buildPost, composer } from './render/post.js';
import { buildBook } from './scene/book.js';
import { buildBackdrop, buildDust, buildTable } from './scene/surroundings.js';
import { closeCard, openCard, openFinal } from './ui/cards.js';
import { findClue } from './ui/clues.js';
import { closeColo, openColo } from './ui/colophon.js';
import { setZoom } from './ui/zoom.js';
import './ui/controls.js';
import './ui/language.js';
import './ui/opening.js';
import './ui/viewport.js';

(function pctLoop() {
  tickPct();
  if (!window.__ready) requestAnimationFrame(pctLoop);
})();
(async () => {
  try {
    drawFrame();
    setPct(8);
    await patient(fontsP);
    setPct(20);
    await frameWait();
    buildTextures();
    makeSpark();
    setPct(40);
    await frameWait();
    buildBackdrop();
    buildTable();
    buildDust();
    setPct(55);
    await frameWait();
    buildBook();
    setPct(82);
    await frameWait();
    buildPost();
    setPct(94);
    await frameWait();
    renderer.compile(scene, camera);
    composer.render(0);
    setPct(100);
    window.__fw = {
      state,
      setP: p => {
        state.target = state.cur = p;
        state.rest = Math.round(p);
        state.snap = null;
      },
      camera,
      CH,
      open: () => window.__fwOpen(),
      zoom: setZoom,
      card: n => {
        const m = interactive.find(m => m.userData.pivot.userData.name === n);
        if (m) {
          const p = m.userData.pivot;
          if (p.userData.clue != null) findClue(p.userData.clue);
          openCard(p);
        }
      },
      colo: openColo,
      closeColo,
      closeCard,
      findClue,
      openFinal,
      lang: l => window.__setLang(l),
    };
    setTimeout(() => {
      window.__ready = window.__booted = true;
      html.classList.add('ready');
    }, 650);
    if (Q.has('debug')) setTimeout(showDebug, 1500);
    if (html.classList.contains('nogl')) return;
    requestAnimationFrame(frameLoop);
  } catch (e) {
    console.error(e);
    window.__fwFail && window.__fwFail('build: ' + e.message);
  }
})();
