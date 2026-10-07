/* The cookie jar: real physics with matter-js, drawn on a canvas with our illustrated cookies. */
import Matter from 'matter-js';
import { cookieSVG, LOOKS, type CookieLook } from '../lib/cookie';

type Deps = { reduced: boolean; fine: boolean; sound: { pop(): void; crunch(): void }; gsap: typeof import('gsap').gsap };

const { Engine, Bodies, Composite, Body, Query, Constraint, Sleeping } = Matter;

export function initJar({ reduced, sound, gsap }: Deps) {
  const stage = document.getElementById('jar-stage')!;
  const canvas = document.getElementById('jar-canvas') as HTMLCanvasElement;
  const countEl = document.getElementById('jar-count')!;
  const hint = document.querySelector<HTMLElement>('.jar__hint');
  const ctx = canvas.getContext('2d')!;
  const touchFirst = matchMedia('(pointer: coarse)').matches;
  if (touchFirst && hint) hint.textContent = hint.dataset.hintTouch ?? hint.textContent;

  // pre-render a few variants of every cookie as images
  const sprites: HTMLImageElement[] = [];
  LOOKS.forEach((look: CookieLook, li) => {
    for (let s = 0; s < 2; s++) {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(cookieSVG(look, 40 + li * 3 + s, { id: `jar-${look}-${s}`, shadow: false }));
      sprites.push(img);
    }
  });

  const engine = Engine.create({ enableSleeping: true });
  engine.gravity.y = 1.1;
  let W = 0, H = 0, dpr = 1, unit = 1;
  let walls: Matter.Body[] = [];
  const cookies: (Matter.Body & { sprite?: HTMLImageElement; r?: number })[] = [];
  const MAX = 36;

  const updateCount = () => (countEl.textContent = String(cookies.length));

  function build() {
    const rect = stage.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    unit = W / 400;
    Composite.remove(engine.world, walls);
    const sx = W / 400, sy = H / 480, t = 60;
    const o = { isStatic: true, friction: 0.4, restitution: 0.2 };
    // a thick wall lying along a line, pushed outward so its inner face sits on the line
    const slab = (x1: number, y1: number, x2: number, y2: number, side: number) => {
      const len = Math.hypot(x2 - x1, y2 - y1) + t;
      const ang = Math.atan2(y2 - y1, x2 - x1);
      const nx = Math.sin(ang) * side * (t / 2), ny = -Math.cos(ang) * side * (t / 2);
      return Bodies.rectangle((x1 + x2) / 2 - nx, (y1 + y2) / 2 - ny, len, t, { ...o, angle: ang });
    };
    walls = [
      Bodies.rectangle(W / 2, 470 * sy + t / 2, W, t, o), // floor
      Bodies.rectangle(20 * sx - t / 2, 300 * sy, t, H, o), // left
      Bodies.rectangle(380 * sx + t / 2, 300 * sy, t, H, o), // right
      Bodies.rectangle(74 * sx - t / 2, (96 * sy - 800) / 2, t, 96 * sy + 800, o), // neck left (tall so cookies can't escape)
      Bodies.rectangle(326 * sx + t / 2, (96 * sy - 800) / 2, t, 96 * sy + 800, o), // neck right
      slab(20 * sx, 192 * sy, 74 * sx, 96 * sy, -1), // left shoulder
      slab(380 * sx, 192 * sy, 326 * sx, 96 * sy, 1), // right shoulder
    ];
    Composite.add(engine.world, walls);
  }

  function add(x?: number, y?: number) {
    const r = (28 + Math.random() * 14) * unit;
    const b = Bodies.circle(x ?? (130 + Math.random() * 140) * unit, y ?? -r * 2, r, {
      restitution: 0.35,
      friction: 0.25,
      frictionAir: 0.012,
      density: 0.002,
      angle: Math.random() * Math.PI * 2,
    }) as (typeof cookies)[number];
    b.sprite = sprites[Math.floor(Math.random() * sprites.length)];
    b.r = r;
    Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.2);
    Composite.add(engine.world, b);
    cookies.push(b);
    if (cookies.length > MAX) Composite.remove(engine.world, cookies.shift()!);
    updateCount();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (const b of cookies) {
      if (!b.sprite?.complete) continue;
      const r = b.r!;
      ctx.save();
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(b.angle);
      ctx.shadowColor = 'rgba(58,23,12,.25)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.drawImage(b.sprite, -r * 1.08, -r * 1.08, r * 2.16, r * 2.16);
      ctx.restore();
    }
  }

  // pointer: drag & throw (mouse/pen), flick or add (touch)
  let drag: Matter.Constraint | null = null;
  let downAt: { x: number; y: number; t: number; id: number } | null = null;
  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  canvas.addEventListener('pointerdown', (e) => {
    const p = local(e);
    downAt = { ...p, t: performance.now(), id: e.pointerId };
    if (e.pointerType === 'touch') return;
    const hit = Query.point(cookies, p)[0];
    if (hit) {
      Sleeping.set(hit, false);
      drag = Constraint.create({
        pointA: p,
        bodyB: hit,
        pointB: { x: p.x - hit.position.x, y: p.y - hit.position.y },
        stiffness: 0.18,
        damping: 0.08,
        length: 0,
      });
      Composite.add(engine.world, drag);
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
      sound.pop();
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (drag) drag.pointA = local(e);
  });
  const end = (e: PointerEvent) => {
    const p = local(e);
    if (drag) {
      Composite.remove(engine.world, drag);
      drag = null;
      canvas.style.cursor = '';
    } else if (downAt && Math.hypot(p.x - downAt.x, p.y - downAt.y) < 12 && performance.now() - downAt.t < 500) {
      const hit = Query.point(cookies, p)[0];
      if (hit) {
        Sleeping.set(hit, false);
        Body.setVelocity(hit, { x: (Math.random() - 0.5) * 10, y: -14 - Math.random() * 6 });
        Body.setAngularVelocity(hit, (Math.random() - 0.5) * 0.5);
        sound.pop();
      } else {
        add(Math.min(Math.max(p.x, 90 * unit), 310 * unit), Math.min(p.y, 60 * unit));
        sound.pop();
      }
    }
    downAt = null;
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', () => {
    downAt = null;
    if (drag) Composite.remove(engine.world, drag), (drag = null);
  });

  document.getElementById('jar-shake')?.addEventListener('click', () => {
    for (const b of cookies) {
      Sleeping.set(b, false);
      Body.setVelocity(b, { x: (Math.random() - 0.5) * 16, y: -10 - Math.random() * 12 });
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.6);
    }
    sound.crunch();
    if (!reduced)
      gsap.timeline()
        .to(stage, { rotation: -5, duration: 0.07 })
        .to(stage, { rotation: 5, duration: 0.07, yoyo: true, repeat: 5 })
        .to(stage, { rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
  });
  document.getElementById('jar-reset')?.addEventListener('click', () => {
    Composite.remove(engine.world, cookies);
    cookies.length = 0;
    updateCount();
  });

  // loop (paused when off-screen)
  let running = false;
  let lastT = 0;
  let acc = 0;
  const STEP = 1000 / 60;
  const frame = (t: number) => {
    if (!running) return;
    acc += Math.min(t - (lastT || t), 100);
    lastT = t;
    while (acc >= STEP) {
      Engine.update(engine, STEP);
      acc -= STEP;
    }
    draw();
    requestAnimationFrame(frame);
  };
  let dropped = false;
  new IntersectionObserver(([e]) => {
    running = e.isIntersecting;
    if (running) {
      lastT = 0;
      requestAnimationFrame(frame);
      if (!dropped) {
        dropped = true;
        const n = innerWidth < 700 ? 10 : 15;
        for (let i = 0; i < n; i++) setTimeout(() => add(), reduced ? 0 : i * 140);
      }
    }
  }).observe(stage);

  build();
  let lastW = W;
  new ResizeObserver(() => {
    const w = stage.getBoundingClientRect().width;
    if (Math.abs(w - lastW) < 2) return;
    const k = w / lastW;
    lastW = w;
    build();
    // keep the cookies, rescaled
    for (const b of cookies) {
      Body.scale(b, k, k);
      Body.setPosition(b, { x: b.position.x * k, y: b.position.y * k });
      b.r = b.r! * k;
    }
    draw();
  }).observe(stage);
}
