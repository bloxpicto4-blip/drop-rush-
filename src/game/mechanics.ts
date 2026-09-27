import { WorldMechanicInstance, MechanicType, DifficultyTier } from './types';
import { PlayerCharacter } from './character';
import { soundEngine } from './audio';

export interface MechanicConfig {
  type: MechanicType;
  title: string;
  warningText: string;
  warningDuration: number;
  activeDuration: number;
}

export const MECHANIC_CONFIGS: Record<MechanicType, MechanicConfig> = {
  // City
  MOVING_CAR: {
    type: 'MOVING_CAR',
    title: 'Speeding Car',
    warningText: '⚠️ CAR APPROACHING!',
    warningDuration: 1.0,
    activeDuration: 3.0,
  },
  FALLING_SIGN: {
    type: 'FALLING_SIGN',
    title: 'Billboard Sign',
    warningText: '⚠️ SIGN COLLAPSE!',
    warningDuration: 1.0,
    activeDuration: 4.0,
  },
  CONSTRUCTION_OBJECT: {
    type: 'CONSTRUCTION_OBJECT',
    title: 'Steel Girder',
    warningText: '⚠️ FALLING GIRDER!',
    warningDuration: 1.0,
    activeDuration: 3.5,
  },

  // Forest
  FALLING_BRANCH: {
    type: 'FALLING_BRANCH',
    title: 'Heavy Branch',
    warningText: '⚠️ BRANCH CRACKING!',
    warningDuration: 1.0,
    activeDuration: 4.2,
  },
  BEES: {
    type: 'BEES',
    title: 'Angry Bees',
    warningText: '🐝 BEE SWARM INCOMING!',
    warningDuration: 1.0,
    activeDuration: 5.0,
  },
  THORN_ZONE: {
    type: 'THORN_ZONE',
    title: 'Bramble Thorns',
    warningText: '⚠️ THORNS SPROUTING!',
    warningDuration: 1.0,
    activeDuration: 6.0,
  },

  // Snow
  ICE_FLOOR: {
    type: 'ICE_FLOOR',
    title: 'Frozen Ice Floor',
    warningText: '❄️ SLIPPERY ICE FORMING!',
    warningDuration: 1.0,
    activeDuration: 5.0,
  },
  ICE_BLOCKS: {
    type: 'ICE_BLOCKS',
    title: 'Glacial Ice Blocks',
    warningText: '⚠️ FALLING ICE BLOCKS!',
    warningDuration: 1.0,
    activeDuration: 5.0,
  },
  ICICLES: {
    type: 'ICICLES',
    title: 'Sharp Icicles',
    warningText: '⚠️ SHARP ICICLES ABOVE!',
    warningDuration: 0.9,
    activeDuration: 4.0,
  },
  SNOWSTORM: {
    type: 'SNOWSTORM',
    title: 'Blizzard Gale',
    warningText: '❄️ BLIZZARD GUST!',
    warningDuration: 1.2,
    activeDuration: 7.0,
  },

  // Desert
  SANDSTORM: {
    type: 'SANDSTORM',
    title: 'Blinding Sandstorm',
    warningText: '🌪️ SANDSTORM APPROACHING!',
    warningDuration: 1.2,
    activeDuration: 9.0,
  },
  QUICKSAND: {
    type: 'QUICKSAND',
    title: 'Sinking Quicksand',
    warningText: '⚠️ QUICKSAND PIT!',
    warningDuration: 1.0,
    activeDuration: 6.0,
  },
  FALLING_ROCKS: {
    type: 'FALLING_ROCKS',
    title: 'Falling Boulders',
    warningText: '⚠️ ROCKSLIDE INCOMING!',
    warningDuration: 1.0,
    activeDuration: 4.0,
  },
  CACTUS: {
    type: 'CACTUS',
    title: 'Rolling Tumble Cactus',
    warningText: '🌵 ROLLING CACTUS!',
    warningDuration: 1.0,
    activeDuration: 5.0,
  },

  // Night / Fantasy
  MAGIC_PROJECTILES: {
    type: 'MAGIC_PROJECTILES',
    title: 'Homing Magic Runes',
    warningText: '🔮 TRACKING MAGIC ORB!',
    warningDuration: 1.0,
    activeDuration: 4.0,
  },
  DARK_CREATURES: {
    type: 'DARK_CREATURES',
    title: 'Shadow Creature',
    warningText: '👁️ SHADOW STALKER!',
    warningDuration: 1.2,
    activeDuration: 7.0,
  },
  ENERGY_ZONE: {
    type: 'ENERGY_ZONE',
    title: 'Anti-Magic Zone',
    warningText: '⚡ ABILITY DISRUPTION FIELD!',
    warningDuration: 1.0,
    activeDuration: 5.0,
  },
  TELEPORTING_OBSTACLE: {
    type: 'TELEPORTING_OBSTACLE',
    title: 'Warp Crystal',
    warningText: '🌀 WARP RIFT DETECTED!',
    warningDuration: 1.0,
    activeDuration: 6.0,
  },

  // Volcano
  MAGMA_BOULDER_SPLIT: {
    type: 'MAGMA_BOULDER_SPLIT',
    title: 'Splitting Magma Boulder',
    warningText: '🌋 GIANT MAGMA BOULDER!',
    warningDuration: 1.0,
    activeDuration: 4.5,
  },
  LAVA_GEYSER: {
    type: 'LAVA_GEYSER',
    title: 'Lava Geyser',
    warningText: '🔥 LAVA GEYSER ERUPTION!',
    warningDuration: 1.0,
    activeDuration: 4.0,
  },
  VOLCANIC_ASH: {
    type: 'VOLCANIC_ASH',
    title: 'Volcanic Ash Cloud',
    warningText: '🌋 CHOKING ASH CLOUD!',
    warningDuration: 1.1,
    activeDuration: 6.0,
  },

  // Ocean
  TORPEDO_SHARK: {
    type: 'TORPEDO_SHARK',
    title: 'Torpedo Shark',
    warningText: '🦈 SHARK ATTACK INCOMING!',
    warningDuration: 1.0,
    activeDuration: 3.2,
  },
  SINKING_ANCHOR: {
    type: 'SINKING_ANCHOR',
    title: 'Heavy Sinking Anchor',
    warningText: '⚓ FALLING ANCHOR!',
    warningDuration: 1.0,
    activeDuration: 3.5,
  },
  WHIRLPOOL: {
    type: 'WHIRLPOOL',
    title: 'Abyssal Whirlpool',
    warningText: '🌀 OCEAN VORTEX CURRENT!',
    warningDuration: 1.0,
    activeDuration: 5.5,
  },

  // Space
  LASER_DRONE: {
    type: 'LASER_DRONE',
    title: 'Orbital Laser Drone',
    warningText: '🛰️ ORBITAL LASER LOCK!',
    warningDuration: 1.0,
    activeDuration: 3.0,
  },
  GRAVITY_PULSE: {
    type: 'GRAVITY_PULSE',
    title: 'Zero-G Gravity Pulse',
    warningText: '🚀 ZERO-GRAVITY PULSE!',
    warningDuration: 1.0,
    activeDuration: 4.5,
  },
  SPLITTING_COMET: {
    type: 'SPLITTING_COMET',
    title: 'Splitting Cosmic Comet',
    warningText: '☄️ SPLITTING COMET STRIKE!',
    warningDuration: 0.9,
    activeDuration: 3.8,
  },

  // Ancient Ruins
  ROLLING_GIANT_STONE: {
    type: 'ROLLING_GIANT_STONE',
    title: 'Rolling Temple Sphere',
    warningText: '🗿 GIANT STONE ROLLING!',
    warningDuration: 1.0,
    activeDuration: 3.8,
  },
  DART_TRAP: {
    type: 'DART_TRAP',
    title: 'Poison Dart Trap',
    warningText: '🎯 PRESSURE PLATE TRAP!',
    warningDuration: 0.9,
    activeDuration: 3.0,
  },

  // Cyberpunk
  HOVER_CAR: {
    type: 'HOVER_CAR',
    title: 'Cyber Hover-Car',
    warningText: '🚗 SPEEDING HOVER-VEHICLE!',
    warningDuration: 1.0,
    activeDuration: 3.0,
  },
  EMP_SHOCKWAVE: {
    type: 'EMP_SHOCKWAVE',
    title: 'EMP Shockwave',
    warningText: '⚡ EMP DISRUPTION WAVE!',
    warningDuration: 1.0,
    activeDuration: 4.0,
  },

  // Haunted City
  BANSHEE_WISP: {
    type: 'BANSHEE_WISP',
    title: 'Screaming Banshee Wisp',
    warningText: '👻 SPECTRAL BANSHEE!',
    warningDuration: 1.0,
    activeDuration: 5.0,
  },
  GHOST_MIRROR: {
    type: 'GHOST_MIRROR',
    title: 'Phantom Ghost Mirror',
    warningText: '🪞 PHANTOM RIFT MIRROR!',
    warningDuration: 1.0,
    activeDuration: 4.5,
  },

  // Sky / Cloud
  LIGHTNING_STRIKE: {
    type: 'LIGHTNING_STRIKE',
    title: 'Thunderstrike Bolt',
    warningText: '⚡ THUNDERBOLT STRIKE!',
    warningDuration: 0.9,
    activeDuration: 2.5,
  },
  GUST_OF_WIND: {
    type: 'GUST_OF_WIND',
    title: 'Gale Force Wind',
    warningText: '🌪️ GALE FORCE GUST!',
    warningDuration: 1.0,
    activeDuration: 5.0,
  },

  // Underground Cave
  FALLING_STALACTITE: {
    type: 'FALLING_STALACTITE',
    title: 'Crystal Stalactite',
    warningText: '💎 CRACKING STALACTITE!',
    warningDuration: 0.9,
    activeDuration: 3.2,
  },
  MINECART_RUSH: {
    type: 'MINECART_RUSH',
    title: 'Runaway Minecart',
    warningText: '⛏️ RUNAWAY MINECART!',
    warningDuration: 1.0,
    activeDuration: 3.2,
  },
};

