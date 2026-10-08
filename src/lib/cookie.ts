/* Procedural cookie illustrations.
   cookieSVG('classic', 7) → a unique, deterministic SVG string.
   Works on the server (Astro components) and in the browser (cookie jar). */

export type CookieLook =
  | 'chocchip'
  | 'brownie'
  | 'reeses'
  | 'toffee'
  | 'pumpkinswirl'
  | 'classic'
  | 'peanut'
  | 'strawberry'
  | 'ube'
  | 'pumpkin';

type Recipe = {
  dough: [string, string, string]; // highlight, base, edge
  crumb: string; // texture speckle color
  shape?: 'round' | 'square'; // square = brownie slab
  islands?: { base: string; light: string; shadow: string; step: number }; // crinkle / crackly-top patches
  swirl?: { color: string; light: string }; // marbled spiral
  cups?: number; // chopped peanut butter cup pieces
  fork?: string; // criss-cross fork marks (peanut butter cookies)
  sheen?: boolean; // shiny paper-thin crust (brownies)
  chunks?: { n: number; colors: [string, string]; size: [number, number] };
  candies?: { n: number; colors: string[] };
  chips?: { n: number; color: string; shade: string; size?: number };
  bits?: { n: number; color: string };
  crackle?: { n: number; color: string; width: number };
  sparkle?: { n: number; color: string };
  drizzle?: string;
  salt?: number;
};

export const RECIPES: Record<CookieLook, Recipe> = {
  chocchip: {
    dough: ['#FCDFA4', '#EBB86E', '#BC7D3C'],
    crumb: '#9C6230',
    chips: { n: 13, color: '#3A1A0E', shade: '#5C2E18', size: 8.5 },
    crackle: { n: 4, color: '#A86A33', width: 2.2 },
  },
  brownie: {
    shape: 'square',
    dough: ['#7E4A33', '#5A2E1C', '#33160B'],
    crumb: '#2A1209',
    sheen: true,
    crackle: { n: 11, color: '#2A1209', width: 2.6 },
    chunks: { n: 3, colors: ['#2A1209', '#52291A'], size: [12, 17] },
    salt: 7,
  },
  reeses: {
    dough: ['#F8D49C', '#DCA463', '#A56B34'],
    crumb: '#8E5A2B',
    fork: '#A56B34',
    cups: 5,
    candies: { n: 5, colors: ['#FF7A1A', '#FFC61A', '#7A3B1E'] },
  },
  pumpkinswirl: {
    dough: ['#F9C27F', '#E08A3F', '#B05E22'],
    crumb: '#93491A',
    swirl: { color: '#4A2414', light: '#7A4227' },
    sparkle: { n: 36, color: '#FFF3DA' },
    chips: { n: 5, color: '#3A1A0E', shade: '#6A3A22', size: 5.5 },
  },
  classic: {
    dough: ['#FBD99A', '#E9B46A', '#B97A3A'],
    crumb: '#9C6230',
    chunks: { n: 7, colors: ['#3A1A0E', '#6E3A22'], size: [15, 24] },
    crackle: { n: 4, color: '#A86A33', width: 2.2 },
    salt: 9,
  },
  peanut: {
    dough: ['#F9D7A2', '#DDA766', '#A86F36'],
    crumb: '#8E5A2B',
    candies: { n: 7, colors: ['#FF7A1A', '#FFC61A', '#7A3B1E', '#FF7A1A', '#FFC61A'] },
    chunks: { n: 3, colors: ['#4A2414', '#7A4227'], size: [12, 18] },
    crackle: { n: 3, color: '#A36A35', width: 2 },
  },
  strawberry: {
    dough: ['#FFDCE9', '#F8A9C6', '#D7779C'],
    crumb: '#C9608A',
    chips: { n: 11, color: '#FFF8EE', shade: '#E9D7C6' },
    bits: { n: 9, color: '#D9334F' },
    crackle: { n: 3, color: '#E087AA', width: 2 },
  },
  ube: {
    dough: ['#C6A2EE', '#9563D1', '#6A3EA6'],
    crumb: '#5B2F95',
    islands: { base: '#EFE6FA', light: '#FFFFFF', shadow: '#6A3EA6', step: 31 },
  },
  toffee: {
    dough: ['#E8B97A', '#C98C4A', '#8E5426'],
    crumb: '#7A4520',
    chunks: { n: 5, colors: ['#5A2D17', '#8A4D2C'], size: [13, 20] },
    bits: { n: 12, color: '#F2A93B' },
    crackle: { n: 4, color: '#94582A', width: 2.2 },
    salt: 12,
  },
  pumpkin: {
    dough: ['#F9C27F', '#E08A3F', '#B05E22'],
    crumb: '#93491A',
    sparkle: { n: 60, color: '#FFF3DA' },
    crackle: { n: 6, color: '#A85A25', width: 2.4 },
    drizzle: '#FFF7EA',
  },
};

