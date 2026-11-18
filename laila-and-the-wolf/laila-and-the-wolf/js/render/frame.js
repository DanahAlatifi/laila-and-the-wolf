import { rnd } from '../paper/textures.js';

const frame = document.getElementById('frame');
export function drawFrame() {
  const d = Math.min(2, devicePixelRatio || 1),
    W = innerWidth,
    Hh = innerHeight;
  frame.width = W * d;
  frame.height = Hh * d;
  const x = frame.getContext('2d');
  x.setTransform(d, 0, 0, d, 0, 0);
  const b = W < 760 ? 7 : 10;
  x.fillStyle = '#efe6d3';
  x.fillRect(0, 0, W, Hh);
  const r = rnd(5),
    pts = [];
  const edge = (x0, y0, x1, y1) => {
    const Ln = Math.hypot(x1 - x0, y1 - y0),
      n = Math.ceil(Ln / 5);
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const j = (r() - 0.5) * 2.6 + Math.sin(i * 0.37) * 0.8;
      pts.push([x0 + (x1 - x0) * t + (y1 === y0 ? 0 : j), y0 + (y1 - y0) * t + (x1 === x0 ? 0 : j)]);
    }
  };
  edge(b, b, W - b, b);
  edge(W - b, b, W - b, Hh - b);
  edge(W - b, Hh - b, b, Hh - b);
  edge(b, Hh - b, b, b);
  x.globalCompositeOperation = 'destination-out';
  x.beginPath();
  pts.forEach(([a, c], i) => (i ? x.lineTo(a, c) : x.moveTo(a, c)));
  x.closePath();
  x.fill();
  x.globalCompositeOperation = 'source-over';
  x.save();
  x.beginPath();
  pts.forEach(([a, c], i) => (i ? x.lineTo(a, c) : x.moveTo(a, c)));
  x.closePath();
  x.clip();
  x.shadowColor = 'rgba(30,15,0,.45)';
  x.shadowBlur = 10;
  x.strokeStyle = 'rgba(0,0,0,1)';
  x.lineWidth = 6;
  x.translate(-W * 3, 0);
  x.shadowOffsetX = W * 3;
  x.beginPath();
  pts.forEach(([a, c], i) => (i ? x.lineTo(a - 2, c - 2) : x.moveTo(a - 2, c - 2)));
  x.closePath();
  x.stroke();
  x.restore();
  x.save();
  x.beginPath();
  x.rect(0, 0, W, Hh);
  pts.forEach(([a, c], i) => (i ? x.lineTo(a, c) : x.moveTo(a, c)));
  x.closePath();
  x.clip('evenodd');
  for (let i = 0; i < (W + Hh) * 1.2; i++) {
    x.fillStyle = `rgba(90,70,40,${r() * 0.12})`;
    const side = r();
    const px = side < 0.5 ? r() * W : r() < 0.5 ? r() * b : W - r() * b,
      py = side < 0.5 ? (r() < 0.5 ? r() * b : Hh - r() * b) : r() * Hh;
    x.fillRect(px, py, 1 + r() * 2, 1);
  }
  x.restore();
}