export class MechanicsManager {
  public activeMechanics: WorldMechanicInstance[] = [];
  private spawnCooldown: number = 2.0;

  public reset() {
    this.activeMechanics = [];
    this.spawnCooldown = 2.0;
  }

  public update(
    dt: number,
    availableMechanics: MechanicType[],
    difficulty: DifficultyTier,
    canvasWidth: number,
    groundY: number,
    player: PlayerCharacter,
    onPlayerHit: (mechanic: WorldMechanicInstance) => void
  ) {
    // 1. Spawning Mechanics based on cycle/difficulty
    this.spawnCooldown -= dt;

    const maxConcurrent =
      difficulty === 'Easy' ? 1 :
      difficulty === 'Medium' ? 1.5 : // average 1-2
      difficulty === 'Hard' ? 2 :
      difficulty === 'Very Hard' ? 2.5 : 3;

    if (this.spawnCooldown <= 0 && this.activeMechanics.length < maxConcurrent && availableMechanics.length > 0) {
      // Pick a mechanic not currently active
      const candidates = availableMechanics.filter(
        m => !this.activeMechanics.some(am => am.type === m)
      );

      if (candidates.length > 0) {
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        this.spawnMechanic(picked, canvasWidth, groundY, player);
      }

      // Interval between mechanics: 4s - 7s depending on difficulty
      this.spawnCooldown =
        difficulty === 'Easy' ? 6.5 :
        difficulty === 'Medium' ? 5.5 :
        difficulty === 'Hard' ? 4.5 :
        difficulty === 'Very Hard' ? 3.8 : 3.2;
    }

    // 2. Update Active Mechanics
    for (let i = this.activeMechanics.length - 1; i >= 0; i--) {
      const mech = this.activeMechanics[i];
      mech.elapsed += dt;

      if (mech.state === 'WARNING') {
        if (mech.elapsed >= mech.warningDuration) {
          mech.state = 'ACTIVE';
          mech.elapsed = 0;
          this.onMechanicActivated(mech);
        }
      } else if (mech.state === 'ACTIVE') {
        this.updateActiveMechanic(mech, dt, canvasWidth, groundY, player, onPlayerHit);

        if (mech.elapsed >= mech.activeDuration) {
          mech.state = 'ENDING';
          mech.elapsed = 0;
        }
      } else if (mech.state === 'ENDING') {
        mech.alpha -= dt * 3;
        if (mech.alpha <= 0) {
          this.activeMechanics.splice(i, 1);
        }
      }
    }
  }