/* deterministic rng */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(1);

/* smooth closed path through points (catmull-rom → bezier) */
function smooth(pts: [number, number][]) {
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

function blob(r: () => number, cx: number, cy: number, rad: number, wobble: number, n = 22) {
  const pts: [number, number][] = [];
  const phase = r() * 6.28;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = rad + Math.sin(a * 3 + phase) * wobble * 0.6 + (r() - 0.5) * wobble;
    pts.push([cx + Math.cos(a) * k, cy + Math.sin(a) * k]);
  }
  return smooth(pts);
}

/* polar placement with rejection so toppings don't pile up */
function scatter(r: () => number, n: number, maxR: number, minGap: number, taken: [number, number, number][]) {
  const out: [number, number][] = [];
  for (let i = 0, tries = 0; out.length < n && tries < n * 40; tries++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * maxR;
    const x = 100 + Math.cos(a) * d, y = 100 + Math.sin(a) * d;
    if (taken.every(([tx, ty, tr]) => Math.hypot(tx - x, ty - y) > tr + minGap)) {
      out.push([x, y]);
      taken.push([x, y, minGap * 0.6]);
      i++;
    }
  }
  return out;
}

/* rounded, slightly wobbly square (brownie slab) */
function slab(r: () => number, cx: number, cy: number, half: number, wobble: number) {
  const pts: [number, number][] = [];
  const per = 7;
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  for (let c = 0; c < 4; c++) {
    const [ax, ay] = corners[c], [bx, by] = corners[(c + 1) % 4];
    for (let i = 0; i < per; i++) {
      const t = 0.12 + (i / per) * 0.88;
      const x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
      pts.push([cx + x * half + (r() - 0.5) * wobble, cy + y * half + (r() - 0.5) * wobble]);
    }
  }
  return smooth(pts);
}

/* a chopped peanut butter cup: chunky chocolate piece, peanut butter peeking out of the cut */
function pbCup(r: () => number, x: number, y: number, s: number) {
  const rot = r() * 6.28;
  const pts: [number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const a = rot + (i / 5) * Math.PI * 2 + (r() - 0.5) * 0.4;
    const k = s * (0.75 + r() * 0.35);
    pts.push([x + Math.cos(a) * k, y + Math.sin(a) * k * 0.85]);
  }
  const d = 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z';
  const px = x + Math.cos(rot) * s * 0.18, py = y + Math.sin(rot) * s * 0.18;
  return (
    `<path d="${d}" fill="#4A2414" stroke="#4A2414" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="${blob(r, px, py, s * 0.42, s * 0.12, 7)}" fill="#E3AE62"/>` +
    `<path d="${blob(r, px - s * 0.08, py - s * 0.1, s * 0.22, s * 0.06, 6)}" fill="#F2C57E"/>` +
    `<path d="${d}" fill="none" stroke="#7A4227" stroke-width="1.6" stroke-dasharray="1.5 3.5" stroke-linecap="round"/>` +
    `<ellipse cx="${f(x - s * 0.45)}" cy="${f(y - s * 0.5)}" rx="${f(s * 0.2)}" ry="${f(s * 0.08)}" fill="#fff" opacity=".35" transform="rotate(-25 ${f(x)} ${f(y)})"/>`
  );
}

function chunk(r: () => number, x: number, y: number, s: number, [dark, light]: [string, string]) {
  const n = 4 + Math.floor(r() * 2);
  const rot = r() * 6.28;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2 + (r() - 0.5) * 0.5;
    const k = s * (0.65 + r() * 0.45);
    pts.push([x + Math.cos(a) * k, y + Math.sin(a) * k * 0.82]);
  }
  const d = 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z';
  const hx = x - s * 0.25, hy = y - s * 0.3;
  return (
    `<path d="${d}" fill="${dark}" stroke="${dark}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="${light}" transform="translate(${f(hx)} ${f(hy)}) scale(.5) translate(${f(-hx)} ${f(-hy)})" opacity=".55" stroke="${light}" stroke-width="4" stroke-linejoin="round"/>` +
    `<ellipse cx="${f(x - s * 0.3)}" cy="${f(y - s * 0.38)}" rx="${f(s * 0.18)}" ry="${f(s * 0.08)}" fill="#fff" opacity=".35" transform="rotate(-25 ${f(x)} ${f(y)})"/>`
  );
}

