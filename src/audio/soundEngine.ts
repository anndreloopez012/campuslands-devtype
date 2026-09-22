import { SwitchProfile } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5;
  private currentProfile: SwitchProfile = 'thocky';
  private comboStreak: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setProfile(profile: SwitchProfile) {
    this.currentProfile = profile;
  }

  public getProfile(): SwitchProfile {
    return this.currentProfile;
  }

  public resetCombo() {
    this.comboStreak = 0;
  }

  public incrementCombo(): number {
    this.comboStreak++;
    if (this.comboStreak % 10 === 0) {
      this.playComboMilestone(this.comboStreak);
    }
    return this.comboStreak;
  }

  public playKeypress() {
    if (this.currentProfile === 'mute' || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    switch (this.currentProfile) {
      case 'clicky':
        this.playCherryBlue(t);
        break;
      case 'thocky':
        this.playGateronBrown(t);
        break;
      case 'cream':
        this.playCreamSwitch(t);
        break;
      case 'arcade':
        this.playArcadeBlip(t);
        break;
      default:
        this.playGateronBrown(t);
        break;
    }
  }

  private playCherryBlue(t: number) {
    if (!this.ctx) return;
    // High crisp click + bottom out noise
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + Math.random() * 200, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.025);

    gain.gain.setValueAtTime(this.volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  private playGateronBrown(t: number) {
    if (!this.ctx) return;
    // Deep thocky pop with low body
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 220 + Math.random() * 30;
    osc.frequency.setValueAtTime(baseFreq * 1.8, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, t + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  private playCreamSwitch(t: number) {
    if (!this.ctx) return;
    // Soft creamy bubble pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480 + Math.random() * 60, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.03);

    gain.gain.setValueAtTime(this.volume * 0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.038);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
  }

  private playArcadeBlip(t: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(580 + (this.comboStreak % 8) * 40, t);
    osc.frequency.setValueAtTime(720, t + 0.015);

    gain.gain.setValueAtTime(this.volume * 0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playError() {
    if (this.currentProfile === 'mute' || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playComboMilestone(combo: number) {
    if (this.currentProfile === 'mute' || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = combo >= 50 ? [523.25, 659.25, 783.99, 1046.50] : [440, 554.37, 659.25];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const noteTime = t + idx * 0.06;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(this.volume * 0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.2);
    });
  }

  public playVictory() {
    if (this.currentProfile === 'mute' || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Uplifting arpeggio C4 - E4 - G4 - C5
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const noteTime = t + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(this.volume * 0.4, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  }
}

export const soundEngine = new SoundEngine();
