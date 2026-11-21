// Twin Scenes — every sound the game makes, synthesized with the Web Audio
// API so the game ships no audio files: a bright chime for a find, a low
// buzz for a miss, a rising arpeggio for a cleared level, and a soft tick
// for a hint. Created lazily on the first user gesture, muted with M.
let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

function ctx() {
  if (audioCtx === null) {
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

/** One short oscillator note: frequency, start delay, length, shape, gain. */
function note(freq, delay, length, type, gainValue) {
  if (muted) return;
  const ac = ctx();
  if (ac === null) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + delay;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(gainValue, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t);
  osc.stop(t + length + 0.05);
}

/** Two-note chime, the reward for finding a difference. */
export function playFound() {
  note(660, 0, 0.18, 'sine', 0.22);
  note(990, 0.07, 0.28, 'sine', 0.2);
}

/** A dull low buzz for a wrong click. */
export function playMiss() {
  note(160, 0, 0.22, 'sawtooth', 0.1);
  note(110, 0.05, 0.25, 'sawtooth', 0.08);
}

/** A rising arpeggio for a cleared level. */
export function playLevelClear() {
  [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.09, 0.3, 'triangle', 0.2));
}

/** A soft tick when a hint is spent. */
export function playHint() {
  note(880, 0, 0.12, 'sine', 0.12);
}

/** A single click for buttons and level tabs. */
export function playClick() {
  note(520, 0, 0.06, 'square', 0.06);
}
