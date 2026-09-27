import React from 'react';
import { Play, BookOpen, Settings as SettingsIcon, Trophy, Sparkles, Phone } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface TitleMenuProps {
  onPlay: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  highScore: number;
}

export const TitleMenu: React.FC<TitleMenuProps> = ({
  onPlay,
  onOpenGuide,
  onOpenSettings,
  highScore,
}) => {
  const handlePlayClick = () => {
    soundEngine.playButtonSound();
    onPlay();
  };

  const handleGuideClick = () => {
    soundEngine.playButtonSound();
    onOpenGuide();
  };

  const handleSettingsClick = () => {
    soundEngine.playButtonSound();
    onOpenSettings();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 z-40 bg-slate-950/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center flex flex-col items-center">
        {/* Game Title */}
        <div className="relative mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Endless 2D Arcade
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-sans">
            DROP <span className="text-amber-400">RUSH</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Survive the skies · Travel endless worlds
          </p>
        </div>

        {/* High Score Card */}
        {highScore > 0 && (
          <div className="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl px-4 py-2.5 mb-6 flex items-center justify-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Personal Record
              </div>
              <div className="text-lg font-black text-amber-300 font-mono tabular-nums leading-none">
                {highScore.toString().padStart(4, '0')} PTS
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          {/* PLAY Button */}
          <button
            onClick={handlePlayClick}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-slate-950 font-black text-lg tracking-wider uppercase rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            PLAY NOW
          </button>

          <div className="grid grid-cols-2 gap-3 mt-1">
            {/* Guide Button */}
            <button
              onClick={handleGuideClick}
              className="py-3 px-4 bg-slate-800/80 hover:bg-slate-700/80 active:scale-98 text-slate-200 font-bold text-xs sm:text-sm tracking-wide uppercase rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              STAGE GUIDE
            </button>

            {/* Settings Button */}
            <button
              onClick={handleSettingsClick}
              className="py-3 px-4 bg-slate-800/80 hover:bg-slate-700/80 active:scale-98 text-slate-200 font-bold text-xs sm:text-sm tracking-wide uppercase rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 text-purple-400" />
              SETTINGS
            </button>
          </div>
        </div>

        {/* Desktop Controls Hint */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <span>Move: <strong className="text-slate-300">A / D</strong> or <strong className="text-slate-300">← / →</strong></span>
          <span>·</span>
          <span>Jump: <strong className="text-slate-300">Space</strong> or <strong className="text-slate-300">W / ↑</strong></span>
        </div>

        {/* Developer Credit & Contact */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 w-full text-center">
          <p className="text-xs text-slate-300 font-medium">
            Designed and Developed by <strong className="text-amber-400 font-bold tracking-wide">Abdo Saad</strong>
          </p>
          <a
            href="tel:01220935873"
            className="inline-flex items-center justify-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 hover:text-amber-300 transition-all pointer-events-auto shadow-xs active:scale-95"
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
