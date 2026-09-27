import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, Smartphone, Battery, Sparkles, RotateCcw, Sliders, Phone } from 'lucide-react';
import { soundEngine } from '../game/audio';
import { settingsManager } from '../game/settings';
import { GameSettings, ControlPosition, ControlSize, GraphicsQuality, TargetFPS } from '../game/types';

interface SettingsModalProps {
  onClose: () => void;
  onSettingsUpdated: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onSettingsUpdated,
}) => {
  const [settings, setSettings] = useState<GameSettings>(() => settingsManager.load());
  const [activeTab, setActiveTab] = useState<'AUDIO' | 'GRAPHICS' | 'CONTROLS'>('AUDIO');

  const update = (patch: Partial<GameSettings>) => {
    const updated = settingsManager.save(patch);
    setSettings({ ...updated });
    onSettingsUpdated(updated);
  };

  const handleToggleSfx = () => {
    const next = !settings.sfxEnabled;
    soundEngine.settings.sfxEnabled = next;
    soundEngine.saveSettings();
    update({ sfxEnabled: next });
    if (next) soundEngine.playButtonSound();
  };

  const handleToggleMusic = () => {
    const next = !settings.musicEnabled;
    soundEngine.settings.musicEnabled = next;
    soundEngine.saveSettings();
    update({ musicEnabled: next });
    if (next) {
      soundEngine.startStageMusic(1);
    } else {
      soundEngine.stopMusic();
    }
  };

  const handleSfxVol = (val: number) => {
    soundEngine.settings.sfxVolume = val;
    soundEngine.saveSettings();
    update({ sfxVolume: val });
  };

  const handleMusicVol = (val: number) => {
    soundEngine.settings.musicVolume = val;
    soundEngine.saveSettings();
    update({ musicVolume: val });
  };

  const handleReset = () => {
    const def = settingsManager.reset();
    soundEngine.settings.sfxEnabled = def.sfxEnabled;
    soundEngine.settings.musicEnabled = def.musicEnabled;
    soundEngine.settings.sfxVolume = def.sfxVolume;
    soundEngine.settings.musicVolume = def.musicVolume;
    soundEngine.saveSettings();
    setSettings({ ...def });
    onSettingsUpdated(def);
    soundEngine.playButtonSound();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 z-50 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
              Mobile Settings
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playButtonSound();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl my-3 border border-slate-800 text-xs font-bold uppercase">
          <button
            onClick={() => setActiveTab('AUDIO')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'AUDIO' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'
            }`}
          >
            Audio & Haptics
          </button>
          <button
            onClick={() => setActiveTab('GRAPHICS')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'GRAPHICS' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'
            }`}
          >
            Display & Battery
          </button>
          <button
            onClick={() => setActiveTab('CONTROLS')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'CONTROLS' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'
            }`}
          >
            Touch Controls
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-1 text-xs sm:text-sm">
          {activeTab === 'AUDIO' && (
            <>
              {/* Sound Effects */}
              <div className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    {settings.sfxEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                    Sound Effects
                  </span>
                  <button
                    onClick={handleToggleSfx}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      settings.sfxEnabled
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 text-slate-500 border-slate-700'
                    }`}
                  >
                    {settings.sfxEnabled ? 'ON' : 'MUTED'}
                  </button>
                </div>
                {settings.sfxEnabled && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.sfxVolume}
                    onChange={(e) => handleSfxVol(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                  />
                )}
              </div>

              {/* Music */}
              <div className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Music className={`w-4 h-4 ${settings.musicEnabled ? 'text-sky-400' : 'text-slate-500'}`} />
                    Background Music
                  </span>
                  <button
                    onClick={handleToggleMusic}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      settings.musicEnabled
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-slate-900 text-slate-500 border-slate-700'
                    }`}
                  >
                    {settings.musicEnabled ? 'ON' : 'MUTED'}
                  </button>
                </div>
                {settings.musicEnabled && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.musicVolume}
                    onChange={(e) => handleMusicVol(parseFloat(e.target.value))}
                    className="w-full accent-sky-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                  />
                )}
              </div>

              {/* Vibration */}
              <div className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  Haptic Vibration
                </span>
                <button
                  onClick={() => update({ vibrationEnabled: !settings.vibrationEnabled })}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    settings.vibrationEnabled
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-700'
                  }`}
                >
                  {settings.vibrationEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </>
          )}

          {activeTab === 'GRAPHICS' && (
            <>
              {/* Graphics Quality */}
              <div className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Graphics Quality
                  </span>
                  <span className="text-xs text-slate-400">{settings.graphicsQuality}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['LOW', 'MEDIUM', 'HIGH'] as GraphicsQuality[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => update({ graphicsQuality: q })}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        settings.graphicsQuality === q
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target FPS */}
              <div className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-200">
                    Target Frame Rate
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold">{settings.targetFps} FPS</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {([30, 60] as TargetFPS[]).map((fps) => (
                    <button
                      key={fps}
                      onClick={() => update({ targetFps: fps })}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        settings.targetFps === fps
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800'
                      }`}
                    >
                      {fps} FPS
                    </button>
                  ))}
                </div>
              </div>

              {/* Battery Saver */}
              <div className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Battery className="w-4 h-4 text-emerald-400" />
                    Battery Saver Mode
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Locks to 30 FPS and reduces particle counts.
                  </p>
                </div>
                <button
                  onClick={() => update({ batterySaver: !settings.batterySaver })}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    settings.batterySaver
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-700'
                  }`}
                >
                  {settings.batterySaver ? 'ON' : 'OFF'}
                </button>
              </div>
            </>
          )}

          {activeTab === 'CONTROLS' && (
            <>
              {/* Control Size */}
              <div className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-200">
                    Button Size
                  </span>
                  <span className="text-xs text-amber-300">{settings.controlSize}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['SMALL', 'MEDIUM', 'LARGE'] as ControlSize[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => update({ controlSize: s })}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        settings.controlSize === s
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control Opacity */}
              <div className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-200">
                    Button Opacity
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    {Math.round(settings.controlOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={settings.controlOpacity}
                  onChange={(e) => update({ controlOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              {/* Control Position */}
              <div className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-200 block">
                  Layout Position
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['SPLIT', 'INVERTED', 'WIDE'] as ControlPosition[]).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => update({ controlPosition: pos })}
                      className={`py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                        settings.controlPosition === pos
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800'
                      }`}
                    >
                      {pos === 'SPLIT' ? 'Standard' : pos === 'INVERTED' ? 'Inverted' : 'Wide Edges'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Developer Credit & Contact */}
        <div className="pt-2.5 pb-1 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Designed and Developed by <strong className="text-amber-400 font-bold">Abdo Saad</strong>
          </p>
          <a
            href="tel:01220935873"
            className="inline-flex items-center justify-center gap-1.5 mt-1 text-[11px] text-slate-300 hover:text-amber-300 transition-colors pointer-events-auto"
          >
            <Phone className="w-3 h-3 text-amber-400" />
            <span>For contact call</span>
            <span className="font-mono font-bold text-amber-400 underline underline-offset-2">01220935873</span>
          </a>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={handleReset}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={() => {
              soundEngine.playButtonSound();
              onClose();
            }}
            className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
