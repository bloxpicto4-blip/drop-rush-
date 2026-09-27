import React, { useState } from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music, Phone } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMainMenu,
}) => {
  const [sfxOn, setSfxOn] = useState(soundEngine.settings.sfxEnabled);
  const [musicOn, setMusicOn] = useState(soundEngine.settings.musicEnabled);

  const handleToggleSfx = () => {
    const next = soundEngine.toggleSfx();
    setSfxOn(next);
    if (next) soundEngine.playButtonSound();
  };

  const handleToggleMusic = () => {
    const next = soundEngine.toggleMusic();
    setMusicOn(next);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 z-50 bg-slate-950/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-center flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-6 uppercase">
          Game Paused
        </h2>

        {/* Quick Audio Controls */}
        <div className="w-full grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={handleToggleSfx}
            className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase transition-colors ${
              sfxOn
                ? 'bg-slate-800 text-amber-300 border-slate-600'
                : 'bg-slate-950/60 text-slate-500 border-slate-800'
            }`}
          >
            {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            SFX {sfxOn ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleToggleMusic}
            className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase transition-colors ${
              musicOn
                ? 'bg-slate-800 text-sky-300 border-slate-600'
                : 'bg-slate-950/60 text-slate-500 border-slate-800'
            }`}
          >
            <Music className="w-4 h-4" />
            BGM {musicOn ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => {
              soundEngine.playButtonSound();
              onResume();
            }}
            className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black text-sm tracking-wider uppercase rounded-xl shadow-lg transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            RESUME
          </button>

          <button
            onClick={() => {
              soundEngine.playButtonSound();
              onRestart();
            }}
            className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold text-xs sm:text-sm tracking-wide uppercase rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            RESTART
          </button>

          <button
            onClick={() => {
              soundEngine.playButtonSound();
              onMainMenu();
            }}
            className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold text-xs sm:text-sm tracking-wide uppercase rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            MAIN MENU
          </button>
        </div>

        {/* Developer Credit & Contact */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 w-full text-center">
          <p className="text-xs text-slate-400 font-medium">
            Designed and Developed by <strong className="text-amber-400 font-bold">Abdo Saad</strong>
          </p>
          <a
            href="tel:01220935873"
            className="inline-flex items-center justify-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-xs text-slate-300 hover:text-amber-300 transition-colors pointer-events-auto"
          >
            <Phone className="w-3 h-3 text-amber-400" />
            <span>For contact call</span>
            <span className="font-mono font-bold text-amber-400 underline underline-offset-2">01220935873</span>
          </a>
        </div>
      </div>
    </div>
  );
};
