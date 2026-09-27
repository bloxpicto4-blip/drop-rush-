import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { ControlPosition, ControlSize } from '../game/types';

interface MobileControlsProps {
  onLeftPress: (pressed: boolean) => void;
  onRightPress: (pressed: boolean) => void;
  onJumpPress: (pressed: boolean) => void;
  vibrationEnabled: boolean;
  controlSize: ControlSize;
  controlOpacity: number;
  controlPosition: ControlPosition;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onLeftPress,
  onRightPress,
  onJumpPress,
  vibrationEnabled,
  controlSize,
  controlOpacity,
  controlPosition,
}) => {
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);
  const [jumpActive, setJumpActive] = useState(false);

  const triggerHaptic = () => {
    if (!vibrationEnabled) return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
    } catch {
      // ignore
    }
  };

  // Size classes
  const btnSizeClass =
    controlSize === 'SMALL'
      ? 'w-14 h-14'
      : controlSize === 'LARGE'
      ? 'w-20 h-20 sm:w-22 sm:h-22'
      : 'w-16 h-16 sm:w-18 sm:h-18';

  const jumpSizeClass =
    controlSize === 'SMALL'
      ? 'w-16 h-16'
      : controlSize === 'LARGE'
      ? 'w-22 h-22 sm:w-24 sm:h-24'
      : 'w-18 h-18 sm:w-20 sm:h-20';

  const iconSizeClass =
    controlSize === 'SMALL'
      ? 'w-6 h-6'
      : controlSize === 'LARGE'
      ? 'w-10 h-10'
      : 'w-8 h-8';

  // Base opacity
  const baseAlpha = Math.max(0.2, Math.min(1.0, controlOpacity));

  const leftButton = (
    <button
      type="button"
      onTouchStart={(e) => {
        e.preventDefault();
        setLeftActive(true);
        triggerHaptic();
        onLeftPress(true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        setLeftActive(false);
        onLeftPress(false);
      }}
      onTouchCancel={() => {
        setLeftActive(false);
        onLeftPress(false);
      }}
      onMouseDown={() => {
        setLeftActive(true);
        onLeftPress(true);
      }}
      onMouseUp={() => {
        setLeftActive(false);
        onLeftPress(false);
      }}
      onMouseLeave={() => {
        setLeftActive(false);
        onLeftPress(false);
      }}
      style={{
        opacity: leftActive ? 1.0 : baseAlpha,
      }}
      className={`${btnSizeClass} rounded-2xl border-2 backdrop-blur-md flex items-center justify-center transition-all duration-100 touch-none focus:outline-none cursor-pointer ${
        leftActive
          ? 'bg-amber-500/40 border-amber-300 scale-95 shadow-[0_0_20px_rgba(245,158,11,0.5)] text-amber-200'
          : 'bg-slate-900/60 border-slate-700/80 text-slate-200 shadow-xl'
      }`}
      aria-label="Move Left"
    >
      <ArrowLeft className={iconSizeClass} />
    </button>
  );

  const rightButton = (
    <button
      type="button"
      onTouchStart={(e) => {
        e.preventDefault();
        setRightActive(true);
        triggerHaptic();
        onRightPress(true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        setRightActive(false);
        onRightPress(false);
      }}
      onTouchCancel={() => {
        setRightActive(false);
        onRightPress(false);
      }}
      onMouseDown={() => {
        setRightActive(true);
        onRightPress(true);
      }}
      onMouseUp={() => {
        setRightActive(false);
        onRightPress(false);
      }}
      onMouseLeave={() => {
        setRightActive(false);
        onRightPress(false);
      }}
      style={{
        opacity: rightActive ? 1.0 : baseAlpha,
      }}
      className={`${btnSizeClass} rounded-2xl border-2 backdrop-blur-md flex items-center justify-center transition-all duration-100 touch-none focus:outline-none cursor-pointer ${
        rightActive
          ? 'bg-amber-500/40 border-amber-300 scale-95 shadow-[0_0_20px_rgba(245,158,11,0.5)] text-amber-200'
          : 'bg-slate-900/60 border-slate-700/80 text-slate-200 shadow-xl'
      }`}
      aria-label="Move Right"
    >
      <ArrowRight className={iconSizeClass} />
    </button>
  );

  const jumpButton = (
    <button
      type="button"
      onTouchStart={(e) => {
        e.preventDefault();
        setJumpActive(true);
        triggerHaptic();
        onJumpPress(true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        setJumpActive(false);
        onJumpPress(false);
      }}
      onTouchCancel={() => {
        setJumpActive(false);
        onJumpPress(false);
      }}
      onMouseDown={() => {
        setJumpActive(true);
        onJumpPress(true);
      }}
      onMouseUp={() => {
        setJumpActive(false);
        onJumpPress(false);
      }}
      onMouseLeave={() => {
        setJumpActive(false);
        onJumpPress(false);
      }}
      style={{
        opacity: jumpActive ? 1.0 : baseAlpha,
      }}
      className={`${jumpSizeClass} rounded-full border-2 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-100 touch-none focus:outline-none cursor-pointer ${
        jumpActive
          ? 'bg-amber-500 border-amber-300 scale-95 shadow-[0_0_25px_rgba(245,158,11,0.7)] text-slate-950'
          : 'bg-amber-500/25 border-amber-400/80 text-amber-300 shadow-xl'
      }`}
      aria-label="Jump"
    >
      <ArrowUp className={iconSizeClass} />
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider -mt-0.5">
        JUMP
      </span>
    </button>
  );

  // Render layouts based on controlPosition
  return (
    <div className="absolute bottom-2 left-0 right-0 px-3 sm:px-6 pb-[max(8px,env(safe-area-inset-bottom))] flex justify-between items-end pointer-events-none z-30 select-none">
      {controlPosition === 'SPLIT' && (
        <>
          <div className="flex items-center gap-2.5 pointer-events-auto">
            {leftButton}
            {rightButton}
          </div>
          <div className="pointer-events-auto">{jumpButton}</div>
        </>
      )}

      {controlPosition === 'INVERTED' && (
        <>
          <div className="pointer-events-auto">{jumpButton}</div>
          <div className="flex items-center gap-2.5 pointer-events-auto">
            {leftButton}
            {rightButton}
          </div>
        </>
      )}

      {controlPosition === 'WIDE' && (
        <>
          <div className="pointer-events-auto">{leftButton}</div>
          <div className="pointer-events-auto -mb-2">{jumpButton}</div>
          <div className="pointer-events-auto">{rightButton}</div>
        </>
      )}
    </div>
  );
};
