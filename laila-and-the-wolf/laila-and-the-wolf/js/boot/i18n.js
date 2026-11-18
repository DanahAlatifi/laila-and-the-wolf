window.__T = {
  ar: {
    title: 'ليلى و<i>الذئب</i>',
    doc: 'ليلى والذئب · كتابٌ ورقيّ دوّار',
    markSub: 'كتابٌ ورقيّ دوّار في ستة فصول',
    colo: 'الحكاية كاملة',
    story: window.__STORY.ar,
    coloLabel: 'اقرأ الحكاية كاملة',
    clues: 'الشرائط الحمراء',
    chapters: 'الفصول',
    zoom: 'التكبير',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    hint: '~ مرّر أو اسحب لتقليب الكتاب، والمس الأشياء ~',
    close: 'إغلاق',
    coloClose: 'عُد إلى الكتاب',
    coloH: 'ليلى والذئب<i>:</i> الحكاية كاملة',
    co1: 'عن الكتاب: ستّ صفحات ورقية مربوطة ظهراً لظهر، تنفتح نجمةً من الغرف الصغيرة، كل غرفة فصلٌ من الحكاية. ابحث في الفصول عن <em>الشرائط الستة</em> والمسها لتجمعها.',
    co2: 'في هذه النسخة ليلى ليست خائفة فقط، بل <em>ذكيّة</em>: تترك ستة شرائط حمراء على الطريق. ابحث عنها في الفصول واجمعها كلها.',
    co3: 'كل ما تراه ورق: مقصوصٌ ومطويٌّ ومنصوبٌ بالكود. الشخصيات رُسمت لهذا الكتاب ثم أُعطيت سُمك الورق المقوّى.',
    co4: 'الخطوط: Reem Kufi وMarhey للعربية، وPixelify Sans وGaegu للإنجليزية. والكتاب يُقرأ أيضاً بالإنجليزية من الزرّ في الأعلى.',
    coverK: 'كتابٌ ورقيّ دوّار في ستة فصول',
    coverBy: 'حكايةٌ قديمة، مطويّةٌ من جديد',
    pct: 'جارٍ الطيّ ٠٠٠',
    ready: 'جاهز',
    open: 'فُكّ الشريط وافتح',
    openLabel: 'فُكّ الشريط وافتح الكتاب',
    foot: '~ مرّر أو اسحب لتقليب الصفحات ~',
    cocred: 'اقرأ الحكاية كاملة',
    still: 'هذا الكتاب يدور بتقنية WebGL، وهي غير متاحة في متصفحك الآن.',
    glLabel: 'كتابٌ ورقيّ دوّار في ستة فصول. مرّر أو اسحب أو استخدم الأسهم لتقليبه.',
    langTo: 'English',
    langFrom: 'عربي',
  },
  en: {
    title: 'Laila <i>&amp;</i> the Wolf',
    doc: 'Laila & the Wolf · a paper carousel book',
    markSub: 'a paper carousel book in six chapters',
    colo: 'The whole tale',
    story: window.__STORY.en,
    coloLabel: 'Read the whole tale',
    clues: 'red ribbons',
    chapters: 'Chapters',
    zoom: 'Zoom',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    hint: '~ scroll, drag or swipe to turn the book ~',
    close: 'Close',
    coloClose: 'Back to the book',
    coloH: 'Laila &amp; the Wolf<i>:</i> the whole tale',
    co1: 'About this book: six paper pages tied back to back open into a star of little rooms, one for each chapter. Look for the <em>six ribbons</em> in the chapters and tap them to collect them.',
    co2: 'In this telling Laila is not only scared, she is <em>clever</em>: she leaves six red ribbons along the way. Find them all in the chapters.',
    co3: 'Everything you see is paper: cut, scored and stood up in code. The characters were drawn for this book, then given the thickness of card.',
    co4: 'Set in Pixelify Sans and Gaegu for English, Reem Kufi and Marhey for Arabic. The book reads in Arabic too: use the switch at the top.',
    coverK: 'a carousel book in six chapters',
    coverBy: 'an old tale, folded anew',
    pct: 'FOLDING 000',
    ready: 'READY',
    open: 'Untie &amp; open',
    openLabel: 'Untie the ribbon and open the book',
    foot: '~ scroll, drag or swipe to turn the pages ~',
    cocred: 'read the whole tale',
    still: 'This book turns with WebGL, which is not available in your browser right now.',
    glLabel: 'A paper carousel book in six chapters. Scroll, drag or use the arrow keys to turn it.',
    langTo: 'عربي',
    langFrom: 'English',
  },
};
window.__setLang = function (l) {
  var d = document.documentElement,
    T = window.__T[l],
    i,
    e,
    list;
  d.lang = l;
  d.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.title = T.doc;
  try {
    localStorage.setItem('lw-lang', l);
  } catch (err) {}
  list = document.querySelectorAll('[data-t]');
  for (i = 0; i < list.length; i++) {
    e = list[i];
    e.innerHTML = T[e.getAttribute('data-t')];
  }
  list = document.querySelectorAll('[data-ta]');
  for (i = 0; i < list.length; i++) {
    e = list[i];
    e.setAttribute('aria-label', T[e.getAttribute('data-ta')].replace(/<[^>]+>/g, ''));
  }
  document.getElementById('langTo').textContent = T.langTo;
  document.getElementById('langFrom').textContent = T.langFrom;
  var slots = document.querySelectorAll('#clues .slots i');
  for (i = 0; i < slots.length; i++)
    if (!slots[i].firstChild)
      slots[i].innerHTML =
        '<svg viewBox="0 0 18 14"><path d="M9 6C6 1 1 0 1 4s5 4 8 3c3 1 8 1 8-3s-5-3-8 2zM8 7l-3 7 3-2 1 2 1-2 3 2-3-7z"/></svg>';
  if (!window.__ready) {
    var p = document.querySelectorAll('.pct');
    for (i = 0; i < p.length; i++) p[i].textContent = d.classList.contains('nogl') ? T.ready : T.pct;
  }
  if (window.__onLang) window.__onLang(l);
};
window.__setLang(document.documentElement.lang === 'en' ? 'en' : 'ar');
document.getElementById('lang').addEventListener('click', function () {
  window.__setLang(document.documentElement.lang === 'ar' ? 'en' : 'ar');
});
