import { GameSettings } from './types';

export const DEFAULT_SETTINGS: GameSettings = {
  sfxEnabled: true,
  musicEnabled: true,
  sfxVolume: 0.65,
  musicVolume: 0.45,
  vibrationEnabled: true,
  graphicsQuality: 'HIGH',
  targetFps: 60,
  batterySaver: false,
  controlSize: 'MEDIUM',
  controlOpacity: 0.85,
  controlPosition: 'SPLIT',
};

class SettingsManager {
  public settings: GameSettings = { ...DEFAULT_SETTINGS };

  constructor() {
    this.load();
  }

  public load(): GameSettings {
    try {
      const saved = localStorage.getItem('drop_rush_mobile_settings');
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS };
    }
    return this.settings;
  }

  public save(newSettings: Partial<GameSettings>): GameSettings {
    this.settings = { ...this.settings, ...newSettings };
    if (this.settings.batterySaver) {
      this.settings.targetFps = 30;
      this.settings.graphicsQuality = 'LOW';
    }
    try {
      localStorage.setItem('drop_rush_mobile_settings', JSON.stringify(this.settings));
    } catch {
      // ignore
    }
    return this.settings;
  }

  public reset(): GameSettings {
    this.settings = { ...DEFAULT_SETTINGS };
    try {
      localStorage.removeItem('drop_rush_mobile_settings');
    } catch {
      // ignore
    }
    return this.settings;
  }
}

export const settingsManager = new SettingsManager();
