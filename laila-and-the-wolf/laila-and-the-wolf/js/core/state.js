export const state = {
  rest: 0,
  snap: null,
  target: 0,
  cur: 0,
  vel: 0,
  lastInput: -9,
  drag: null,
  introT: -1,
  open: false,
  hover: null,
  mx: -1,
  my: 0,
  px: 0,
  py: 0,
  moved: false,
  card: false,
  colo: false,
};
export const zoom = { i: 0, f: 1 };
export const win = { wr: innerWidth < 760 ? 92 : 118, wy: innerWidth < 760 ? 0.27 : 0.31 };
export const clueFound = [false, false, false, false, false, false];