  private spawnMechanic(
    type: MechanicType,
    canvasWidth: number,
    groundY: number,
    player: PlayerCharacter
  ) {
    const config = MECHANIC_CONFIGS[type];
    const id = Math.random().toString(36).substring(2, 9);
    soundEngine.playWarningBeep();

    let x = canvasWidth / 2;
    let y = groundY - 40;
    let width = 60;
    let height = 40;
    let vx = 0;
    let vy = 0;
    const extra: Record<string, any> = {};

    switch (type) {
      case 'MOVING_CAR': {
        const fromLeft = Math.random() < 0.5;
        width = 110;
        height = 42;
        y = groundY - height;
        x = fromLeft ? -width - 20 : canvasWidth + 20;
        vx = fromLeft ? (canvasWidth + 200) / 3.0 : -(canvasWidth + 200) / 3.0;
        extra.fromLeft = fromLeft;
        extra.carColor = Math.random() < 0.5 ? '#ef4444' : '#3b82f6';
        break;
      }
      case 'FALLING_SIGN': {
        width = 120;
        height = 45;
        // Never cover entire screen: leave safe margins on left or right
        x = Math.max(80, Math.min(canvasWidth - 80, player.x + (Math.random() - 0.5) * 180));
        y = -80;
        extra.targetX = x;
        extra.signText = 'DANGER · 80 MPH';
        break;
      }
      case 'CONSTRUCTION_OBJECT': {
        width = 100;
        height = 25;
        x = Math.max(70, Math.min(canvasWidth - 70, player.x + (Math.random() - 0.5) * 160));
        y = -50;
        vy = (groundY + 30) / 3.5;
        break;
      }
      case 'FALLING_BRANCH': {
        width = 130;
        height = 35;
        x = Math.max(90, Math.min(canvasWidth - 90, player.x + (Math.random() - 0.5) * 150));
        y = -60;
        vy = (groundY + 40) / 4.2;
        break;
      }
      case 'BEES': {
        width = 55;
        height = 55;
        x = player.x > canvasWidth / 2 ? 40 : canvasWidth - 40;
        y = groundY - 60;
        break;
      }
      case 'THORN_ZONE': {
        // Safe path guarantee: span at most 35% of canvas width
        width = Math.min(canvasWidth * 0.38, 220);
        height = 28;
        // Position offset from current player so player has time to step aside
        const offset = Math.random() < 0.5 ? -140 : 140;
        x = Math.max(width / 2 + 30, Math.min(canvasWidth - width / 2 - 30, player.x + offset));
        y = groundY - height;
        break;
      }
      case 'ICE_FLOOR': {
        width = canvasWidth;
        height = 14;
        x = canvasWidth / 2;
        y = groundY - height;
        break;
      }
      case 'ICE_BLOCKS': {
        width = 50;
        height = 50;
        x = Math.max(60, Math.min(canvasWidth - 60, player.x + (Math.random() - 0.5) * 200));
        y = -60;
        vy = 280;
        break;
      }
      case 'ICICLES': {
        width = 24;
        height = 55;
        x = Math.max(40, Math.min(canvasWidth - 40, player.x + (Math.random() - 0.5) * 160));
        y = -40;
        vy = 360;
        break;
      }
      case 'SNOWSTORM': {
        width = canvasWidth;
        height = groundY;
        x = canvasWidth / 2;
        y = groundY / 2;
        extra.direction = Math.random() < 0.5 ? -1 : 1; // -1: wind pushes left, 1: pushes right
        break;
      }
      case 'SANDSTORM': {
        width = canvasWidth;
        height = groundY;
        x = canvasWidth / 2;
        y = groundY / 2;
        break;
      }
      case 'QUICKSAND': {
        width = 160;
        height = 20;
        const sideOffset = Math.random() < 0.5 ? -120 : 120;
        x = Math.max(100, Math.min(canvasWidth - 100, player.x + sideOffset));
        y = groundY - height;
        break;
      }
      case 'FALLING_ROCKS': {
        width = 45;
        height = 45;
        x = Math.max(60, Math.min(canvasWidth - 60, player.x + (Math.random() - 0.5) * 180));
        y = -50;
        vy = 320;
        break;
      }
      case 'CACTUS': {
        width = 46;
        height = 46;
        const fromLeft = Math.random() < 0.5;
        x = fromLeft ? -50 : canvasWidth + 50;
        y = groundY - height;
        vx = fromLeft ? 220 : -220;
        extra.rotSpeed = fromLeft ? 6 : -6;
        break;
      }
      case 'MAGIC_PROJECTILES': {
        width = 30;
        height = 30;
        x = Math.random() * canvasWidth;
        y = 50;
        break;
      }
      case 'DARK_CREATURES': {
        width = 44;
        height = 44;
        x = player.x > canvasWidth / 2 ? 50 : canvasWidth - 50;
        y = groundY - height;
        break;
      }
      case 'ENERGY_ZONE': {
        width = 130;
        height = groundY * 0.7;
        const side = Math.random() < 0.5 ? -130 : 130;
        x = Math.max(80, Math.min(canvasWidth - 80, player.x + side));
        y = groundY - height / 2;
        break;
      }
      case 'TELEPORTING_OBSTACLE': {
        width = 48;
        height = 60;
        x = Math.max(60, Math.min(canvasWidth - 60, player.x + (Math.random() < 0.5 ? -140 : 140)));
        y = groundY - height;
        extra.teleportTimer = 0;
        break;
      }

      // Volcano
      case 'MAGMA_BOULDER_SPLIT': {
        width = 54;
        height = 54;
        x = Math.max(80, Math.min(canvasWidth - 80, player.x + (Math.random() - 0.5) * 160));
        y = -60;
        vy = 310;
        extra.hasSplit = false;
        extra.shards = [];
        break;
      }
      case 'LAVA_GEYSER': {
        width = 75;
        height = groundY * 0.8;
        const side = Math.random() < 0.5 ? -130 : 130;
        x = Math.max(60, Math.min(canvasWidth - 60, player.x + side));
        y = groundY - height;
        break;
      }
      case 'VOLCANIC_ASH': {
        width = canvasWidth * 0.6;
        height = groundY * 0.7;
        x = Math.random() * canvasWidth;
        y = groundY - height / 2;
        vx = (Math.random() - 0.5) * 60;
        break;
      }

      // Ocean
      case 'TORPEDO_SHARK': {
        const fromLeft = Math.random() < 0.5;
        width = 90;
        height = 36;
        y = groundY - height - 8;
        x = fromLeft ? -width - 20 : canvasWidth + 20;
        vx = fromLeft ? (canvasWidth + 200) / 3.2 : -(canvasWidth + 200) / 3.2;
        extra.fromLeft = fromLeft;
        break;
      }
      case 'SINKING_ANCHOR': {
        width = 50;
        height = 65;
        x = Math.max(60, Math.min(canvasWidth - 60, player.x + (Math.random() - 0.5) * 150));
        y = -80;
        vy = 340;
        break;
      }
      case 'WHIRLPOOL': {
        width = 170;
        height = 24;
        const offset = Math.random() < 0.5 ? -130 : 130;
        x = Math.max(100, Math.min(canvasWidth - 100, player.x + offset));
        y = groundY - height;
        break;
      }

      // Space
      case 'LASER_DRONE': {
        width = 50;
        height = 30;
        x = Math.max(80, Math.min(canvasWidth - 80, player.x + (Math.random() - 0.5) * 120));
        y = 40;
        extra.firing = false;
        break;
      }
      case 'GRAVITY_PULSE': {
        width = 150;
        height = groundY * 0.7;
        x = Math.max(100, Math.min(canvasWidth - 100, player.x));
        y = groundY - height / 2;
        break;
      }
      case 'SPLITTING_COMET': {
        width = 40;
        height = 40;
        x = Math.max(60, Math.min(canvasWidth - 60, player.x + (Math.random() - 0.5) * 180));
        y = -60;
        vy = 350;
        break;
      }

      // Ancient Ruins
      case 'ROLLING_GIANT_STONE': {
        const fromLeft = Math.random() < 0.5;
        width = 65;
        height = 65;
        y = groundY - height;
        x = fromLeft ? -width - 20 : canvasWidth + 20;
        vx = fromLeft ? (canvasWidth + 150) / 3.8 : -(canvasWidth + 150) / 3.8;
        extra.fromLeft = fromLeft;
        break;
      }
      case 'DART_TRAP': {
        const fromLeft = Math.random() < 0.5;
        width = 40;
        height = 14;
        y = groundY - 30;
        x = fromLeft ? -30 : canvasWidth + 30;
        vx = fromLeft ? (canvasWidth + 100) / 3.0 : -(canvasWidth + 100) / 3.0;
        extra.fromLeft = fromLeft;
        break;
      }

      // Cyberpunk
      case 'HOVER_CAR': {
        const fromLeft = Math.random() < 0.5;
        width = 110;
        height = 38;
        y = groundY - height - 12;
        x = fromLeft ? -width - 20 : canvasWidth + 20;
        vx = fromLeft ? (canvasWidth + 200) / 3.0 : -(canvasWidth + 200) / 3.0;
        extra.fromLeft = fromLeft;
        break;
      }
      case 'EMP_SHOCKWAVE': {
        width = 140;
        height = groundY * 0.7;
        const side = Math.random() < 0.5 ? -130 : 130;
        x = Math.max(80, Math.min(canvasWidth - 80, player.x + side));
        y = groundY - height / 2;
        break;
      }

      // Haunted City
      case 'BANSHEE_WISP': {
        width = 42;
        height = 42;
        x = player.x > canvasWidth / 2 ? 40 : canvasWidth - 40;
        y = groundY - 70;
        break;
      }
      case 'GHOST_MIRROR': {
        width = 50;
        height = 70;
        const side = Math.random() < 0.5 ? -140 : 140;
        x = Math.max(70, Math.min(canvasWidth - 70, player.x + side));
        y = groundY - height;
        break;
      }

      // Sky / Cloud
      case 'LIGHTNING_STRIKE': {
        width = 40;
        height = groundY;
        const side = (Math.random() - 0.5) * 160;
        x = Math.max(50, Math.min(canvasWidth - 50, player.x + side));
        y = groundY / 2;
        break;
      }
      case 'GUST_OF_WIND': {
        width = canvasWidth;
        height = groundY;
        x = canvasWidth / 2;
        y = groundY / 2;
        extra.direction = Math.random() < 0.5 ? -1 : 1;
        break;
      }

      // Underground Cave
      case 'FALLING_STALACTITE': {
        width = 24;
        height = 60;
        x = Math.max(50, Math.min(canvasWidth - 50, player.x + (Math.random() - 0.5) * 160));
        y = -50;
        vy = 360;
        break;
      }
      case 'MINECART_RUSH': {
        const fromLeft = Math.random() < 0.5;
        width = 80;
        height = 44;
        y = groundY - height;
        x = fromLeft ? -width - 20 : canvasWidth + 20;
        vx = fromLeft ? (canvasWidth + 180) / 3.2 : -(canvasWidth + 180) / 3.2;
        extra.fromLeft = fromLeft;
        break;
      }
    }

    this.activeMechanics.push({
      id,
      type,
      title: config.title,
      warningText: config.warningText,
      state: 'WARNING',
      elapsed: 0,
      warningDuration: config.warningDuration,
      activeDuration: config.activeDuration,
      x,
      y,
      width,
      height,
      vx,
      vy,
      alpha: 1.0,
      extra,
    });
  }

