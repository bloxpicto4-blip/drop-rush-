import {
  GameModeState,
  ActiveAbility,
  FallingItem,
  FloatingText,
  Particle,
  StageDefinition,
  GameStats,
  AbilityType,
  WorldMechanicInstance,
} from './types';
import { getStageConfig } from './stages';
import { PlayerCharacter, createPlayer, updatePlayer, drawPlayer } from './character';
import { drawFallingItem } from './drawObjects';
import { soundEngine } from './audio';
import { MechanicsManager } from './mechanics';

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number, high: number) => void;
  onHeartsUpdate: (hearts: number) => void;
  onStageChange: (stageDef: StageDefinition, nextStageDef: StageDefinition | null) => void;
  onActiveAbilitiesChange: (abilities: ActiveAbility[]) => void;
  onGameOver: (stats: GameStats) => void;
  onWorldTimerUpdate: (timeRemaining: number, transitionProgress: number) => void;
}

function parseHex(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c.slice(0, 6), 16) || 0;
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function interpolateColor(c1: string, c2: string, factor: number): string {
  const f = Math.max(0, Math.min(1, factor));
  const rgb1 = parseHex(c1);
  const rgb2 = parseHex(c2);
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * f);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * f);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * f);
  return `rgb(${r}, ${g}, ${b})`;
}

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private callbacks: GameEngineCallbacks;

  // Viewport & Scale
  public width: number = 800;
  public height: number = 600;
  public dpr: number = 1;
  public groundY: number = 520;

  // State
  public state: GameModeState = 'MENU';
  public hearts: number = 3;
  public maxHearts: number = 3;
  public score: number = 0;
  public highScore: number = 0;
  public stageNumber: number = 1;
  public currentStage: StageDefinition;
  public nextStage: StageDefinition;

  // World Transformation Timing (60s cycle, 50s-60s transition)
  public stageTimer: number = 0;
  public readonly stageDuration: number = 60.0;
  public readonly transitionStartTime: number = 50.0;
  public transitionProgress: number = 0.0; // 0.0 before 50s, 0.0 -> 1.0 between 50s and 60s
  public visualTransformationProgress: number = 0.0; // 5-8s smooth visual transform

  // Mechanics Manager
  public mechanicsManager: MechanicsManager = new MechanicsManager();
  private mechanicsSurvivedCount: number = 0;

  // Entities
  public player: PlayerCharacter;
  public fallingItems: FallingItem[] = [];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];
  public ambientParticles: Particle[] = [];
  public activeAbilities: ActiveAbility[] = [];

  // Spawning & Timers
  private spawnTimer: number = 0;
  private spawnInterval: number = 0.9;
  private globalTime: number = 0;
  private combo: number = 0;
  private comboTimer: number = 0;
  private maxComboReached: number = 0;
  private itemsCollectedCount: number = 0;
  private hazardsAvoidedCount: number = 0;
  private powerupsCount: number = 0;

  // Screen Shake & Effects
  private shakeAmount: number = 0;

  // Input states
  public inputLeft: boolean = false;
  public inputRight: boolean = false;
  public inputJump: boolean = false;

  // Background image caches
  private bgImageCache: Map<string, HTMLImageElement> = new Map();
  private currentBgImage: HTMLImageElement | null = null;
  private nextBgImage: HTMLImageElement | null = null;

  // Animation Frame
  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: GameEngineCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
    this.callbacks = callbacks;

    // Load High Score
    try {
      this.highScore = parseInt(localStorage.getItem('drop_rush_high_score') || '0', 10);
    } catch {
      this.highScore = 0;
    }

    this.currentStage = getStageConfig(1);
    this.nextStage = getStageConfig(2);
    this.player = createPlayer(this.width, this.groundY);
    this.resize();
    this.preloadBackgrounds();
    this.initAmbientParticles();
  }

  private preloadBackgrounds() {
    for (let i = 1; i <= 5; i++) {
      const stage = getStageConfig(i);
      const img = new Image();
      img.src = stage.bgImage;
      img.onload = () => {
        this.bgImageCache.set(stage.bgImage, img);
        if (i === 1) this.currentBgImage = img;
        if (i === 2) this.nextBgImage = img;
      };
    }
  }

  public resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.groundY = Math.floor(this.height - Math.min(100, this.height * 0.16));

    if (this.player) {
      this.player.baseY = this.groundY - this.player.height;
      if (this.player.isGrounded) {
        this.player.y = this.player.baseY;
      }
    }
  }

  public startNewGame() {
    soundEngine.resumeContext();
    this.state = 'PLAYING';
    this.hearts = this.maxHearts;
    this.score = 0;
    this.stageNumber = 1;
    this.stageTimer = 0;
    this.transitionProgress = 0;
    this.visualTransformationProgress = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.maxComboReached = 0;
    this.itemsCollectedCount = 0;
    this.hazardsAvoidedCount = 0;
    this.powerupsCount = 0;
    this.mechanicsSurvivedCount = 0;
    this.activeAbilities = [];
    this.fallingItems = [];
    this.particles = [];
    this.floatingTexts = [];
    this.mechanicsManager.reset();

    this.currentStage = getStageConfig(1);
    this.nextStage = getStageConfig(2);
    this.currentBgImage = this.bgImageCache.get(this.currentStage.bgImage) || null;
    this.nextBgImage = this.bgImageCache.get(this.nextStage.bgImage) || null;

    this.player = createPlayer(this.width, this.groundY);

    this.callbacks.onHeartsUpdate(this.hearts);
    this.callbacks.onScoreUpdate(this.score, this.highScore);
    this.callbacks.onStageChange(this.currentStage, this.nextStage);
    this.callbacks.onActiveAbilitiesChange(this.activeAbilities);
    this.callbacks.onWorldTimerUpdate(60, 0);

    soundEngine.startStageMusic(1);
    this.initAmbientParticles();
  }

  public pauseGame() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
    }
  }

  public resumeGame() {
    if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.lastTime = performance.now();
    }
  }

  public startLoop() {
    this.lastTime = performance.now();
    const loop = (timestamp: number) => {
      const rawDt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;

      this.update(rawDt);
      this.render();

      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stopLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    soundEngine.stopMusic();
  }

  // ---- UPDATE CYCLE ----

  private update(dt: number) {
    this.globalTime += dt;

    if (this.shakeAmount > 0) {
      this.shakeAmount = Math.max(0, this.shakeAmount - dt * 30);
    }

    this.updateAmbientParticles(dt);

    if (this.state === 'MENU') {
      updatePlayer(this.player, dt, false, false, false, this.width, this.groundY, false);
      return;
    }

    if (this.state === 'PAUSED') {
      return;
    }

    // World Transformation Timeline (Every 60s, transition from 50s to 60s)
    this.stageTimer += dt;

    if (this.stageTimer < this.transitionStartTime) {
      // Normal World Phase (0s to 50s)
      this.transitionProgress = 0.0;
      this.visualTransformationProgress = 0.0;
    } else if (this.stageTimer < this.stageDuration) {
      // Transition Phase (50s to 60s)
      const transitionElapsed = this.stageTimer - this.transitionStartTime;
      this.transitionProgress = Math.min(1.0, transitionElapsed / 10.0);
      // 5-8 second visual transformation animation
      this.visualTransformationProgress = Math.min(1.0, transitionElapsed / 7.0);
    } else {
      // World Transformation Complete at 60s!
      this.completeWorldTransformation();
    }

    const timeRemaining = Math.max(0, this.stageDuration - this.stageTimer);
    this.callbacks.onWorldTimerUpdate(timeRemaining, this.transitionProgress);

    // Combo timer decay
    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }

    // Active Abilities Timers & Antimagic check
    const isFrozen = this.hasAbility('TIME_FREEZE');
    const hasSpeed = this.hasAbility('SPEED_BOOST');
    const hasMagnet = this.hasAbility('MAGNET');

    let abilityChanged = false;
    for (let i = this.activeAbilities.length - 1; i >= 0; i--) {
      this.activeAbilities[i].remaining -= dt * 1000;
      if (this.activeAbilities[i].remaining <= 0) {
        this.activeAbilities.splice(i, 1);
        abilityChanged = true;
      }
    }
    if (abilityChanged) {
      this.callbacks.onActiveAbilitiesChange([...this.activeAbilities]);
    }

    // Update Player Movement
    updatePlayer(
      this.player,
      dt,
      this.inputLeft,
      this.inputRight,
      this.inputJump,
      this.width,
      this.groundY,
      hasSpeed,
      isFrozen
    );

    // Update World Mechanics
    // Active mechanics depend on current stage, and during transition can blend
    const activeMechanicPool =
      this.transitionProgress > 0.5
        ? this.nextStage.availableMechanics
        : this.currentStage.availableMechanics;

    this.mechanicsManager.update(
      dt,
      activeMechanicPool,
      this.currentStage.difficultyTier,
      this.width,
      this.groundY,
      this.player,
      (mech) => this.handleMechanicHit(mech)
    );

    // Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life += dt;
      ft.y += ft.vy * dt;
      ft.scale = Math.min(1.3, 1 + Math.sin((ft.life / ft.maxLife) * Math.PI) * 0.3);
      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 300 * dt;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.rotation !== undefined && p.rotSpeed !== undefined) {
        p.rotation += p.rotSpeed * dt;
      }
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // Falling Objects Spawner
    this.spawnTimer += dt;
    // Current spawn multiplier blends smoothly into next world's rate
    const currentRate = this.currentStage.spawnRateMultiplier;
    const nextRate = this.nextStage.spawnRateMultiplier;
    const effectiveRate = currentRate + (nextRate - currentRate) * this.transitionProgress;
    const effectiveInterval = Math.max(0.3, this.spawnInterval / effectiveRate);

    if (this.spawnTimer >= effectiveInterval) {
      this.spawnTimer = 0;
      this.spawnFallingItem();
    }

    // Update Falling Items
    for (let i = this.fallingItems.length - 1; i >= 0; i--) {
      const item = this.fallingItems[i];

      if (isFrozen && item.category !== 'POWERUP') {
        item.isFrozen = true;
      } else {
        item.isFrozen = false;
        if (hasMagnet && (item.category === 'COLLECTIBLE' || item.category === 'POWERUP')) {
          const dx = this.player.x - item.x;
          const dy = (this.player.y + this.player.height * 0.5) - item.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 420) {
            item.isMagnetized = true;
            const pullForce = 850 / Math.max(1, dist * 0.008);
            item.vx += (dx / dist) * pullForce * dt;
            item.vy += (dy / dist) * pullForce * dt;
          }
        }

        item.x += item.vx * dt;
        item.y += item.vy * dt;
        item.rotation += item.rotSpeed * dt;
      }

      // Check Collision with Player
      if (this.state === 'PLAYING') {
        if (this.checkCollision(this.player, item)) {
          this.handleItemHit(item);
          this.fallingItems.splice(i, 1);
          continue;
        }
      }

      // Check Ground Hit
      if (item.y >= this.groundY - 10) {
        if (item.category === 'HAZARD') {
          this.hazardsAvoidedCount++;
          this.spawnGroundDust(item.x, this.groundY, item.color);
        }
        this.fallingItems.splice(i, 1);
      }
    }
  }

  private completeWorldTransformation() {
    this.stageNumber++;
    this.stageTimer = 0;
    this.transitionProgress = 0;
    this.visualTransformationProgress = 0;

    // Advance Stage Config
    this.currentStage = this.nextStage;
    this.nextStage = getStageConfig(this.stageNumber + 1);

    this.currentBgImage = this.bgImageCache.get(this.currentStage.bgImage) || null;
    this.nextBgImage = this.bgImageCache.get(this.nextStage.bgImage) || null;

    soundEngine.playStageClearSound();
    soundEngine.startStageMusic(this.stageNumber);

    // Bonus heart reward
    if (this.hearts < this.maxHearts) {
      this.hearts++;
      this.callbacks.onHeartsUpdate(this.hearts);
      this.spawnFloatingText('+1 ❤️ BONUS!', this.player.x, this.player.y - 40, '#22c55e', 22);
    }

    this.spawnFloatingText(`WELCOME TO ${this.currentStage.name}!`, this.width / 2, this.height * 0.35, this.currentStage.themeColor, 26);
    this.callbacks.onStageChange(this.currentStage, this.nextStage);

    this.initAmbientParticles();
  }

  // ---- COLLISION & MECHANICS ----

  private checkCollision(p: PlayerCharacter, item: FallingItem): boolean {
    const px = p.x;
    const py = p.y + p.height * 0.45;
    const pRadius = p.width * 0.52;

    const dx = px - item.x;
    const dy = py - item.y;
    const dist = Math.hypot(dx, dy);
    return dist < (pRadius + item.radius);
  }

  private handleItemHit(item: FallingItem) {
    if (item.category === 'COLLECTIBLE') {
      this.collectItem(item);
    } else if (item.category === 'POWERUP') {
      this.collectPowerUp(item);
    } else if (item.category === 'HAZARD') {
      this.hitHazard(item.color, item.x, item.y);
    }
  }

  private handleMechanicHit(mech: WorldMechanicInstance) {
    this.hitHazard('#ef4444', this.player.x, this.player.y + 20);
    this.mechanicsSurvivedCount++;
  }

  private collectItem(item: FallingItem) {
    this.itemsCollectedCount++;
    this.combo++;
    this.comboTimer = 2.4;
    if (this.combo > this.maxComboReached) {
      this.maxComboReached = this.combo;
    }

    const hasDouble = this.hasAbility('DOUBLE_SCORE');
    const multiplier = hasDouble ? 2 : 1;
    const pointsGained = item.points * multiplier;

    this.score += pointsGained;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        localStorage.setItem('drop_rush_high_score', this.highScore.toString());
      } catch {
        // ignore
      }
    }

    this.callbacks.onScoreUpdate(this.score, this.highScore);

    if (item.points >= 50) {
      soundEngine.playSpecialCoinSound();
    } else {
      soundEngine.playCoinSound(this.combo);
    }

    this.player.collectTimer = 0.35;

    let label = `+${pointsGained}`;
    if (hasDouble) label += ' 2X!';
    this.spawnFloatingText(label, item.x, item.y - 10, '#fbbf24', 18);
    this.spawnSparkleBurst(item.x, item.y, item.color, 12);
  }

  private collectPowerUp(item: FallingItem) {
    if (!item.abilityType) return;
    this.powerupsCount++;

    soundEngine.playAbilitySound();
    this.player.collectTimer = 0.45;

    const abilityConfig = this.getAbilityDetails(item.abilityType);
    const existingIndex = this.activeAbilities.findIndex(a => a.type === item.abilityType);

    if (existingIndex >= 0) {
      this.activeAbilities[existingIndex].remaining = abilityConfig.duration;
    } else {
      this.activeAbilities.push({
        type: item.abilityType,
        duration: abilityConfig.duration,
        remaining: abilityConfig.duration,
        icon: abilityConfig.icon,
        name: abilityConfig.name,
        color: abilityConfig.color,
      });
    }

    this.callbacks.onActiveAbilitiesChange([...this.activeAbilities]);

    if (item.abilityType === 'SHIELD') soundEngine.playShieldActivateSound();
    if (item.abilityType === 'TIME_FREEZE') soundEngine.playFreezeSound();
    if (item.abilityType === 'SPEED_BOOST') soundEngine.playSpeedSound();
    if (item.abilityType === 'MAGNET') soundEngine.playMagnetSound();

    this.spawnFloatingText(
      `${abilityConfig.icon} ${abilityConfig.name.toUpperCase()}!`,
      this.player.x,
      this.player.y - 30,
      abilityConfig.color,
      20
    );

    this.spawnSparkleBurst(item.x, item.y, abilityConfig.color, 24);
  }

  private hitHazard(color: string, x: number, y: number) {
    const shieldIndex = this.activeAbilities.findIndex(a => a.type === 'SHIELD');
    if (shieldIndex >= 0) {
      this.activeAbilities.splice(shieldIndex, 1);
      this.callbacks.onActiveAbilitiesChange([...this.activeAbilities]);

      soundEngine.playShieldBreakSound();
      this.shakeAmount = 10;
      this.spawnFloatingText('SHIELD BROKEN!', this.player.x, this.player.y - 30, '#38bdf8', 20);
      this.spawnDebrisBurst(x, y, '#38bdf8', 25);
      return;
    }

    if (this.player.invulnerableTimer > 0) {
      return;
    }

    this.hearts = Math.max(0, this.hearts - 1);
    this.combo = 0;
    this.shakeAmount = 22;
    this.player.hitTimer = 0.55;
    this.player.invulnerableTimer = 1.6;

    soundEngine.playHitSound();
    this.callbacks.onHeartsUpdate(this.hearts);

    this.spawnFloatingText('-1 ❤️', this.player.x, this.player.y - 25, '#ef4444', 22);
    this.spawnDebrisBurst(x, y, color, 20);

    if (this.hearts <= 0) {
      this.triggerGameOver();
    }
  }

  private triggerGameOver() {
    this.state = 'GAME_OVER';
    this.player.animState = 'GAME_OVER';
    soundEngine.stopMusic();
    soundEngine.playGameOverSound();

    const stats: GameStats = {
      score: this.score,
      highScore: this.highScore,
      stageNumber: this.stageNumber,
      cycle: this.currentStage.cycle,
      difficultyTier: this.currentStage.difficultyTier,
      itemsCollected: this.itemsCollectedCount,
      hazardsAvoided: this.hazardsAvoidedCount,
      powerupsCollected: this.powerupsCount,
      maxCombo: this.maxComboReached,
      mechanicsSurvived: this.mechanicsSurvivedCount,
    };

    setTimeout(() => {
      this.callbacks.onGameOver(stats);
    }, 900);
  }

  // ---- SPAWNING ENGINE ----

  private spawnFallingItem() {
    // Gradually replace falling objects during transition!
    const useNextStagePool = Math.random() < this.transitionProgress;
    const stage = useNextStagePool ? this.nextStage : this.currentStage;

    const roll = Math.random();
    let category: 'COLLECTIBLE' | 'HAZARD' | 'POWERUP' = 'COLLECTIBLE';
    if (roll < 0.34) {
      category = 'HAZARD';
    } else if (roll < 0.44) {
      category = 'POWERUP';
    }

    const pad = 40;
    const spawnX = pad + Math.random() * (this.width - pad * 2);
    const spawnY = -30;

    const baseSpeed = 160 + (this.stageNumber - 1) * 12;
    const fallSpeed = (baseSpeed + Math.random() * 80) * stage.fallSpeedMultiplier;

    if (category === 'COLLECTIBLE') {
      const colDef = this.weightedChoice(stage.collectibles);
      this.fallingItems.push({
        id: Math.random().toString(36).substring(2, 9),
        category: 'COLLECTIBLE',
        name: colDef.name,
        subType: colDef.subType,
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * 40,
        vy: fallSpeed,
        radius: colDef.radius,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 2.5,
        points: colDef.points,
        color: colDef.color,
        scale: 1,
      });
    } else if (category === 'HAZARD') {
      const hazDef = this.weightedChoice(stage.hazards);
      this.fallingItems.push({
        id: Math.random().toString(36).substring(2, 9),
        category: 'HAZARD',
        name: hazDef.name,
        subType: hazDef.subType,
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * 60,
        vy: fallSpeed * 1.1,
        radius: hazDef.radius,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 4.0,
        points: 0,
        color: hazDef.color,
        scale: 1,
      });
    } else {
      const powDef = this.weightedChoice(stage.powerUps);
      const details = this.getAbilityDetails(powDef.abilityType);
      this.fallingItems.push({
        id: Math.random().toString(36).substring(2, 9),
        category: 'POWERUP',
        name: details.name,
        subType: powDef.abilityType,
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * 30,
        vy: fallSpeed * 0.85,
        radius: 20,
        rotation: 0,
        rotSpeed: 1.5,
        points: 20,
        abilityType: powDef.abilityType,
        color: details.color,
        scale: 1,
      });
    }
  }

  private weightedChoice<T extends { weight: number }>(items: T[]): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const item of items) {
      if (rand < item.weight) return item;
      rand -= item.weight;
    }
    return items[0];
  }

  private getAbilityDetails(type: AbilityType) {
    switch (type) {
      case 'SPEED_BOOST':
        return { name: 'Speed Boost', duration: 5000, icon: '⚡', color: '#38bdf8' };
      case 'TIME_FREEZE':
        return { name: 'Time Freeze', duration: 3000, icon: '⏱️', color: '#67e8f9' };
      case 'MAGNET':
        return { name: 'Coin Magnet', duration: 7000, icon: '🧲', color: '#a855f7' };
      case 'SHIELD':
        return { name: 'Aegis Shield', duration: 999999, icon: '🛡️', color: '#6366f1' };
      case 'DOUBLE_SCORE':
        return { name: 'Double Score', duration: 8000, icon: '⭐', color: '#fbbf24' };
    }
  }

  public hasAbility(type: AbilityType): boolean {
    return this.activeAbilities.some(a => a.type === type);
  }

  // ---- PARTICLES & VISUALS ----

  private spawnSparkleBurst(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 180;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 60,
        size: 3 + Math.random() * 4,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.4,
        shape: 'spark',
      });
    }
  }

  private spawnDebrisBurst(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 90 + Math.random() * 260;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 120,
        size: 4 + Math.random() * 6,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.5,
        shape: 'square',
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 8,
      });
    }
  }

  private spawnGroundDust(x: number, y: number, color: string) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y - 4,
        vx: (Math.random() - 0.5) * 70,
        vy: -20 - Math.random() * 40,
        size: 5 + Math.random() * 5,
        color,
        alpha: 0.6,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
        shape: 'circle',
      });
    }
  }

  private spawnFloatingText(text: string, x: number, y: number, color: string, size: number) {
    this.floatingTexts.push({
      id: Math.random().toString(),
      text,
      x,
      y,
      vy: -55,
      life: 0,
      maxLife: 1.1,
      color,
      size,
      scale: 1,
    });
  }

  private initAmbientParticles() {
    this.ambientParticles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 40,
        vy: 20 + Math.random() * 60,
        size: 2 + Math.random() * 5,
        color: this.currentStage.accentColor,
        alpha: 0.3 + Math.random() * 0.4,
        life: Math.random() * 5,
        maxLife: 5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 2,
      });
    }
  }

  private updateAmbientParticles(dt: number) {
    // If transitioning, ambient type blends
    const ambientType =
      this.transitionProgress > 0.5
        ? this.nextStage.ambientType
        : this.currentStage.ambientType;

    for (const p of this.ambientParticles) {
      if (ambientType === 'SNOW') {
        p.vy = 50 + Math.sin(p.life * 2) * 20;
        p.vx = Math.sin(p.life * 1.5) * 25;
      } else if (ambientType === 'LEAVES') {
        p.vy = 45;
        p.vx = Math.sin(p.life * 2.5) * 40;
      } else if (ambientType === 'MAGIC_WISPS') {
        p.vy = -35;
        p.vx = Math.cos(p.life * 2) * 30;
      } else if (ambientType === 'SAND') {
        p.vx = 80 + Math.random() * 40;
        p.vy = 20;
      } else {
        p.vx = Math.sin(p.life) * 15;
        p.vy = 25;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life += dt;

      if (p.y > this.height) {
        p.y = -10;
        p.x = Math.random() * this.width;
      } else if (p.y < -10) {
        p.y = this.height;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width) p.x = 0;
      if (p.x < 0) p.x = this.width;
    }
  }

  // ---- RENDER CYCLE ----

  private render() {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    if (this.shakeAmount > 0) {
      const sx = (Math.random() - 0.5) * this.shakeAmount;
      const sy = (Math.random() - 0.5) * this.shakeAmount;
      ctx.translate(sx, sy);
    }

    // 1. Draw Gradual Sky & Background Transformation
    this.renderBackground(ctx);

    // 2. Draw Ambient Weather Particles
    this.renderAmbientParticles(ctx);

    // 3. Draw Ground Plane (with gradual color morphing)
    this.renderGround(ctx);

    // 4. Draw World Mechanics (Obstacles, Hazard Zones, Cars, Bees, etc.)
    this.mechanicsManager.render(ctx, this.width, this.groundY, this.globalTime);

    // 5. Draw Falling Items
    for (const item of this.fallingItems) {
      drawFallingItem(ctx, item, this.globalTime);
    }

    // 6. Draw Player Character
    drawPlayer(ctx, this.player, this.activeAbilities);

    // 7. Draw Particle Effects
    this.renderParticles(ctx);

    // 8. Draw Floating Numbers / Text
    this.renderFloatingTexts(ctx);

    // 9. Draw World Transformation Vignette during transition (50s - 60s)
    if (this.transitionProgress > 0) {
      this.renderTransformationOverlay(ctx);
    }

    ctx.restore();
  }

  private renderBackground(ctx: CanvasRenderingContext2D) {
    const stage = this.currentStage;
    const next = this.nextStage;
    const t = this.visualTransformationProgress;

    // Smooth Sky Gradient Interpolation
    const skyTop = interpolateColor(stage.skyGradient[0], next.skyGradient[0], t);
    const skyBottom = interpolateColor(stage.skyGradient[1], next.skyGradient[1], t);

    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, skyTop);
    grad.addColorStop(1, skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Render Current Background Image
    if (this.currentBgImage) {
      ctx.save();
      ctx.globalAlpha = 1.0 - t;
      this.drawCoverImage(ctx, this.currentBgImage);
      ctx.restore();
    }

    // Render Next Background Image (fading in smoothly over 5-8s)
    if (this.nextBgImage && t > 0) {
      ctx.save();
      ctx.globalAlpha = t;
      this.drawCoverImage(ctx, this.nextBgImage);
      ctx.restore();
    }

    // Gradual Lighting & Tint shift
    const tintColor = interpolateColor(stage.themeColor, next.themeColor, t);
    ctx.fillStyle = tintColor;
    ctx.globalAlpha = 0.08;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.globalAlpha = 1.0;
  }

  private drawCoverImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (iw === 0 || ih === 0) return;

    const scale = Math.max(this.width / iw, this.height / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const ox = (this.width - nw) / 2;
    const oy = (this.height - nh) / 2;

    ctx.drawImage(img, ox, oy, nw, nh);
  }

  private renderGround(ctx: CanvasRenderingContext2D) {
    const stage = this.currentStage;
    const next = this.nextStage;
    const t = this.visualTransformationProgress;
    const gy = this.groundY;
    const gh = this.height - gy;

    // Smooth Ground Color Interpolation
    const groundColor = interpolateColor(stage.groundColor, next.groundColor, t);
    const rimColor = interpolateColor(stage.groundDetailColor, next.groundDetailColor, t);

    // Ground Base
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, gy, this.width, gh);

    // Top Rim
    ctx.fillStyle = rimColor;
    ctx.fillRect(0, gy, this.width, 4);

    // Details blend
    ctx.save();
    const effectiveAmbient = t > 0.5 ? next.ambientType : stage.ambientType;
    if (effectiveAmbient === 'CITY_DUST') {
      ctx.fillStyle = rimColor;
      for (let x = 20; x < this.width; x += 60) {
        ctx.fillRect(x, gy + gh * 0.45, 30, 4);
      }
    } else if (effectiveAmbient === 'SNOW') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= this.width; x += 40) {
        ctx.lineTo(x, gy - 2 + Math.sin(x * 0.05) * 3);
      }
      ctx.lineTo(this.width, gy + 10);
      ctx.lineTo(0, gy + 10);
      ctx.closePath();
      ctx.fill();
    } else if (effectiveAmbient === 'MAGIC_WISPS') {
      ctx.strokeStyle = rimColor;
      ctx.lineWidth = 1.5;
      for (let x = 40; x < this.width; x += 90) {
        ctx.beginPath();
        ctx.arc(x, gy + 16, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  private renderAmbientParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.ambientParticles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      const amb = this.visualTransformationProgress > 0.5 ? this.nextStage.ambientType : this.currentStage.ambientType;
      if (amb === 'SNOW') {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (amb === 'LEAVES') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (amb === 'MAGIC_WISPS') {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'spark') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'square') {
        ctx.translate(p.x, p.y);
        if (p.rotation) ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D) {
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.translate(ft.x, ft.y);
      ctx.scale(ft.scale, ft.scale);
      const alpha = Math.max(0, 1 - ft.life / ft.maxLife);
      ctx.globalAlpha = alpha;

      ctx.font = `bold ${ft.size}px "Rubik", "Fredoka", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, 0, 0);

      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, 0, 0);
      ctx.restore();
    }
  }

  private renderTransformationOverlay(ctx: CanvasRenderingContext2D) {
    // Subtle luminous transformation ripple banner at bottom or top
    const cx = this.width / 2;
    const cy = 100;
    const t = this.transitionProgress;

    ctx.save();
    ctx.globalAlpha = Math.min(1.0, Math.sin(t * Math.PI) * 1.2);

    // Glowing border ribbon
    const grad = ctx.createLinearGradient(0, cy - 20, 0, cy + 20);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0.7)');

    ctx.fillStyle = grad;
    ctx.fillRect(cx - 160, cy - 16, 320, 32);
    ctx.strokeStyle = this.nextStage.accentColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 160, cy - 16, 320, 32);

    ctx.font = 'bold 12px "Rubik", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`APPROACHING ${this.nextStage.name}...`, cx, cy);

    // Progress bar inside
    ctx.fillStyle = this.nextStage.themeColor;
    ctx.fillRect(cx - 150, cy + 10, 300 * t, 2.5);

    ctx.restore();
  }
}
