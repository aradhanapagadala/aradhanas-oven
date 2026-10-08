import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Lenis from 'lenis';
import { sound } from './sound';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, DrawSVGPlugin);

const html = document.documentElement;
const reduced = html.classList.contains('reduced');
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const rand = gsap.utils.random;

/* ── smooth scroll ─────────────────────────────── */
let lenis: Lenis | null = null;
if (!reduced) {
  // light smoothing: still silky, but the page stops when the wheel/trackpad stops
  lenis = new Lenis({ lerp: 0.2, wheelMultiplier: 1, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

$$('[data-scroll-to]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const target = a.getAttribute('data-scroll-to')!;
    const el = $(target);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }),
);

/* ── sprinkles (click anywhere) ────────────────── */
const SPRINKLE = ['#ff5cb5', '#ffb0d8', '#ad8ff0', '#ffe6b5', '#8fd0ff', '#fff', '#f2873a'];
const layer = $('#sprinkles');
export function sprinkle(x: number, y: number, n = 12, spread = 90) {
  if (reduced || !layer) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i');
    s.style.background = SPRINKLE[i % SPRINKLE.length];
    layer.appendChild(s);
    const a = rand(0, Math.PI * 2);
    const d = rand(spread * 0.4, spread);
    gsap.set(s, { x, y, rotation: rand(0, 360), xPercent: -50, yPercent: -50 });
    gsap
      .timeline({ onComplete: () => s.remove() })
      .to(s, { x: x + Math.cos(a) * d, duration: 0.9, ease: 'power2.out' }, 0)
      .to(s, { y: y + Math.sin(a) * d * 0.7 - 30, duration: 0.35, ease: 'power2.out' }, 0)
      .to(s, { y: `+=${rand(80, 140)}`, duration: 0.6, ease: 'power2.in' }, 0.35)
      .to(s, { rotation: `+=${rand(-360, 360)}`, opacity: 0, duration: 0.95, ease: 'none' }, 0);
  }
}
window.addEventListener('pointerdown', (e) => {
  if ((e.target as Element).closest('canvas, [data-bubble], [data-bite]')) return;
  sprinkle(e.clientX, e.clientY, 10, 70);
});

/* ── cursor label ──────────────────────────────── */
// The real pointer is untouched (styled in CSS). A tiny tag follows it only on playful elements.
function initCursor() {
  const tag = $('#cursor-tag');
  const label = $('#cursor-label');
  if (!fine || !tag || !label) return;
  const tx = gsap.quickTo(tag, 'x', { duration: reduced ? 0 : 0.18, ease: 'power3' });
  const ty = gsap.quickTo(tag, 'y', { duration: reduced ? 0 : 0.18, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    tx(e.clientX + 18);
    ty(e.clientY + 20);
  });
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('[data-cursor]');
    tag.classList.toggle('is-on', !!t);
    if (t) label.textContent = t.dataset.cursor ?? '';
  });
  document.documentElement.addEventListener('pointerleave', () => tag.classList.remove('is-on'));
}

/* ── oven eyes follow the pointer ──────────────── */
function initEyes() {
  const eyes = $$<SVGGElement>('.oven__eyes');
  if (!eyes.length) return;
  const setters = eyes.map((g) => ({ g, x: gsap.quickTo(g, 'x', { duration: 0.4 }), y: gsap.quickTo(g, 'y', { duration: 0.4 }) }));
  window.addEventListener('pointermove', (e) => {
    for (const s of setters) {
      const r = s.g.ownerSVGElement!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.4);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 300);
      s.x((dx / d) * 7 * k);
      s.y((dy / d) * 5 * k);
    }
  });
}

/* ── sound toggle ──────────────────────────────── */
function initSound() {
  const btn = $('#sound-toggle');
  if (!btn) return;
  const apply = (v: boolean) => btn.setAttribute('aria-pressed', String(v));
  apply(false);
  btn.addEventListener('click', () => {
    const v = !sound.enabled;
    sound.set(v);
    apply(v);
    if (v) sound.ding();
  });
}

