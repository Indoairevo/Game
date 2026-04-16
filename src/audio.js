export class AudioManager {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.unlocked = false;
    this.masterGain = null;
  }

  ensureContext() {
    if (!this.context) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) {
        this.enabled = false;
        return null;
      }
      this.context = new Ctx();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.25;
      this.masterGain.connect(this.context.destination);
    }
    return this.context;
  }

  async unlock() {
    const ctx = this.ensureContext();
    if (!ctx || this.unlocked) return;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    this.unlocked = true;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  tone({ frequency, duration, type = "sine", gain = 0.08, attack = 0.002, release = 0.08, detune = 0 }) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.unlocked) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune;

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(gain, now + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration + release + 0.01);
  }

  playBreak() {
    this.tone({ frequency: 170, duration: 0.04, type: "square", gain: 0.065, release: 0.05 });
    this.tone({ frequency: 110, duration: 0.05, type: "triangle", gain: 0.05, release: 0.08, detune: -12 });
  }

  playPlace() {
    this.tone({ frequency: 260, duration: 0.03, type: "triangle", gain: 0.055, release: 0.06 });
    this.tone({ frequency: 390, duration: 0.02, type: "sine", gain: 0.03, release: 0.04 });
  }

  playJump() {
    this.tone({ frequency: 300, duration: 0.035, type: "square", gain: 0.05, release: 0.05 });
  }

  playMobHit() {
    this.tone({ frequency: 220, duration: 0.045, type: "sawtooth", gain: 0.07, release: 0.09 });
    this.tone({ frequency: 140, duration: 0.05, type: "triangle", gain: 0.04, release: 0.1, detune: -20 });
  }
}
