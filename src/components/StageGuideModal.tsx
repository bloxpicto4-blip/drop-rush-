import React, { useState } from 'react';
import { X, Zap, Clock, Magnet, Shield, Star, Globe, AlertTriangle, Activity, Phone } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface StageGuideModalProps {
  onClose: () => void;
}

export const StageGuideModal: React.FC<StageGuideModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'WORLDS' | 'MECHANICS' | 'ABILITIES'>('WORLDS');

  const handleClose = () => {
    soundEngine.playButtonSound();
    onClose();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 z-50 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">
              World Mechanics & Rules
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl my-4 border border-slate-800">
          <button
            onClick={() => setTab('WORLDS')}
            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
              tab === 'WORLDS'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Worlds & 60s Cycle
          </button>
          <button
            onClick={() => setTab('MECHANICS')}
            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
              tab === 'MECHANICS'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unique Hazards (18)
          </button>
          <button
            onClick={() => setTab('ABILITIES')}
            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
              tab === 'ABILITIES'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Abilities (5)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 text-xs sm:text-sm">
          {tab === 'WORLDS' && (
            <>
              {/* World Transformation Protocol Card */}
              <div className="p-3.5 bg-sky-500/10 border border-sky-500/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-sky-300 uppercase text-xs">
                    60-Second Dynamic World Cycle
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Every world lasts <strong>60 seconds</strong>. At <strong>50 seconds</strong>, a gradual <strong>5–8 second visual transformation</strong> begins: the sky, lighting, and ground shift seamlessly, old obstacles fade away, and new world mechanics enter without sudden cuts.
                </p>
              </div>

              {/* Progressive Difficulty Info */}
              <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl">
                <div className="text-xs font-bold text-amber-300 uppercase mb-2">
                  Progressive Difficulty Tiers
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    <strong className="text-emerald-400 block">Cycle 1: Easy</strong>
                    <span>1 mechanic at a time</span>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    <strong className="text-sky-400 block">Cycle 2: Medium</strong>
                    <span>1–2 mechanics + new variations</span>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    <strong className="text-amber-400 block">Cycle 3: Hard</strong>
                    <span>2 simultaneous mechanics</span>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    <strong className="text-orange-400 block">Cycle 4: Very Hard</strong>
                    <span>Up to 3 mechanics</span>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    <strong className="text-rose-400 block">Cycle 5+: Extreme</strong>
                    <span>Triple mechanics & high speed</span>
                  </div>
                </div>
              </div>

              {/* World List */}
              <div className="space-y-2">
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <strong className="text-sky-400">1. Metropolis (City)</strong>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Speeding cars across road lanes, collapsing billboard signs, falling construction girders.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <strong className="text-emerald-400">2. Mystic Woods (Forest)</strong>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Cracking tree branches, player-tracking bee swarms, temporary sprouting thorn zones.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <strong className="text-cyan-300">3. Frozen Peaks (Snow)</strong>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Slippery low-friction ice floor, heavy ice blocks, hanging icicles, howling blizzard winds that push you.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <strong className="text-orange-400">4. Solar Dunes (Desert)</strong>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Blinding sandstorms reducing visibility, player-slowing quicksand pits, tumbling sandstone rocks, rolling cacti.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <strong className="text-purple-400">5. Astral Realm (Fantasy Night)</strong>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Tracking homing magic projectiles, crawling shadow stalkers, ability-disabling antimagic energy zones, teleporting warp crystals.
                  </p>
                </div>
              </div>
            </>
          )}

          {tab === 'MECHANICS' && (
            <>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Safety Rule:</strong> Every single mechanic gives a clear visual & audio warning with at least <strong>0.8s reaction time</strong> and a safe path.
                </span>
              </div>

              {/* City Mechanics */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                  City Mechanics
                </span>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Moving Cars</strong>
                    <p className="text-slate-400 text-xs">Red tire lane warning · Jump over or dodge</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">3.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Falling Signs</strong>
                    <p className="text-slate-400 text-xs">Billboard wobble warning · Plunges from overhead</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">4.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Construction Objects</strong>
                    <p className="text-slate-400 text-xs">Heavy steel girder drops with caution stripes</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">3.5s</span>
                </div>
              </div>

              {/* Forest Mechanics */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Forest Mechanics
                </span>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Falling Branches</strong>
                    <p className="text-slate-400 text-xs">Heavy leafy oak branch drops from canopy</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">4.2s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Angry Bees</strong>
                    <p className="text-slate-400 text-xs">Buzzing swarm tracks player position</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">5.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Thorn Zone</strong>
                    <p className="text-slate-400 text-xs">Ground sprouts prickly brambles · Jump to clear</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">6.0s</span>
                </div>
              </div>

              {/* Snow Mechanics */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                  Snow Mechanics
                </span>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Frozen Ice Floor</strong>
                    <p className="text-slate-400 text-xs">Slippery gliding physics across the floor</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">5.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Glacial Ice Blocks</strong>
                    <p className="text-slate-400 text-xs">Compacted ice cubes crash down</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">5.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Sharp Icicles</strong>
                    <p className="text-slate-400 text-xs">Rapid-dropping hanging frozen spears</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">4.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Blizzard Snowstorm</strong>
                    <p className="text-slate-400 text-xs">Strong lateral wind gusts physically push character</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">7.0s</span>
                </div>
              </div>

              {/* Desert Mechanics */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                  Desert Mechanics
                </span>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Blinding Sandstorm</strong>
                    <p className="text-slate-400 text-xs">Thick dust haze reducing visibility range</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">9.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Sinking Quicksand</strong>
                    <p className="text-slate-400 text-xs">Swirling sand pit drastically reduces player speed</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">6.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Falling Boulders</strong>
                    <p className="text-slate-400 text-xs">Tumbling sandstone boulders crashing down</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">4.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Rolling Cactus</strong>
                    <p className="text-slate-400 text-xs">Spiky tumbleweed rolls along ground · Jump over</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">5.0s</span>
                </div>
              </div>

              {/* Fantasy Mechanics */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                  Fantasy Night Mechanics
                </span>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Homing Magic Projectiles</strong>
                    <p className="text-slate-400 text-xs">Arcane homing orbs tracking player</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">4.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Shadow Stalker</strong>
                    <p className="text-slate-400 text-xs">Void creature stalking player along ground</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">7.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Anti-Magic Energy Zone</strong>
                    <p className="text-slate-400 text-xs">Disables power-up abilities while inside field</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">5.0s</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-slate-200">Warp Crystal Obelisk</strong>
                    <p className="text-slate-400 text-xs">Teleports between positions after warning beacon</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">6.0s</span>
                </div>
              </div>
            </>
          )}

          {tab === 'ABILITIES' && (
            <>
              <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sky-400 text-sm">Speed Boost (5s)</h4>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Character dashes 70% faster with blue wind trails and ghost silhouettes.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-cyan-300 text-sm">Time Freeze (3s)</h4>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Freezes all falling hazards and objects in the air with a ticking clock halo. Player moves normally!
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                  <Magnet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-purple-400 text-sm">Coin Magnet (7s)</h4>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Generates an electromagnetic field pulling all nearby coins and power-ups directly to you.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-400 text-sm">Aegis Shield (1 Hit)</h4>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Encapsulates you in a protective hexagonal energy dome that absorbs 1 fatal hazard hit without losing hearts.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-400 text-sm">Double Score (8s)</h4>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Bestows a golden halo and 2X multiplier on every collected item and combo.
                  </p>
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

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 text-center">
          <button
            onClick={handleClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
          >
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};