/* ── nav active state ──────────────────────────── */
function initNav() {
  const links = $$('[data-nav]');
  const blob = $('.nav__blob');
  if (!blob) return;
  let active = links[0];
  const place = () => {
    if (!active) return;
    blob.style.width = `${active.offsetWidth}px`;
    blob.style.transform = `translateX(${active.offsetLeft}px)`;
  };
  const set = (id: string) => {
    const l = links.find((x) => x.dataset.nav === id);
    if (!l || l === active) return;
    links.forEach((x) => x.classList.toggle('is-active', x === l));
    active = l;
    place();
  };
  links[0]?.classList.add('is-active');
  place();
  addEventListener('resize', place);
  document.fonts.ready.then(place);
  for (const l of links) {
    const sec = document.getElementById(l.dataset.nav!);
    if (!sec) continue;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (st) => st.isActive && set(l.dataset.nav!),
    });
  }
}

/* ── preloader ─────────────────────────────────── */
async function preload() {
  const pre = $('#preloader');
  if (!pre) return;
  if (html.classList.contains('no-pre') || reduced) {
    pre.remove();
    return;
  }
  lenis?.stop();
  const temp = $('#pre-temp')!;
  const v = { t: 0 };
  const tl = gsap.timeline();
  tl.to(v, { t: 350, duration: 1.5, ease: 'power2.inOut', onUpdate: () => (temp.textContent = String(Math.round(v.t))) }, 0)
    .to('#pre-bar', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
    .add(() => sound.ding(), 1.5)
    .to('.pre__inner', { y: -40, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 1.55)
    .to('#pre-edge', { attr: { d: 'M0 0H1440V0Q720 150 0 0Z' }, duration: 0.5, ease: 'power2.in' }, 1.6)
    .to(pre, { yPercent: -100, duration: 1, ease: 'power3.inOut' }, 1.75)
    .to('#pre-edge', { attr: { d: 'M0 0H1440V0Q720 0 0 0Z' }, duration: 0.7, ease: 'power2.out' }, 2.3);
  await Promise.race([Promise.all([tl.then(), document.fonts.ready]), new Promise((r) => setTimeout(r, 4500))]);
  pre.remove();
  try {
    sessionStorage.setItem('ao-preheated', '1');
  } catch {}
  lenis?.start();
}

/* ── hero ──────────────────────────────────────── */
function heroIntro() {
  const lines = $$('[data-hero="line"]');
  gsap.set('[data-hero]', { opacity: 1 });
  if (reduced) return;
  const chars = lines.flatMap((l) => SplitText.create(l, { type: 'chars', charsClass: 'ch' }).chars);
  const tl = gsap.timeline({ defaults: { ease: 'back.out(2)' } });
  tl.from(chars, { yPercent: 120, rotation: () => rand(-30, 30), scale: 0.3, opacity: 0, duration: 0.9, stagger: 0.045 }, 0.1)
    .from('[data-hero="o"]', { scale: 0, rotation: -260, duration: 1.4, ease: 'elastic.out(1, 0.5)' }, 0.35)
    .from('[data-hero="hello"]', { y: 30, opacity: 0, duration: 0.7 }, 0)
    .from('.hero__squiggle path', { drawSVG: '0%', duration: 0.9, ease: 'power2.inOut' }, 0.5)
    .from('[data-hero="sub"]', { y: 30, opacity: 0, rotation: 6, duration: 0.7 }, 0.8)
    .from('[data-hero="cta"] > *', { y: 30, opacity: 0, scale: 0.8, duration: 0.7, stagger: 0.1 }, 0.95)
    .from('[data-hero="oven"]', { yPercent: 110, rotation: 25, duration: 1.1, ease: 'elastic.out(1, 0.6)' }, 0.9)
    .from('.hero__float .f', { scale: 0, rotation: () => rand(-90, 90), duration: 0.9, stagger: { each: 0.06, from: 'random' } }, 0.6);
}

function heroMotion() {
  if (reduced) return;
  // ribbon text glides along its path forever
  const tp = $<SVGTextPathElement>('#ribbon-textpath');
  const text = tp?.parentElement as unknown as SVGTextElement | null;
  if (tp && text) {
    const half = text.getComputedTextLength() / 2;
    gsap.fromTo(tp, { attr: { startOffset: 0 } }, { attr: { startOffset: -half }, duration: 40, ease: 'none', repeat: -1 });
  }
  // float stickers drift + bob
  $$('.hero__float .f').forEach((f, i) => {
    gsap.to(f, { yPercent: rand(-18, 18), rotation: `+=${rand(-12, 12)}`, duration: rand(2.4, 4), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.1 });
  });
  gsap.to('[data-hero="oven"]', { y: -10, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  // mouse parallax
  if (fine) {
    const items = $$('.hero [data-depth]').map((el) => ({
      d: parseFloat(el.dataset.depth!),
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
    }));
    window.addEventListener('pointermove', (e) => {
      if (scrollY > innerHeight) return;
      const mx = e.clientX / innerWidth - 0.5, my = e.clientY / innerHeight - 0.5;
      for (const it of items) { it.x(mx * it.d * -44); it.y(my * it.d * -34); }
    });
  }
  // scroll out
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
    .to('.hero__center', { yPercent: 28, scale: 0.92, opacity: 0.2, ease: 'none' }, 0)
    .to('.hero__float', { yPercent: -22, ease: 'none' }, 0)
    .to('.hero__ribbon', { yPercent: 10, ease: 'none' }, 0);
  gsap.to('[data-sky="near"]', { yPercent: -9, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  gsap.to('[data-sky="far"]', { yPercent: -3, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
}

/* ── marquee bands react to scroll speed + direction ── */
function initMarquee() {
  const bands = $$('[data-marquee]').map((b) => ({ track: $('.mq__track', b)!, dir: Number(b.dataset.marquee), pos: rand(-50, 0) }));
  if (!bands.length) return;
  let boost = 0;
  let sign = 1;
  lenis?.on('scroll', (l: Lenis) => {
    boost = Math.min(Math.abs(l.velocity) * 0.25, 7);
    if (l.direction) sign = l.direction;
  });
  const wrap = gsap.utils.wrap(-50, 0);
  gsap.ticker.add((_, dt) => {
    const k = reduced ? 0 : (dt / 1000) * (1.6 + boost);
    for (const b of bands) {
      b.pos = wrap(b.pos - k * b.dir * sign);
      gsap.set(b.track, { xPercent: b.pos });
    }
    boost *= 0.92;
  });
}

/* ── split headings reveal ─────────────────────── */
function initHeadings() {
  if (reduced) return;
  $$('[data-split]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words,chars', charsClass: 'ch' });
    gsap.from(split.chars, {
      yPercent: 110,
      rotation: () => rand(-20, 20),
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(2.2)',
      stagger: 0.03,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}

/* ── about ─────────────────────────────────────── */
function initAbout() {
  const bubbles = $$('[data-bubble]');
  gsap.set('[data-reveal]', { opacity: 1 });
  if (!reduced) {
    gsap.from('[data-reveal="photo"]', {
      opacity: 0, y: 80, rotation: -10, scale: 0.85, duration: 1.2, ease: 'elastic.out(1, 0.7)',
      scrollTrigger: { trigger: '.about', start: 'top 70%' },
    });
    gsap.from('.about__caption path', { drawSVG: '0%', duration: 1, scrollTrigger: { trigger: '.about__caption', start: 'top 90%' } });
    gsap.from(bubbles, {
      scale: 0,
      opacity: 0,
      transformOrigin: (i: number) => (i % 2 ? '100% 100%' : '0% 100%'),
      duration: 0.9,
      ease: 'elastic.out(1, 0.55)',
      stagger: 0.32,
      scrollTrigger: { trigger: '.bubbles', start: 'top 78%' },
      onStart: () => sound.pop(),
    });
    gsap.from('[data-reveal="sign"]', { opacity: 0, x: -30, duration: 0.8, scrollTrigger: { trigger: '.about__sign', start: 'top 92%' } });
  }
  // squishy draggable bubbles that spring home
  Draggable.create(bubbles, {
    type: 'x,y',
    zIndexBoost: true,
    onPress() {
      gsap.to(this.target, { scale: 1.06, duration: 0.25 });
      sound.pop();
    },
    onDrag() {
      gsap.to(this.target, { rotation: gsap.utils.clamp(-14, 14, this.deltaX * 1.6), duration: 0.3 });
    },
    onRelease() {
      gsap.to(this.target, { x: 0, y: 0, rotation: 0, scale: 1, duration: 1.3, ease: 'elastic.out(1, 0.35)' });
    },
  });
}

/* ── bake: pinned scroll story ─────────────────── */
function initBake() {
  const sec = $('#bake');
  if (!sec) return;
  const steps = $$('.step', sec);
  const dots = $$('[data-dot]', sec);
  const tempEl = $('[data-b="temp"]', sec)!;
  const oven = $('#bake-oven')!;
  const q = (n: string) => $(`[data-b="${n}"]`, sec)!;
  const setDot = (i: number) => dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
  setDot(0);
  if (reduced) {
    steps.forEach((s) => gsap.set(s, { autoAlpha: 1, position: 'relative' }));
    return;
  }
  gsap.to(q('whisk'), { rotation: 22, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 90%' });

  const v = { t: 70 };
  const setTemp = () => (tempEl.textContent = String(Math.round(v.t)));
  const door = $('.oven__door', oven)!;
  const dough = $('.oven__dough', oven)!;
  const cookie = $('.oven__cookie', oven)!;
  const glow = $('.oven__glow', oven)!;
  const coil = $('.oven__coil', oven)!;
  const knobs = $$('.oven__knob', oven);
  const eyeOpen = $('.eye-open', oven)!;
  const eyeHappy = $('.eye-happy', oven)!;
  const burst = $$('.burst__p', sec);

  gsap.set(q('tray'), { autoAlpha: 0, x: 80 });
  gsap.set([dough, cookie], { transformOrigin: '50% 50%' });
  gsap.set(dough, { scale: 0 });
  gsap.set(glow, { animation: 'none' });
  gsap.set(q('fly'), { autoAlpha: 0, scale: 0.4, yPercent: 0 });

  let last = 0;
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: sec,
      start: 'top top',
      end: () => `+=${innerHeight * 3.2}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (st) => {
        const i = Math.min(3, Math.floor(st.progress * 4.2));
        if (i !== last) {
          if (i === 3 && st.direction > 0) sound.ding();
          else sound.pop();
          last = i;
          setDot(i);
        }
      },
    },
  });

  const swap = (from: number, to: number, at: number) => {
    tl.to(steps[from], { autoAlpha: 0, y: -30, duration: 0.25 }, at).fromTo(steps[to], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.2);
  };

  // 1 → mix
  tl.to(q('bowl'), { rotation: -6, y: -6, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
    .to(v, { t: 180, duration: 1, onUpdate: setTemp, ease: 'none' }, 0)
    .to(q('mercury'), { scaleY: 0.35, duration: 1, ease: 'none' }, 0);
  // 2 → scoop
  swap(0, 1, 0.9);
  tl.to(q('bowl'), { x: -60, y: 40, rotation: -18, autoAlpha: 0, duration: 0.5 }, 1)
    .to(q('tray'), { autoAlpha: 1, x: 0, duration: 0.5, ease: 'back.out(1.6)' }, 1.1)
    .from('.tray__ball', { scale: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(3)' }, 1.3)
    .to(v, { t: 260, duration: 1, onUpdate: setTemp, ease: 'none' }, 1)
    .to(q('mercury'), { scaleY: 0.6, duration: 1, ease: 'none' }, 1);
  // 3 → bake
  swap(1, 2, 1.9);
  tl.to(q('tray'), { x: '-60%', y: '-90%', scale: 0.5, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 2)
    .to(dough, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, 2.35)
    .to(knobs, { rotation: 140, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.1 }, 2)
    .to(glow, { opacity: 1, duration: 0.6 }, 2.2)
    .to(coil, { opacity: 1, stroke: '#FFB46B', duration: 0.6 }, 2.2)
    .to(q('heat'), { opacity: 1, duration: 0.4 }, 2.3)
    .to(dough, { scale: 1.35, opacity: 0, duration: 0.4 }, 2.6)
    .fromTo(cookie, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4 }, 2.6)
    .to(eyeOpen, { opacity: 0, duration: 0.1 }, 2.7)
    .to(eyeHappy, { opacity: 1, duration: 0.1 }, 2.7)
    .to(v, { t: 350, duration: 0.9, onUpdate: setTemp, ease: 'none' }, 2)
    .to(q('mercury'), { scaleY: 1, duration: 0.9, ease: 'none' }, 2);
  // 4 → share
  swap(2, 3, 2.9);
  tl.to(door, { rotationX: -78, duration: 0.45, ease: 'back.out(1.4)' }, 3)
    .to(q('heat'), { opacity: 0, duration: 0.3 }, 3)
    .to(cookie, { opacity: 0, duration: 0.15 }, 3.25)
    .to(q('fly'), { autoAlpha: 1, scale: 1.6, yPercent: -230, rotation: 360, duration: 0.6, ease: 'back.out(1.5)' }, 3.2)
    .to(q('ding'), { opacity: 1, scale: 1, rotation: -8, duration: 0.35, ease: 'back.out(3)' }, 3.35)
    .to(
      burst,
      {
        opacity: 1,
        x: (i: number) => Math.cos((i / burst.length) * Math.PI * 2) * rand(110, 170),
        y: (i: number) => Math.sin((i / burst.length) * Math.PI * 2) * rand(90, 140),
        rotation: () => rand(-60, 60),
        scale: () => rand(0.8, 1.4),
        duration: 0.5,
        stagger: 0.02,
        ease: 'back.out(2)',
      },
      3.35,
    )
    .to({}, { duration: 0.6 });
}

/* ── menu: cards, tilt, bites, faves ───────────── */
function initMenu() {
  const cards = $$('[data-card]');
  if (!reduced) {
    gsap.set(cards, { opacity: 0, y: 90, rotation: () => rand(-6, 6) });
    ScrollTrigger.batch(cards, {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.75)', stagger: 0.12 }),
    });
    gsap.from('.stamp', { scale: 0, rotation: -120, duration: 1.2, ease: 'elastic.out(1, 0.5)', scrollTrigger: { trigger: '.menu__head', start: 'top 80%' } });
    gsap.from('.order', { y: 80, opacity: 0, rotation: 2, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.order', start: 'top 88%' } });
  }

  if (fine && !reduced) {
    cards.forEach((c) => {
      gsap.set(c, { transformPerspective: 900 });
      const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 6);
        rx(((e.clientY - r.top) / r.height - 0.5) * -6);
      });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  // tap a cookie → take a bite (4 bites and it's gone… then a fresh one pops back)
  $$<HTMLButtonElement>('[data-bite]').forEach((btn) => {
    const bites: string[] = [];
    const crumbs = btn.parentElement!.querySelector<HTMLElement>('.card__crumbs')!;
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const px = (e.clientX || r.left + r.width / 2) - r.left - r.width / 2;
      const py = (e.clientY || r.top + r.height * 0.2) - r.top - r.height / 2;
      const a = Math.atan2(py || -1, px || 0.001);
      const R = r.width / 2;
      const br = R * 0.3;
      // round treats get bitten on the rim; square ones (brownies) on their straight edge
      const reach = btn.dataset.bite === 'square' ? Math.min(1.12, 0.84 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)))) : 0.98;
      const cx = R + Math.cos(a) * R * reach, cy = R + Math.sin(a) * R * reach;
      // three overlapping circles = toothy bite shape
      for (const off of [-0.55, 0, 0.55]) {
        const bx = cx + Math.cos(a + Math.PI / 2) * br * off;
        const by = cy + Math.sin(a + Math.PI / 2) * br * off;
        bites.push(`radial-gradient(circle ${br * (off ? 0.78 : 1)}px at ${bx}px ${by}px, #0000 98%, #000 100%)`);
      }
      const mask = bites.join(',');
      btn.style.setProperty('mask-image', mask);
      btn.style.setProperty('-webkit-mask-image', mask);
      btn.style.setProperty('mask-composite', 'intersect');
      btn.style.setProperty('-webkit-mask-composite', bites.map(() => 'source-in').join(','));
      sound.crunch();
      gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });

      // crumbs
      const box = crumbs.getBoundingClientRect();
      for (let i = 0; i < 9; i++) {
        const c = document.createElement('i');
        Object.assign(c.style, {
          position: 'absolute', left: '0', top: '0', width: `${rand(4, 9)}px`, height: `${rand(4, 8)}px`,
          borderRadius: '40%', background: ['#C98C4A', '#8A4524', '#E9B46A', '#3A1A0E'][i % 4],
        });
        crumbs.appendChild(c);
        const sx = r.left - box.left + cx, sy = r.top - box.top + cy;
        gsap.set(c, { x: sx, y: sy, rotation: rand(0, 90) });
        gsap.to(c, { x: sx + rand(-60, 60), duration: 1, ease: 'power1.out' });
        gsap.to(c, { y: sy + rand(80, 160), rotation: `+=${rand(-200, 200)}`, opacity: 0, duration: 1, ease: 'power2.in', onComplete: () => c.remove() });
      }

      if (bites.length >= 12) {
        bites.length = 0;
        gsap.timeline()
          .to(btn, { scale: 0, rotation: 200, duration: 0.35, ease: 'back.in(2)' })
          .add(() => {
            btn.style.removeProperty('mask-image');
            btn.style.removeProperty('-webkit-mask-image');
            sprinkle(r.left + r.width / 2, r.top + r.height / 2, 16, 110);
            sound.pop();
          })
          .to(btn, { scale: 1, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      }
    });
  });

  // faves (remembered in this browser only)
  const KEY = 'ao-faves';
  let faves: string[] = [];
  try { faves = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch {}
  $$<HTMLButtonElement>('[data-fave]').forEach((b) => {
    const id = b.dataset.fave!;
    b.setAttribute('aria-pressed', String(faves.includes(id)));
    b.addEventListener('click', (e) => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      faves = on ? [...faves, id] : faves.filter((f) => f !== id);
      try { localStorage.setItem(KEY, JSON.stringify(faves)); } catch {}
      if (on) {
        sound.pop();
        const r = b.getBoundingClientRect();
        sprinkle(r.left + r.width / 2, r.top + r.height / 2, 14, 60);
        gsap.fromTo(b, { scale: 0.7 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      }
      e.stopPropagation();
    });
  });
}

/* ── countdown to opening day ─────────────────── */
function initCountdown() {
  const box = $('[data-countdown]');
  if (!box) return;
  const target = new Date(box.dataset.countdown!).getTime();
  if (Number.isNaN(target)) return;
  const nums = Object.fromEntries($$('[data-unit]', box).map((el) => [el.dataset.unit!, el]));
  const tiles = $('.cd__tiles', box)!;
  const label = $('.cd__label', box)!;
  const openMsg = $('.cd__open', box)!;
  const dateEl = $<HTMLTimeElement>('[data-cd-date]', box)!;

  // show the opening time in the visitor's own timezone
  dateEl.textContent = new Date(target)
    .toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    .toLowerCase();

  const shown: Record<string, string> = {};
  const roll = (k: string, v: string) => {
    if (shown[k] === v) return;
    const el = nums[k];
    const first = shown[k] === undefined;
    shown[k] = v;
    const old = el.querySelector('b');
    if (first || reduced || !old) {
      el.innerHTML = `<b>${v}</b>`;
      return;
    }
    const nb = document.createElement('b');
    nb.textContent = v;
    el.appendChild(nb);
    gsap.to(old, { yPercent: -110, opacity: 0, duration: 0.45, ease: 'back.in(1.6)', onComplete: () => old.remove() });
    gsap.fromTo(nb, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'back.out(2)' });
  };

  let done = false;
  const tick = () => {
    const left = Math.max(0, target - Date.now());
    const sec = Math.floor(left / 1000);
    roll('d', String(Math.floor(sec / 86400)).padStart(2, '0'));
    roll('h', String(Math.floor((sec % 86400) / 3600)).padStart(2, '0'));
    roll('m', String(Math.floor((sec % 3600) / 60)).padStart(2, '0'));
    roll('s', String(sec % 60).padStart(2, '0'));
    if (left === 0 && !done) {
      done = true;
      clearInterval(timer);
      tiles.hidden = true;
      label.hidden = true;
      openMsg.hidden = false;
      if (!reduced) {
        gsap.from(openMsg, { scale: 0.4, rotation: -8, opacity: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
        const r = openMsg.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) sprinkle(r.left + r.width / 2, r.top + r.height / 2, 24, 140);
      }
    }
  };
  const timer = setInterval(tick, 1000);
  tick();

  // "add to my calendar" → a tiny .ics file with a reminder 30 minutes before
  $('[data-ics]', box)?.addEventListener('click', (e) => {
    e.stopPropagation();
    const stamp = (t: number) => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//aradhanas oven//orders//EN',
      'BEGIN:VEVENT',
      `UID:orders-open-${target}@aradhanas-oven`,
      `DTSTAMP:${stamp(Date.now())}`,
      `DTSTART:${stamp(target)}`,
      `DTEND:${stamp(target + 60 * 60 * 1000)}`,
      "SUMMARY:aradhana's oven — orders open! 🍪",
      `DESCRIPTION:grab a warm batch before they're gone: ${location.href.split('#')[0]}`,
      `URL:${location.href.split('#')[0]}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      "DESCRIPTION:aradhana's oven opens in 30 minutes!",
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'aradhanas-oven-orders-open.ics' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    sound.ding();
  });

  if (!reduced) {
    gsap.from($$('.cd__tile', box), {
      y: 40, opacity: 0, rotation: () => rand(-14, 14), duration: 0.8, ease: 'back.out(2.2)', stagger: 0.08,
      scrollTrigger: { trigger: box, start: 'top 90%' },
    });
  }
}

/* ── jar (loaded only when you get close) ──────── */
function initJarLazy() {
  const stage = $('#jar-stage');
  if (!stage) return;
  const io = new IntersectionObserver(
    (ents) => {
      if (ents.some((e) => e.isIntersecting)) {
        io.disconnect();
        import('./jar').then((m) => m.initJar({ reduced, fine, sound, gsap, looks: JSON.parse(stage.dataset.looks || '[]') }));
      }
    },
    { rootMargin: '400px 0px' },
  );
  io.observe(stage);
}

/* ── boot ──────────────────────────────────────── */
(async () => {
  initCursor();
  initSound();
  initEyes();
  initMarquee();
  await document.fonts.ready;
  initHeadings();
  initAbout();
  initBake();
  initMenu();
  initCountdown();
  initNav();
  initJarLazy();
  heroMotion();
  const pre = preload();
  // start the hero intro as the curtain lifts
  if ($('#preloader') && !html.classList.contains('no-pre') && !reduced) gsap.delayedCall(1.9, heroIntro);
  else heroIntro();
  await pre;
  html.classList.add('ready');
  ScrollTrigger.refresh();
})();