  private onMechanicActivated(mech: WorldMechanicInstance) {
    if (mech.type === 'MOVING_CAR') soundEngine.playCarHorn();
    if (mech.type === 'BEES') soundEngine.playBeesBuzz();
    if (mech.type === 'SNOWSTORM' || mech.type === 'SANDSTORM') soundEngine.playWindGust();
    if (mech.type === 'MAGIC_PROJECTILES') soundEngine.playMagicHoming();
    if (mech.type === 'FALLING_ROCKS' || mech.type === 'CONSTRUCTION_OBJECT') soundEngine.playRumble();
  }

  private updateActiveMechanic(
    mech: WorldMechanicInstance,
    dt: number,
    canvasWidth: number,
    groundY: number,
    player: PlayerCharacter,
    onPlayerHit: (mech: WorldMechanicInstance) => void
  ) {
    switch (mech.type) {
      case 'MOVING_CAR': {
        mech.x += mech.vx * dt;
        // Check collision with player
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          // Player can jump OVER the car! If player is grounded or low, hit!
          if (player.y + player.height > mech.y + 12) {
            onPlayerHit(mech);
          }
        }
        break;
      }
      case 'FALLING_SIGN': {
        // Plunges down over 4s
        const t = mech.elapsed / mech.activeDuration;
        mech.y = -80 + t * (groundY + 80);
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'CONSTRUCTION_OBJECT': {
        mech.y += mech.vy * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'FALLING_BRANCH': {
        mech.y += mech.vy * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'BEES': {
        // Tracks player smoothly
        const dx = player.x - mech.x;
        const dy = (player.y + 20) - mech.y;
        const dist = Math.hypot(dx, dy);
        const speed = 135;
        if (dist > 5) {
          mech.x += (dx / dist) * speed * dt;
          mech.y += (dy / dist) * speed * dt;
        }
        // Collision
        if (dist < (mech.width / 2 + player.width / 2 - 6)) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'THORN_ZONE': {
        // Stepping on thorns hurts player if grounded
        const px = player.x;
        if (player.isGrounded && px >= mech.x - mech.width / 2 && px <= mech.x + mech.width / 2) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'ICE_FLOOR': {
        // Slippery movement! Reduces player friction / accelerates slide
        if (player.isGrounded && Math.abs(player.vx) > 20) {
          player.vx += Math.sign(player.vx) * 350 * dt;
        }
        break;
      }
      case 'ICE_BLOCKS': {
        mech.y += mech.vy * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'ICICLES': {
        mech.y += mech.vy * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'SNOWSTORM': {
        // Physically pushes player horizontally
        const pushDir = mech.extra?.direction || 1;
        const pushForce = 220;
        player.vx += pushDir * pushForce * dt;
        break;
      }
      case 'SANDSTORM': {
        // Handled in render (visibility shroud)
        break;
      }
      case 'QUICKSAND': {
        // Sinks and slows player by 60%
        const px = player.x;
        if (player.isGrounded && px >= mech.x - mech.width / 2 && px <= mech.x + mech.width / 2) {
          player.vx *= 0.88;
        }
        break;
      }
      case 'FALLING_ROCKS': {
        mech.y += mech.vy * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'CACTUS': {
        mech.x += mech.vx * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          if (player.isGrounded || player.y + player.height > mech.y + 10) {
            onPlayerHit(mech);
          }
        }
        break;
      }
      case 'MAGIC_PROJECTILES': {
        // Homing missile tracking player
        const dx = player.x - mech.x;
        const dy = (player.y + 20) - mech.y;
        const dist = Math.hypot(dx, dy);
        const speed = 190;
        if (dist > 6) {
          mech.x += (dx / dist) * speed * dt;
          mech.y += (dy / dist) * speed * dt;
        }
        if (dist < 32) {
          onPlayerHit(mech);
          mech.elapsed = mech.activeDuration; // explode on contact
        }
        break;
      }
      case 'DARK_CREATURES': {
        // Crawls along ground tracking player
        const dx = player.x - mech.x;
        const speed = 110;
        mech.x += Math.sign(dx) * speed * dt;
        if (Math.abs(player.x - mech.x) < 32 && player.isGrounded) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'ENERGY_ZONE': {
        // Disrupts abilities if player enters zone
        const px = player.x;
        if (px >= mech.x - mech.width / 2 && px <= mech.x + mech.width / 2) {
          mech.extra = { ...mech.extra, playerInside: true };
        } else {
          mech.extra = { ...mech.extra, playerInside: false };
        }
        break;
      }
      case 'TELEPORTING_OBSTACLE': {
        mech.extra!.teleportTimer = (mech.extra!.teleportTimer || 0) + dt;
        if (mech.extra!.teleportTimer >= 1.8) {
          mech.extra!.teleportTimer = 0;
          // Warp to a new spot, leaving safe space
          mech.x = Math.max(60, Math.min(canvasWidth - 60, Math.random() * canvasWidth));
        }
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }

      // Volcano
      case 'MAGMA_BOULDER_SPLIT': {
        if (!mech.extra?.hasSplit) {
          mech.y += mech.vy * dt;
          if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
            onPlayerHit(mech);
          }
          if (mech.y >= groundY - 32) {
            mech.extra!.hasSplit = true;
            mech.extra!.shard1X = mech.x - 12;
            mech.extra!.shard2X = mech.x + 12;
            soundEngine.playRumble();
          }
        } else {
          // Rolling shards
          mech.extra!.shard1X -= 190 * dt;
          mech.extra!.shard2X += 190 * dt;
          if (Math.abs(player.x - mech.extra!.shard1X) < 22 && player.isGrounded) onPlayerHit(mech);
          if (Math.abs(player.x - mech.extra!.shard2X) < 22 && player.isGrounded) onPlayerHit(mech);
        }
        break;
      }
      case 'LAVA_GEYSER': {
        const px = player.x;
        if (px >= mech.x - mech.width / 2 && px <= mech.x + mech.width / 2) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'VOLCANIC_ASH': {
        mech.x += mech.vx * dt;
        if (Math.abs(player.x - mech.x) < mech.width / 2) {
          player.vx *= 0.92;
        }
        break;
      }

      // Ocean
      case 'TORPEDO_SHARK': {
        mech.x += mech.vx * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          if (player.y + player.height > mech.y + 10) onPlayerHit(mech);
        }
        break;
      }
      case 'SINKING_ANCHOR': {
        mech.y += mech.vy * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'WHIRLPOOL': {
        const dx = mech.x - player.x;
        if (Math.abs(dx) < mech.width / 2 + 50) {
          player.vx += Math.sign(dx) * 180 * dt;
        }
        break;
      }

      // Space
      case 'LASER_DRONE': {
        mech.extra!.firing = mech.elapsed >= 1.0;
        if (mech.extra!.firing) {
          if (Math.abs(player.x - mech.x) < 22) {
            onPlayerHit(mech);
          }
        }
        break;
      }
      case 'GRAVITY_PULSE': {
        if (Math.abs(player.x - mech.x) < mech.width / 2) {
          player.vy -= 420 * dt; // gentle zero-g float
        }
        break;
      }
      case 'SPLITTING_COMET': {
        mech.y += mech.vy * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }

      // Ancient Ruins
      case 'ROLLING_GIANT_STONE': {
        mech.x += mech.vx * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          if (player.isGrounded || player.y + player.height > mech.y + 16) {
            onPlayerHit(mech);
          }
        }
        break;
      }
      case 'DART_TRAP': {
        mech.x += mech.vx * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          if (player.isGrounded || player.y + player.height > mech.y + 6) {
            onPlayerHit(mech);
          }
        }
        break;
      }

      // Cyberpunk
      case 'HOVER_CAR': {
        mech.x += mech.vx * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          if (player.y + player.height > mech.y + 12) onPlayerHit(mech);
        }
        break;
      }
      case 'EMP_SHOCKWAVE': {
        const px = player.x;
        if (px >= mech.x - mech.width / 2 && px <= mech.x + mech.width / 2) {
          mech.extra = { ...mech.extra, playerInside: true };
        } else {
          mech.extra = { ...mech.extra, playerInside: false };
        }
        break;
      }

      // Haunted City
      case 'BANSHEE_WISP': {
        const dx = player.x - mech.x;
        const dy = (player.y + 20) - mech.y;
        const dist = Math.hypot(dx, dy);
        const speed = 140;
        if (dist > 5) {
          mech.x += (dx / dist) * speed * dt;
          mech.y += (dy / dist) * speed * dt;
        }
        if (dist < 32) onPlayerHit(mech);
        break;
      }
      case 'GHOST_MIRROR': {
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }

      // Sky / Cloud
      case 'LIGHTNING_STRIKE': {
        if (mech.elapsed > 0.4 && mech.elapsed < 1.6) {
          if (Math.abs(player.x - mech.x) < 24) onPlayerHit(mech);
        }
        break;
      }
      case 'GUST_OF_WIND': {
        const dir = mech.extra?.direction || 1;
        player.vx += dir * 240 * dt;
        break;
      }

      // Underground Cave
      case 'FALLING_STALACTITE': {
        mech.y += mech.vy * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          onPlayerHit(mech);
        }
        break;
      }
      case 'MINECART_RUSH': {
        mech.x += mech.vx * dt;
        if (this.checkAABB(player, mech.x - mech.width / 2, mech.y, mech.width, mech.height)) {
          if (player.isGrounded || player.y + player.height > mech.y + 12) {
            onPlayerHit(mech);
          }
        }
        break;
      }
    }
  }

  private checkAABB(
    player: PlayerCharacter,
    boxX: number,
    boxY: number,
    boxW: number,
    boxH: number
  ): boolean {
    const px = player.x - player.width / 2;
    const py = player.y;
    const pw = player.width;
    const ph = player.height;

    return (
      px < boxX + boxW &&
      px + pw > boxX &&
      py < boxY + boxH &&
      py + ph > boxY
    );
  }

  // ---- RENDER MECHANICS & WARNINGS ----

  public render(ctx: CanvasRenderingContext2D, canvasWidth: number, groundY: number, time: number) {
    for (const mech of this.activeMechanics) {
      ctx.save();
      ctx.globalAlpha = mech.alpha;

      if (mech.state === 'WARNING') {
        this.renderWarningIndicator(ctx, mech, time, groundY, canvasWidth);
      } else {
        this.renderActiveMechanic(ctx, mech, time, groundY, canvasWidth);
      }

      ctx.restore();
    }
  }

  private renderWarningIndicator(
    ctx: CanvasRenderingContext2D,
    mech: WorldMechanicInstance,
    time: number,
    groundY: number,
    canvasWidth: number
  ) {
    const pulse = 0.6 + Math.sin(time * 16) * 0.4;
    ctx.save();

    // Ground or Sky Warning Marker
    if (mech.type === 'MOVING_CAR') {
      // Red lane marker with arrows
      ctx.fillStyle = `rgba(239, 68, 68, ${pulse * 0.35})`;
      ctx.fillRect(0, groundY - 45, canvasWidth, 45);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px "Rubik", sans-serif';
      ctx.textAlign = 'center';
      const arrow = mech.extra?.fromLeft ? '▶▶▶ CAR COMING ▶▶▶' : '◀◀◀ CAR COMING ◀◀◀';
      ctx.fillText(arrow, canvasWidth / 2, groundY - 18);
    } else if (mech.type === 'THORN_ZONE' || mech.type === 'QUICKSAND') {
      // Ground danger box
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = `rgba(239, 68, 68, ${pulse * 0.25})`;
      ctx.strokeRect(mech.x - mech.width / 2, groundY - 26, mech.width, 26);
      ctx.fillRect(mech.x - mech.width / 2, groundY - 26, mech.width, 26);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ DANGER', mech.x, groundY - 32);
    } else if (mech.type === 'SNOWSTORM' || mech.type === 'SANDSTORM') {
      // Full screen edge flash
      ctx.strokeStyle = mech.type === 'SNOWSTORM' ? '#67e8f9' : '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(0, 0, canvasWidth, groundY);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Rubik", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(mech.warningText, canvasWidth / 2, 80);
    } else {
      // Overhead drop indicator
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 13px "Rubik", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(mech.warningText, mech.x, 60);

      // Warning beam line to ground
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulse * 0.4})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(mech.x, 70);
      ctx.lineTo(mech.x, groundY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  private renderActiveMechanic(
    ctx: CanvasRenderingContext2D,
    mech: WorldMechanicInstance,
    time: number,
    groundY: number,
    canvasWidth: number
  ) {
    ctx.save();
    ctx.translate(mech.x, mech.y);

    switch (mech.type) {
      case 'MOVING_CAR': {
        const fromLeft = mech.extra?.fromLeft;
        const color = mech.extra?.carColor || '#ef4444';
        const w = mech.width;
        const h = mech.height;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(-w / 2, h - 4, w, 6);

        // Car Body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(-w / 2, 0, w, h - 8, 6);
        ctx.fill();

        // Roof / Cabin
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(-w * 0.25, -h * 0.35, w * 0.5, h * 0.45, 4);
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(-w * 0.3, h - 6, 7, 0, Math.PI * 2);
        ctx.arc(w * 0.3, h - 6, 7, 0, Math.PI * 2);
        ctx.fill();

        // Headlight beam
        const beamX = fromLeft ? w / 2 : -w / 2;
        const beamDir = fromLeft ? 1 : -1;
        const grad = ctx.createLinearGradient(beamX, h / 2, beamX + beamDir * 140, h / 2);
        grad.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
        grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(beamX, h * 0.2);
        ctx.lineTo(beamX + beamDir * 140, -10);
        ctx.lineTo(beamX + beamDir * 140, h + 10);
        ctx.lineTo(beamX, h * 0.8);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'FALLING_SIGN': {
        const w = mech.width;
        const h = mech.height;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-w / 2, 0, w, h);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.strokeRect(-w / 2, 0, w, h);

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 11px "Rubik", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(mech.extra?.signText || 'DANGER', 0, h * 0.6);
        break;
      }
      case 'CONSTRUCTION_OBJECT': {
        // Steel I-beam
        const w = mech.width;
        const h = mech.height;
        ctx.fillStyle = '#475569';
        ctx.fillRect(-w / 2, 0, w, h);
        // Yellow/Black caution stripes
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        for (let s = -w / 2; s < w / 2; s += 16) {
          ctx.beginPath();
          ctx.moveTo(s, 0);
          ctx.lineTo(s + 8, h);
          ctx.stroke();
        }
        break;
      }
      case 'FALLING_BRANCH': {
        const w = mech.width;
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-w / 2, 10);
        ctx.quadraticCurveTo(0, -10, w / 2, 15);
        ctx.stroke();
        // Leaves
        ctx.fillStyle = '#16a34a';
        for (let l = -w / 2 + 15; l < w / 2; l += 25) {
          ctx.beginPath();
          ctx.ellipse(l, 0, 10, 6, 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'BEES': {
        // Swarm of animated flying bees
        for (let b = 0; b < 10; b++) {
          const ox = Math.sin(time * 12 + b * 2) * 18;
          const oy = Math.cos(time * 10 + b * 1.5) * 16;
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.ellipse(ox, oy, 4, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(ox - 1, oy - 3, 2, 6);
        }
        break;
      }
      case 'THORN_ZONE': {
        // Thorny brambles on floor
        const w = mech.width;
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-w / 2, 14, w, 14);
        ctx.fillStyle = '#b91c1c';
        for (let t = -w / 2 + 6; t < w / 2; t += 14) {
          ctx.beginPath();
          ctx.moveTo(t, 28);
          ctx.lineTo(t + 6, 0);
          ctx.lineTo(t + 12, 28);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
      case 'ICE_FLOOR': {
        // Slick frost sheen on floor
        ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
        ctx.fillRect(-canvasWidth / 2, 0, canvasWidth, 14);
        ctx.fillStyle = '#ffffff';
        for (let s = -canvasWidth / 2; s < canvasWidth / 2; s += 40) {
          ctx.fillRect(s, 2, 12, 2);
        }
        break;
      }
      case 'ICE_BLOCKS': {
        const s = mech.width;
        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath();
        ctx.roundRect(-s / 2, -s / 2, s, s, 6);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }
      case 'ICICLES': {
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.moveTo(-mech.width / 2, 0);
        ctx.lineTo(mech.width / 2, 0);
        ctx.lineTo(0, mech.height);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'SNOWSTORM': {
        // Wind gusts & white blizzard streak overlays
        const dir = mech.extra?.direction || 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 20; i++) {
          const sy = ((time * 80 + i * 30) % groundY) - groundY / 2;
          const sx = ((time * 400 * dir + i * 70) % canvasWidth) - canvasWidth / 2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + dir * 60, sy + 6);
          ctx.stroke();
        }
        break;
      }
      case 'SANDSTORM': {
        // Hazy sand shroud
        ctx.fillStyle = 'rgba(217, 119, 6, 0.35)';
        ctx.fillRect(-canvasWidth / 2, -groundY / 2, canvasWidth, groundY);
        break;
      }
      case 'QUICKSAND': {
        const w = mech.width;
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(0, 10, w / 2, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Swirl
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 10, w * 0.3, time * 4, time * 4 + Math.PI);
        ctx.stroke();
        break;
      }
      case 'FALLING_ROCKS': {
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(0, 0, mech.width / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'CACTUS': {
        const r = mech.width / 2;
        ctx.rotate(time * (mech.extra?.rotSpeed || 4));
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        // Spikes
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          ctx.lineTo(Math.cos(a) * (r + 8), Math.sin(a) * (r + 8));
          ctx.stroke();
        }
        break;
      }
      case 'MAGIC_PROJECTILES': {
        ctx.fillStyle = '#ec4899';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'DARK_CREATURES': {
        ctx.fillStyle = '#312e81';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        // Glowing red eyes
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(-5, -2, 3, 0, Math.PI * 2);
        ctx.arc(5, -2, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'ENERGY_ZONE': {
        const w = mech.width;
        const h = mech.height;
        ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
        break;
      }
      case 'TELEPORTING_OBSTACLE': {
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.moveTo(0, -mech.height / 2);
        ctx.lineTo(mech.width / 2, 0);
        ctx.lineTo(0, mech.height / 2);
        ctx.lineTo(-mech.width / 2, 0);
        ctx.closePath();
        ctx.fill();
        break;
      }

      // Volcano
      case 'MAGMA_BOULDER_SPLIT': {
        if (!mech.extra?.hasSplit) {
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.arc(0, 0, mech.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3;
          ctx.stroke();
        } else {
          // Render two split fireballs rolling
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(mech.extra.shard1X - mech.x, 0, 16, 0, Math.PI * 2);
          ctx.arc(mech.extra.shard2X - mech.x, 0, 16, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'LAVA_GEYSER': {
        const w = mech.width;
        const h = mech.height;
        const grad = ctx.createLinearGradient(0, h, 0, 0);
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(0.7, '#ea580c');
        grad.addColorStop(1, '#dc2626');
        ctx.fillStyle = grad;
        ctx.fillRect(-w / 2, 0, w, h);
        break;
      }
      case 'VOLCANIC_ASH': {
        ctx.fillStyle = 'rgba(68, 64, 60, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 0, mech.width / 2, mech.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // Ocean
      case 'TORPEDO_SHARK': {
        const fromLeft = mech.extra?.fromLeft;
        const w = mech.width;
        const h = mech.height;
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Fin
        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        ctx.moveTo(0, -h / 2);
        ctx.lineTo(-w * 0.15, -h * 0.9);
        ctx.lineTo(w * 0.15, -h / 2);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'SINKING_ANCHOR': {
        const w = mech.width;
        const h = mech.height;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, -h / 2);
        ctx.lineTo(0, h / 2);
        ctx.arc(0, h * 0.2, w / 2, 0, Math.PI);
        ctx.stroke();
        break;
      }
      case 'WHIRLPOOL': {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, (mech.width / 2) * (0.4 + i * 0.3), time * 6 + i, time * 6 + i + Math.PI * 1.2);
          ctx.stroke();
        }
        break;
      }

      // Space
      case 'LASER_DRONE': {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-mech.width / 2, -mech.height / 2, mech.width, mech.height);
        if (mech.extra?.firing) {
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(-6, mech.height / 2, 12, groundY);
        }
        break;
      }
      case 'GRAVITY_PULSE': {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.fillRect(-mech.width / 2, -mech.height / 2, mech.width, mech.height);
        ctx.strokeStyle = '#818cf8';
        ctx.strokeRect(-mech.width / 2, -mech.height / 2, mech.width, mech.height);
        break;
      }
      case 'SPLITTING_COMET': {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 0, mech.width / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // Ancient Ruins
      case 'ROLLING_GIANT_STONE': {
        const r = mech.width / 2;
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 3;
        ctx.stroke();
        break;
      }
      case 'DART_TRAP': {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-mech.width / 2, -mech.height / 2, mech.width, mech.height);
        break;
      }

      // Cyberpunk
      case 'HOVER_CAR': {
        ctx.fillStyle = '#06b6d4';
        ctx.roundRect(-mech.width / 2, -mech.height / 2, mech.width, mech.height, 6);
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }
      case 'EMP_SHOCKWAVE': {
        ctx.fillStyle = 'rgba(236, 72, 153, 0.2)';
        ctx.fillRect(-mech.width / 2, -mech.height / 2, mech.width, mech.height);
        break;
      }

      // Haunted City
      case 'BANSHEE_WISP': {
        ctx.fillStyle = '#6ee7b7';
        ctx.beginPath();
        ctx.arc(0, 0, mech.width / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'GHOST_MIRROR': {
        ctx.fillStyle = 'rgba(167, 243, 208, 0.3)';
        ctx.fillRect(-mech.width / 2, -mech.height / 2, mech.width, mech.height);
        ctx.strokeStyle = '#10b981';
        ctx.strokeRect(-mech.width / 2, -mech.height / 2, mech.width, mech.height);
        break;
      }

      // Sky / Cloud
      case 'LIGHTNING_STRIKE': {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -groundY / 2);
        ctx.lineTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.lineTo(0, groundY / 2);
        ctx.stroke();
        break;
      }
      case 'GUST_OF_WIND': {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(-canvasWidth / 2, -groundY / 2, canvasWidth, groundY);
        break;
      }

      // Underground Cave
      case 'FALLING_STALACTITE': {
        ctx.fillStyle = '#c026d3';
        ctx.beginPath();
        ctx.moveTo(-mech.width / 2, 0);
        ctx.lineTo(mech.width / 2, 0);
        ctx.lineTo(0, mech.height);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'MINECART_RUSH': {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-mech.width / 2, -mech.height / 2, mech.width, mech.height);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(-mech.width * 0.3, mech.height / 2, 6, 0, Math.PI * 2);
        ctx.arc(mech.width * 0.3, mech.height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }
}
