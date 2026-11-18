export const D2R = Math.PI / 180,
  TAU = Math.PI * 2;
export const NB = 6,
  R = 3.0,
  H = 3.3,
  HOUT = 2.75,
  T = 0.036,
  TAN = Math.tan(30 * D2R),
  FLOOR = 0.05;
export const html = document.documentElement;
export const PHONE = matchMedia('(pointer:coarse)').matches || Math.min(innerWidth, innerHeight) < 560;
export const PORTRAIT = innerWidth / innerHeight < 0.9;
export const Q = new URLSearchParams(location.search);
export const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
export const SPARK = '#d9363e',
  SPARKD = '#a8222b',
  INK = '#2a2420',
  CREAM = '#f1e7d3',
  SKIN = '#e0a985',
  SKIN2 = '#c9926c',
  GOLD = '#d9b46a',
  RED = '#c8323a';
export let LANG = html.lang === 'en' ? 'en' : 'ar';
export const tr = o => (o && typeof o === 'object' && !Array.isArray(o) && 'ar' in o ? o[LANG] : o);
export const NUM = n => (LANG === 'ar' ? AR(n) : String(n));
export function setLanguage(l) {
  LANG = l;
}
