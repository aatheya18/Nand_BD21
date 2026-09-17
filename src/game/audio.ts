// Tiny WebAudio lo-fi pad + UI pops. No assets, no network — all synthesised.
let ctx: AudioContext | null = null;
let padGain: GainNode | null = null;
let stopPad: (() => void) | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Warm sustained chord that drifts — the lo-fi bed. */
export function startPad() {
  const c = getCtx();
  if (!c || stopPad) return;
  padGain = c.createGain();
  padGain.gain.value = 0;
  padGain.gain.linearRampToValueAtTime(0.05, c.currentTime + 2.5);

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.connect(padGain);
  padGain.connect(c.destination);

  // Fmaj9-ish drifting chord
  const freqs = [174.6, 261.6, 349.2, 440, 523.3];
  const oscs = freqs.map((f, i) => {
    const o = c.createOscillator();
    o.type = i % 2 === 0 ? "sine" : "triangle";
    o.frequency.value = f;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.05 + i * 0.017;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 1.2;
    lfo.connect(lfoGain);
    lfoGain.connect(o.frequency);
    const g = c.createGain();
    g.gain.value = 0.18 / (i + 1);
    o.connect(g);
    g.connect(filter);
    o.start();
    lfo.start();
    return [o, lfo] as const;
  });

  stopPad = () => {
    const now = c.currentTime;
    padGain?.gain.cancelScheduledValues(now);
    padGain?.gain.linearRampToValueAtTime(0, now + 0.8);
    oscs.flat().forEach((o) => o.stop(now + 1));
    stopPad = null;
    padGain = null;
  };
}

export function stopAudio() {
  stopPad?.();
}

/** Soft UI pop / chime. Silent unless the pad is running (i.e. unmuted). */
export function pop(kind: "click" | "chime" = "click") {
  if (!stopPad) return;
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.value = kind === "chime" ? 880 : 520;
  o.frequency.exponentialRampToValueAtTime(kind === "chime" ? 1320 : 660, c.currentTime + 0.12);
  g.gain.value = 0.0001;
  g.gain.exponentialRampToValueAtTime(0.06, c.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.3);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.32);
}
