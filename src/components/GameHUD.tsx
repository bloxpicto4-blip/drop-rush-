import React from 'react';
import { ActiveAbility, StageDefinition } from '../game/types';
import { Heart, Pause, Timer, Compass } from 'lucide-react';

interface GameHUDProps {
  hearts: number;
  maxHearts: number;
  score: number;
  highScore: number;
  timeRemaining: number;
  transitionProgress: number;
  currentStage: StageDefinition;
  nextStage: StageDefinition | null;
  stageNumber: number;
  activeAbilities: ActiveAbility[];
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  hearts,
  maxHearts,
  score,
  highScore,
  timeRemaining,
  transitionProgress,
  currentStage,
  nextStage,
  stageNumber,
  activeAbilities,
  onPause,
}) => {
  const isTransitioning = transitionProgress > 0;
  const cycleTimePercent = Math.max(0, Math.min(100, ((60 - timeRemaining) / 60) * 100));

  return (
    <div className="absolute top-0 left-0 right-0 p-3 sm:p-5 pointer-events-none z-20 flex flex-col gap-2">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Top-Left: Hearts */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/50 shadow-lg">
          {Array.from({ length: maxHearts }).map((_, idx) => {
            const isFilled = idx < hearts;
            return (
              <div
                key={idx}
                className={`transition-transform duration-300 ${
                  isFilled ? 'scale-100' : 'scale-90 opacity-30 grayscale'
                }`}
              >
                <Heart
                  className={`w-6 h-6 sm:w-7 sm:h-7 ${
                    isFilled
                      ? 'fill-rose-500 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse'
                      : 'text-slate-500'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Top-Center: Score & 60s World Cycle Timer */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-1.5 rounded-xl border border-slate-700/60 shadow-xl flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-400 uppercase">
              Score
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
              {score.toString().padStart(4, '0')}
            </span>
            {highScore > 0 && (
              <span className="hidden md:inline text-xs text-slate-400 font-mono">
                / BEST {highScore.toString().padStart(4, '0')}
              </span>
            )}
          </div>

          {/* 60s World Progress Indicator */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <Timer className={`w-3.5 h-3.5 ${isTransitioning ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
            <div className="w-28 sm:w-36 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40">
              <div
                className={`h-full transition-all duration-200 rounded-full ${
                  isTransitioning ? 'bg-amber-400 animate-pulse' : 'bg-sky-400'
                }`}
                style={{ width: `${cycleTimePercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-300 tabular-nums">
              {Math.ceil(timeRemaining)}s
            </span>
          </div>
        </div>

        {/* Top-Right: Stage & Difficulty Badge + Pause Button */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900/85 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-slate-700/50 shadow-lg text-right">
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-end gap-1">
              <span>STAGE {stageNumber}</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">{currentStage.difficultyTier}</span>
            </div>
            <div
              className="text-xs sm:text-sm font-bold truncate max-w-[100px] sm:max-w-[140px]"
              style={{ color: isTransitioning && nextStage ? nextStage.themeColor : currentStage.themeColor }}
            >
              {isTransitioning && nextStage ? `TRANSFORMING...` : currentStage.name}
            </div>
          </div>

          <button
            onClick={onPause}
            className="pointer-events-auto p-2 sm:p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600/50 shadow-lg transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
            aria-label="Pause game"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Transition Info Pill */}
      {isTransitioning && nextStage && (
        <div className="self-center bg-slate-950/90 border border-amber-500/50 px-3.5 py-1 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            World Morphing: Entering {nextStage.name}
          </span>
        </div>
      )}

      {/* Active Abilities Indicators Row */}
      {activeAbilities.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-0.5 flex-wrap">
          {activeAbilities.map((ab) => {
            const secs = (ab.remaining / 1000).toFixed(1);
            const isInfinite = ab.type === 'SHIELD';
            return (
              <div
                key={ab.type}
                className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md border px-2.5 py-1 rounded-lg shadow-md animate-in fade-in zoom-in duration-200"
                style={{ borderColor: `${ab.color}66` }}
              >
                <span className="text-sm">{ab.icon}</span>
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                  {ab.name}
                </span>
                <span
                  className="text-xs font-mono font-bold tabular-nums"
                  style={{ color: ab.color }}
                >
                  {isInfinite ? 'ACTIVE' : `${secs}s`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
