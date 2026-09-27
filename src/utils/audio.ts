/**
 * Synthesized audio sound effects using the Web Audio API.
 * High-fidelity, zero-latency physical card game audio:
 * - Unique realistic multi-card riffle shuffle with deck squaring
 * - Distinct tactile wooden-felt card 'clack' on placement
 */

class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private noiseBuffer: AudioBuffer | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Pre-generates a reusable 1-second white noise buffer for friction & flutter effects
   */
  private getNoiseBuffer(): AudioBuffer | null {
    if (this.noiseBuffer) return this.noiseBuffer;
    if (!this.ctx) return null;

    const bufferSize = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * Unique Multi-Card Riffle Shuffle Sound Effect
   * Simulates realistic cascading card leaves fluttering together,
   * followed by the bridge release and deck squaring tap on the table.
   */
  public playShuffle() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const noise = this.getNoiseBuffer();

      // 1. Cascading Riffle Flutter (18 rapid interleaved card-leaf clicks)
      let timeOffset = 0;
      const leafCount = 18;
      for (let i = 0; i < leafCount; i++) {
        const leafTime = now + timeOffset;

        // Individual card-edge flick
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Shifting frequencies simulate varying card heights in the riffle
        const baseFreq = 850 + Math.random() * 600 + (i * 25);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, leafTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, leafTime + 0.022);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(baseFreq * 1.5, leafTime);
        filter.Q.value = 4.0;

        const leafVol = 0.04 + (i / leafCount) * 0.06; // grows slightly louder towards middle
        gain.gain.setValueAtTime(leafVol, leafTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, leafTime + 0.022);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(leafTime);
        osc.stop(leafTime + 0.022);

        // Accelerated riffle rhythm
        timeOffset += 0.025 - (i * 0.0006);
      }

      // 2. The "Bridge" / "Waterfall" swoosh of cards springing together
      if (noise) {
        const bridgeTime = now + timeOffset + 0.02;
        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noise;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(2800, bridgeTime);
        noiseFilter.frequency.exponentialRampToValueAtTime(1100, bridgeTime + 0.22);
        noiseFilter.Q.value = 2.5;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, bridgeTime);
        noiseGain.gain.linearRampToValueAtTime(0.14, bridgeTime + 0.08);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, bridgeTime + 0.22);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseNode.start(bridgeTime);
        noiseNode.stop(bridgeTime + 0.22);
      }

      // 3. Final Satisfying Table Tap / Squaring the Deck
      const tapTime = now + timeOffset + 0.24;
      const tapOsc = ctx.createOscillator();
      const tapGain = ctx.createGain();

      tapOsc.type = 'sine';
      tapOsc.frequency.setValueAtTime(260, tapTime);
      tapOsc.frequency.exponentialRampToValueAtTime(90, tapTime + 0.06);

      tapGain.gain.setValueAtTime(0.22, tapTime);
      tapGain.gain.exponentialRampToValueAtTime(0.001, tapTime + 0.06);

      tapOsc.connect(tapGain);
      tapGain.connect(ctx.destination);

      tapOsc.start(tapTime);
      tapOsc.stop(tapTime + 0.06);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Distinct Tactile 'Clack' Sound Effect
   * Triggered when a card is placed onto the felt board.
   * Features:
   * - Sharp contact attack transient
   * - Resonant wooden table body 'thud'
   * - Subtle card edge friction release
   */
  public playCardClack() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Layer 1: High-impact strike transient (the sharp 'cl' of the clack)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      const clickFilter = ctx.createBiquadFilter();

      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1750, now);
      clickOsc.frequency.exponentialRampToValueAtTime(320, now + 0.018);

      clickFilter.type = 'highpass';
      clickFilter.frequency.setValueAtTime(800, now);

      clickGain.gain.setValueAtTime(0.35, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      clickOsc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.02);

      // Layer 2: Resonant table body tap (the deep 'ack' of the clack)
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();

      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(340, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(110, now + 0.055);

      bodyGain.gain.setValueAtTime(0.28, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.055);

      // Layer 3: Felt surface friction tail
      const noise = this.getNoiseBuffer();
      if (noise) {
        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noise;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(2600, now);
        noiseFilter.Q.value = 3.0;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseNode.start(now);
        noiseNode.stop(now + 0.035);
      }
    } catch {
      // Audio fallback
    }
  }

  // Alias for backward compatibility
  public playCardSnap() {
    this.playCardClack();
  }

  public playCardDeal() {
    this.playShuffle();
  }

  public playPassSound() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.2);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore audio failure
    }
  }

  public playInvalid() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(110, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore audio failure
    }
  }

  public playWin() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + i * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.16, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {
      // Ignore audio failure
    }
  }

  public playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore audio failure
    }
  }
}

export const sounds = new SoundController();
