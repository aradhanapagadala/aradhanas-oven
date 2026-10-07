/* Tiny synthesized sounds — no audio files. Off until the bell button is pressed. */
let ctx: AudioContext | null = null;
let on = false;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.18, when = 0, slideTo?: number) {
  const c = ac();
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur * 0.6);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sound = {
  get enabled() {
    return on;
  },
  set(v: boolean) {
    on = v;
    if (v) ac();
    try {
      localStorage.setItem('ao-sound', v ? '1' : '0');
    } catch {}
  },
  saved() {
    try {
      return localStorage.getItem('ao-sound') === '1';
    } catch {
      return false;
    }
  },
  ding() {
    if (!on) return;
    tone(1568, 1.4, 'sine', 0.16);
    tone(2093, 1.1, 'sine', 0.08, 0.005);
    tone(3136, 0.5, 'triangle', 0.03, 0.01);
  },
  pop() {
    if (!on) return;
    tone(520, 0.12, 'sine', 0.14, 0, 980);
  },
  crunch() {
    if (!on) return;
    const c = ac();
    for (let k = 0; k < 2; k++) {
      const len = 0.09;
      const buf = c.createBuffer(1, c.sampleRate * len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2;
      const src = c.createBufferSource();
      src.buffer = buf;
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1400 + Math.random() * 1200;
      bp.Q.value = 0.8;
      const g = c.createGain();
      g.gain.value = 0.5;
      src.connect(bp).connect(g).connect(c.destination);
      src.start(c.currentTime + k * 0.06);
    }
  },
};
