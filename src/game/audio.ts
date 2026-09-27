/**
 * Audio Engine for Drop Rush using HTML5 Web Audio API.
 * Synthesizes procedural retro/modern arcade music loops and SFX without external audio files.
 */

import { AudioSettings } from './types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private currentStageIndex: number = 1;
  private musicStep: number = 0;
  private musicIntervalId: number | null = null;
  
  public settings: AudioSettings = {
    sfxEnabled: true,
    musicEnabled: true,
    sfxVolume: 0.65,
    musicVolume: 0.45,
  };

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem('drop_rush_audio_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
  }

  public saveSettings() {
    try {
      localStorage.setItem('drop_rush_audio_settings', JSON.stringify(this.settings));
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.setValueAtTime(
          this.settings.musicEnabled ? this.settings.musicVolume : 0,
          this.ctx.currentTime
        );
      }
      if (this.sfxGain && this.ctx) {
        this.sfxGain.gain.setValueAtTime(
          this.settings.sfxEnabled ? this.settings.sfxVolume : 0,
          this.ctx.currentTime
        );
      }
    } catch {
      // ignore
    }
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.settings.musicEnabled ? this.settings.musicVolume : 0;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.settings.sfxEnabled ? this.settings.sfxVolume : 0;
      this.sfxGain.connect(this.ctx.destination);
    } catch {
      // Web Audio not supported
    }
  }

  public resumeContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ---- Sound Effects ----

  public playCoinSound(combo: number = 0) {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // Scale pitch up slightly with combo
    const pitchBase = 587.33 * Math.min(1.8, 1 + combo * 0.08); // D5
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitchBase, now);
    osc.frequency.exponentialRampToValueAtTime(pitchBase * 1.5, now + 0.08);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playSpecialCoinSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // 3 pleasant ascending notes
    const notes = [659.25, 880, 1174.66]; // E5, A5, D6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.045;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  public playAbilitySound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // Fast ascending glissando / arpeggio
    const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    freqs.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.04;
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  public playHitSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // Crunchy noise + low thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
    
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  public playShieldBreakSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // Glass shatter sparkle
    const freqs = [1200, 1600, 900, 2200, 600];
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.02;
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.2);
      
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.27);
    });
  }

  public playShieldActivateSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playFreezeSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // Low time warp + crystalline chime
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.4);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  public playSpeedSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playMagnetSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.25);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playJumpSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.15);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playStageClearSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // Triumphant chord fanfare: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.09;
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.48);
    });
  }

  public playGameOverSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // Minor descent
    const notes = [440, 415.30, 392, 349.23, 261.63];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.15;
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  public playButtonSound() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.05);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playWarningBeep() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // 2 short urgent beeps
    [0, 0.1].forEach((delay) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + delay;
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.07);
    });
  }

  public playCarHorn() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    // Dual tone horn: F4 + A4
    [349.23, 440].forEach((freq) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  public playBeesBuzz() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.15);
    osc.frequency.linearRampToValueAtTime(170, now + 0.35);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.42);
  }

  public playWindGust() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  public playMagicHoming() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  public playRumble() {
    if (!this.settings.sfxEnabled || !this.ctx || !this.sfxGain) return;
    this.resumeContext();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
    
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.48);
  }

  // ---- Procedural Stage Music ----

  public startStageMusic(stageNumber: number) {
    this.currentStageIndex = stageNumber;
    if (!this.settings.musicEnabled) return;
    this.resumeContext();
    
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    
    this.musicStep = 0;
    this.isMusicPlaying = true;
    
    // Beats per minute adjusted by stage
    // 120 - 150 BPM
    const bpm = Math.min(150, 120 + ((stageNumber - 1) % 5) * 5);
    const stepTimeMs = (60000 / bpm) / 2; // eighth notes
    
    this.musicIntervalId = window.setInterval(() => {
      this.playMusicStep();
    }, stepTimeMs);
  }

  private playMusicStep() {
    if (!this.isMusicPlaying || !this.settings.musicEnabled || !this.ctx || !this.musicGain) return;
    
    const themeIndex = ((this.currentStageIndex - 1) % 5) + 1;
    const now = this.ctx.currentTime;
    const step = this.musicStep % 16;
    
    // Notes depending on theme
    // Stage 1: City (Pentatonic Funk Pop)
    // Stage 2: Forest (Mystic Celtic Dorian)
    // Stage 3: Snow (Chilled Lydian Bell)
    // Stage 4: Desert (Exotic Phrygian Dominant)
    // Stage 5: Fantasy (Cosmic Aeolian Synth)
    
    let bassFreq = 0;
    let leadFreq = 0;
    let waveType: OscillatorType = 'triangle';
    
    if (themeIndex === 1) {
      // City (C major / A minor upbeat groove)
      const bassPattern = [130.81, 0, 130.81, 146.83, 164.81, 0, 174.61, 196.00];
      const leadPattern = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 440.00, 392.00];
      bassFreq = bassPattern[step % bassPattern.length];
      leadFreq = leadPattern[step % leadPattern.length];
      waveType = 'square';
    } else if (themeIndex === 2) {
      // Forest (Organic wood marimba / D dorian)
      const bassPattern = [146.83, 0, 146.83, 0, 174.61, 0, 220.00, 196.00];
      const leadPattern = [293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 392.00, 440.00];
      bassFreq = bassPattern[step % bassPattern.length];
      leadFreq = leadPattern[step % leadPattern.length];
      waveType = 'sine';
    } else if (themeIndex === 3) {
      // Snow (Sparkling crystals / E lydian)
      const bassPattern = [164.81, 0, 0, 164.81, 220.00, 0, 246.94, 0];
      const leadPattern = [659.25, 739.99, 830.61, 987.77, 830.61, 659.25, 739.99, 659.25];
      bassFreq = bassPattern[step % bassPattern.length];
      leadFreq = leadPattern[step % leadPattern.length];
      waveType = 'triangle';
    } else if (themeIndex === 4) {
      // Desert (Phrygian Arabic Oud feel / D Phrygian dominant)
      const bassPattern = [146.83, 146.83, 0, 155.56, 185.00, 0, 220.00, 155.56];
      const leadPattern = [293.66, 311.13, 369.99, 440.00, 369.99, 311.13, 293.66, 369.99];
      bassFreq = bassPattern[step % bassPattern.length];
      leadFreq = leadPattern[step % leadPattern.length];
      waveType = 'sawtooth';
    } else {
      // Fantasy Night (Mystic cosmic / B minor mysterious)
      const bassPattern = [123.47, 0, 123.47, 146.83, 164.81, 0, 185.00, 146.83];
      const leadPattern = [493.88, 587.33, 739.99, 880.00, 739.99, 587.33, 659.25, 587.33];
      bassFreq = bassPattern[step % bassPattern.length];
      leadFreq = leadPattern[step % leadPattern.length];
      waveType = 'sine';
    }

    // Play bass
    if (bassFreq > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(bassFreq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    // Play melody on alternating/accented steps
    if (leadFreq > 0 && (step % 2 === 0 || step === 7 || step === 15)) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = waveType;
      osc.frequency.setValueAtTime(leadFreq, now);
      gain.gain.setValueAtTime(waveType === 'sawtooth' ? 0.08 : 0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + 0.24);
    }
    
    this.musicStep++;
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  public toggleMusic(): boolean {
    this.settings.musicEnabled = !this.settings.musicEnabled;
    this.saveSettings();
    if (this.settings.musicEnabled) {
      this.startStageMusic(this.currentStageIndex);
    } else {
      this.stopMusic();
    }
    return this.settings.musicEnabled;
  }

  public toggleSfx(): boolean {
    this.settings.sfxEnabled = !this.settings.sfxEnabled;
    this.saveSettings();
    return this.settings.sfxEnabled;
  }
}

export const soundEngine = new SoundEngine();
