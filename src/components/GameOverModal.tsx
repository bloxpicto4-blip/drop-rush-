import React from 'react';
import { GameStats } from '../game/types';
import { RotateCcw, Home, Trophy, Award, ShieldAlert, Sparkles, Phone } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface GameOverModalProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onPlayAgain,
  onMainMenu,
}) => {
  const isNewRecord = stats.score >= stats.highScore && stats.score > 0;

  const handlePlayAgain = () => {
    soundEngine.playButtonSound();
    onPlayAgain();
  };

  const handleMainMenu = () => {
    soundEngine.playButtonSound();
    onMainMenu();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 z-50 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
        {/* Banner */}
        <div className="mb-4">
          <div className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">
            Out of Hearts
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
            GAME OVER
          </h2>
        </div>

        {/* New Record Callout */}
        {isNewRecord && (
          <div className="w-full bg-amber-500/15 border border-amber-500/40 rounded-xl py-2 px-3 mb-4 flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" />
            New Personal Best Score!
          </div>
        )}

        {/* Score Card */}
        <div className="w-full grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Final Score
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tabular-nums mt-0.5">
              {stats.score.toString().padStart(4, '0')}
            </span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Best Score
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-200 font-mono tabular-nums mt-0.5">
              {stats.highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6 text-left flex flex-col gap-2 text-xs sm:text-sm">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-sky-400" />
              Stage Reached
            </span>
            <span className="font-bold font-mono">
              Stage {stats.stageNumber} · Cycle {stats.cycle} ({stats.difficultyTier})
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Items Collected</span>
            <span className="font-bold font-mono">{stats.itemsCollected}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Hazards Avoided
            </span>
            <span className="font-bold font-mono">{stats.hazardsAvoided}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Mechanics Survived</span>
            <span className="font-bold font-mono text-purple-400">{stats.mechanicsSurvived}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Max Combo</span>
            <span className="font-bold font-mono text-amber-400">
              {stats.maxCombo > 1 ? `${stats.maxCombo}x Streak` : '1x'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={handlePlayAgain}
            className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black text-base tracking-wider uppercase rounded-xl shadow-lg transition-transform flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            <RotateCcw className="w-5 h-5" />
            PLAY AGAIN
          </button>

          <button
            onClick={handleMainMenu}
            className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold text-sm tracking-wide uppercase rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