export function cookieSVG(look: CookieLook, seed = 1, opts: { id?: string; shadow?: boolean } = {}) {
  const R = RECIPES[look];
  const r = rng(seed * 9301 + look.length * 49297);
  const id = opts.id ?? `ck-${look}-${seed}`;
  const [hi, base, edge] = R.dough;
  const square = R.shape === 'square';
  const outline = square ? slab(r, 100, 100, 82, 4) : blob(r, 100, 100, 88, 7);
  const top = square ? slab(r, 99, 98, 74, 3) : blob(r, 98, 97, 78, 6);
  const taken: [number, number, number][] = [];
  let g = '';

  // crumb speckles
  for (let i = 0; i < 70; i++) {
    const a = r() * 6.28, d = Math.sqrt(r()) * 76;
    g += `<circle cx="${f(100 + Math.cos(a) * d)}" cy="${f(100 + Math.sin(a) * d)}" r="${f(0.6 + r() * 1.6)}" fill="${R.crumb}" opacity="${f(0.15 + r() * 0.25)}"/>`;
  }

  // dough lumps for a hand-scooped, bumpy top
  for (let i = 0; i < 9; i++) {
    const a = r() * 6.28, d = Math.sqrt(r()) * 58;
    const x = 100 + Math.cos(a) * d, y = 100 + Math.sin(a) * d, s = 12 + r() * 14;
    g += `<ellipse cx="${f(x + s * 0.18)}" cy="${f(y + s * 0.22)}" rx="${f(s)}" ry="${f(s * 0.8)}" fill="${edge}" opacity=".16" filter="url(#${id}-soft)"/><ellipse cx="${f(x - s * 0.15)}" cy="${f(y - s * 0.2)}" rx="${f(s * 0.8)}" ry="${f(s * 0.6)}" fill="${hi}" opacity=".35" filter="url(#${id}-soft)"/>`;
  }

  // islands (crinkle sugar / crackly brownie top): blobs on a jittered grid, the gaps become cracks
  if (R.islands) {
    const I = R.islands;
    let p = '';
    const step = I.step;
    for (let gy = 12; gy <= 188; gy += step * 0.88) {
      for (let gx = 12 + ((gy / step) % 2) * (step / 2); gx <= 188; gx += step) {
        const x = gx + (r() - 0.5) * 8, y = gy + (r() - 0.5) * 8;
        const dist = Math.hypot(x - 100, y - 100);
        if (square ? Math.max(Math.abs(x - 100), Math.abs(y - 100)) > 80 : dist > 80) continue;
        const k = !square && dist > 64 ? 0.55 : 1;
        const rad = step * 0.56 * k * (0.86 + r() * 0.24);
        p += `<path d="${blob(r, x + 1.5, y + 2, rad, 4.5, 9)}" fill="${I.shadow}" opacity=".5"/><path d="${blob(r, x, y, rad, 4.5, 9)}" fill="${I.base}"/><path d="${blob(r, x - rad * 0.12, y - rad * 0.16, rad * 0.72, 3, 8)}" fill="${I.light}" opacity="${square ? 0.55 : 1}"/>`;
      }
    }
    g += `<g>${p}</g>`;
  }

  // crackle lines
  if (R.crackle) {
    for (let i = 0; i < R.crackle.n; i++) {
      const a = r() * 6.28, d = 14 + r() * 50;
      let x = 100 + Math.cos(a) * d, y = 100 + Math.sin(a) * d;
      let dir = a + (r() - 0.5) * 2;
      let path = `M${f(x)} ${f(y)}`;
      const segs = 3 + Math.floor(r() * 3);
      for (let s = 0; s < segs; s++) {
        dir += (r() - 0.5) * 1.3;
        const len = 6 + r() * 10;
        const nx = x + Math.cos(dir) * len, ny = y + Math.sin(dir) * len;
        if (Math.hypot(nx - 100, ny - 100) > 74) break;
        path += `Q${f((x + nx) / 2 + (r() - 0.5) * 6)} ${f((y + ny) / 2 + (r() - 0.5) * 6)} ${f(nx)} ${f(ny)}`;
        x = nx; y = ny;
      }
      g += `<path d="${path}" fill="none" stroke="${R.crackle.color}" stroke-width="${R.crackle.width}" stroke-linecap="round" opacity="${R.islands ? 0.95 : 0.55}"/>`;
    }
  }

  if (R.sheen) {
    for (let i = 0; i < 5; i++) {
      const x = 50 + r() * 100, y = 45 + r() * 100, w = 18 + r() * 24;
      g += `<path d="${blob(r, x, y, w, 8, 10)}" fill="#A8775A" opacity="${f(0.16 + r() * 0.14)}" filter="url(#${id}-soft)"/>`;
    }
    g += `<path d="M34 40Q70 30 120 34" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".22"/>`;
  }

  if (R.fork) {
    const ang = r() * 0.6 - 0.3;
    for (const turn of [0, Math.PI / 2]) {
      const a = ang + turn, ca = Math.cos(a), sa = Math.sin(a);
      for (let k = -1.5; k <= 1.5; k++) {
        const off = k * 9 + (turn ? 0 : 0);
        const ox = 100 - sa * off, oy = 100 + ca * off;
        g += `<path d="M${f(ox - ca * 52)} ${f(oy - sa * 52)}L${f(ox + ca * 52)} ${f(oy + sa * 52)}" stroke="${R.fork}" stroke-width="3.6" stroke-linecap="round" opacity=".42"/><path d="M${f(ox - ca * 52)} ${f(oy - sa * 52 - 2)}L${f(ox + ca * 52)} ${f(oy + sa * 52 - 2)}" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".3"/>`;
      }
    }
  }

  if (R.swirl) {
    const phase = r() * 6.28;
    const cx = 100 + (r() - 0.5) * 10, cy = 100 + (r() - 0.5) * 10;
    let d = '';
    for (let t = 0; t <= 1.001; t += 0.012) {
      const th = phase + t * Math.PI * 2 * 1.9;
      const rad = 4 + t * 68 + Math.sin(t * 17 + phase) * 5;
      d += `${t ? 'L' : 'M'}${f(cx + Math.cos(th) * rad)} ${f(cy + Math.sin(th) * rad)}`;
    }
    g += `<g filter="url(#${id}-soft)"><path d="${d}" fill="none" stroke="${R.swirl.color}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/></g><path d="${d}" fill="none" stroke="${R.swirl.color}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/><path d="${d}" fill="none" stroke="${R.swirl.light}" stroke-width="3.5" stroke-linecap="round" opacity=".75" transform="translate(-1.5 -2)"/>`;
  }

  if (R.sparkle) {
    for (let i = 0; i < R.sparkle.n; i++) {
      const a = r() * 6.28, d = Math.sqrt(r()) * 74;
      g += `<circle cx="${f(100 + Math.cos(a) * d)}" cy="${f(100 + Math.sin(a) * d)}" r="${f(0.7 + r() * 1.3)}" fill="${i % 3 ? R.sparkle.color : '#C7783A'}" opacity="${f(0.55 + r() * 0.45)}"/>`;
    }
  }

  if (R.chunks) {
    for (const [x, y] of scatter(r, R.chunks.n, 58, 24, taken)) {
      g += chunk(r, x, y, R.chunks.size[0] + r() * (R.chunks.size[1] - R.chunks.size[0]), R.chunks.colors);
    }
  }

  if (R.cups) {
    for (const [x, y] of scatter(r, R.cups, 56, 30, taken)) g += pbCup(r, x, y, 13 + r() * 4);
  }

  if (R.candies) {
    for (const [i, [x, y]] of scatter(r, R.candies.n, 60, 18, taken).entries()) {
      const c = R.candies.colors[i % R.candies.colors.length];
      const s = 8 + r() * 2.5;
      const rot = r() * 180;
      g += `<g transform="rotate(${f(rot)} ${f(x)} ${f(y)})"><ellipse cx="${f(x)}" cy="${f(y + 1.4)}" rx="${f(s)}" ry="${f(s * 0.86)}" fill="#000" opacity=".18"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(s)}" ry="${f(s * 0.86)}" fill="${c}"/><ellipse cx="${f(x - s * 0.3)}" cy="${f(y - s * 0.35)}" rx="${f(s * 0.38)}" ry="${f(s * 0.2)}" fill="#fff" opacity=".6"/></g>`;
    }
  }

  if (R.chips) {
    for (const [x, y] of scatter(r, R.chips.n, 62, 14, taken)) {
      const s = (R.chips.size ?? 5) + r() * 2.5;
      const rot = r() * 360;
      g += `<g transform="rotate(${f(rot)} ${f(x)} ${f(y)})"><path d="M${f(x)} ${f(y - s * 1.1)}C${f(x + s * 0.5)} ${f(y - s * 0.4)} ${f(x + s * 1.25)} ${f(y + s * 0.2)} ${f(x + s * 0.7)} ${f(y + s * 0.65)}Q${f(x)} ${f(y + s * 1.05)} ${f(x - s * 0.7)} ${f(y + s * 0.65)}C${f(x - s * 1.25)} ${f(y + s * 0.2)} ${f(x - s * 0.5)} ${f(y - s * 0.4)} ${f(x)} ${f(y - s * 1.1)}Z" fill="${R.chips.color}" stroke="${R.chips.shade}" stroke-width="1.2"/><ellipse cx="${f(x - s * 0.25)}" cy="${f(y - s * 0.3)}" rx="${f(s * 0.22)}" ry="${f(s * 0.12)}" fill="#fff" opacity="${R.chips.color.startsWith('#3') ? 0.3 : 0}"/></g>`;
    }
  }

  if (R.bits) {
    for (const [x, y] of scatter(r, R.bits.n, 64, 9, taken)) {
      g += `<path d="${blob(r, x, y, 3 + r() * 2.6, 2.2, 6)}" fill="${R.bits.color}" stroke="${R.bits.color}" stroke-width="1.4" stroke-linejoin="round"/>`;
    }
  }

  if (R.drizzle) {
    // one continuous, slanted back-and-forth drizzle
    const ang = -0.45 + r() * 0.2;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const rot = (u: number, v: number): [number, number] => [100 + u * ca - v * sa, 100 + u * sa + v * ca];
    let v = -62;
    let side = -1;
    let [px, py] = rot(-70, v);
    let d = `M${f(px)} ${f(py)}`;
    while (v < 58) {
      const nv = v + 15 + r() * 9;
      side *= -1;
      const [nx, ny] = rot(side * (62 + r() * 14), nv);
      const [cx, cy] = rot(side * 18 + (r() - 0.5) * 40, (v + nv) / 2 - 10 + (r() - 0.5) * 22);
      d += `Q${f(cx)} ${f(cy)} ${f(nx)} ${f(ny)}`;
      v = nv;
    }
    g += `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 2)"/><path d="${d}" fill="none" stroke="${R.drizzle}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  if (R.salt) {
    for (let i = 0; i < R.salt; i++) {
      const a = r() * 6.28, d = Math.sqrt(r()) * 60;
      const x = 100 + Math.cos(a) * d, y = 100 + Math.sin(a) * d, s = 1.6 + r() * 1.8;
      g += `<path d="M${f(x - s)} ${f(y)}L${f(x)} ${f(y - s)}L${f(x + s)} ${f(y + s * 0.3)}L${f(x + s * 0.2)} ${f(y + s)}Z" fill="#fff" opacity=".9"/>`;
    }
  }

  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="${id}-g" cx="40%" cy="34%" r="70%"><stop offset="0" stop-color="${hi}"/><stop offset=".62" stop-color="${base}"/><stop offset="1" stop-color="${edge}"/></radialGradient><radialGradient id="${id}-gl" cx="34%" cy="26%" r="45%"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><filter id="${id}-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter><clipPath id="${id}-c"><path d="${outline}"/></clipPath></defs>${opts.shadow === false ? '' : `<ellipse cx="104" cy="186" rx="74" ry="9" fill="#3A170C" opacity=".14"/>`}${square ? `<path d="${outline}" fill="#2A1209" transform="translate(0 7)"/>` : ''}<path d="${outline}" fill="${edge}"/><g clip-path="url(#${id}-c)"><path d="${top}" fill="url(#${id}-g)"/>${g}<path d="${outline}" fill="url(#${id}-gl)"/></g><path d="${outline}" fill="none" stroke="${edge}" stroke-width="2.5" opacity=".6"/></svg>`;
}

export const LOOKS = Object.keys(RECIPES) as CookieLook[];
