export type GameModeState = 'MENU' | 'PLAYING' | 'PAUSED' | 'STAGE_TRANSITION' | 'GAME_OVER';

export type CharacterAnimState = 
  | 'IDLE' 
  | 'WALK' 
  | 'RUN' 
  | 'JUMP' 
  | 'HIT' 
  | 'COLLECT' 
  | 'ABILITY' 
  | 'GAME_OVER';

export type AbilityType = 'SPEED_BOOST' | 'TIME_FREEZE' | 'MAGNET' | 'SHIELD' | 'DOUBLE_SCORE';

export interface ActiveAbility {
  type: AbilityType;
  duration: number;      // total duration in ms
  remaining: number;     // remaining in ms
  icon: string;
  name: string;
  color: string;
}

export type ObjectCategory = 'COLLECTIBLE' | 'HAZARD' | 'POWERUP';

export interface FallingItem {
  id: string;
  category: ObjectCategory;
  name: string;
  subType: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
  points: number; // for collectibles
  abilityType?: AbilityType; // for powerups
  color: string;
  scale: number;
  isMagnetized?: boolean;
  isFrozen?: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  scale: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'square' | 'spark' | 'leaf' | 'snow' | 'star';
  rotation?: number;
  rotSpeed?: number;
}

export type MechanicType =
  // City
  | 'MOVING_CAR'
  | 'FALLING_SIGN'
  | 'CONSTRUCTION_OBJECT'
  // Forest
  | 'FALLING_BRANCH'
  | 'BEES'
  | 'THORN_ZONE'
  // Snow
  | 'ICE_FLOOR'
  | 'ICE_BLOCKS'
  | 'ICICLES'
  | 'SNOWSTORM'
  // Desert
  | 'SANDSTORM'
  | 'QUICKSAND'
  | 'FALLING_ROCKS'
  | 'CACTUS'
  // Night / Fantasy
  | 'MAGIC_PROJECTILES'
  | 'DARK_CREATURES'
  | 'ENERGY_ZONE'
  | 'TELEPORTING_OBSTACLE'
  // Volcano
  | 'MAGMA_BOULDER_SPLIT'
  | 'LAVA_GEYSER'
  | 'VOLCANIC_ASH'
  // Ocean
  | 'TORPEDO_SHARK'
  | 'SINKING_ANCHOR'
  | 'WHIRLPOOL'
  // Space
  | 'LASER_DRONE'
  | 'GRAVITY_PULSE'
  | 'SPLITTING_COMET'
  // Ancient Ruins
  | 'ROLLING_GIANT_STONE'
  | 'DART_TRAP'
  // Cyberpunk
  | 'HOVER_CAR'
  | 'EMP_SHOCKWAVE'
  // Haunted City
  | 'BANSHEE_WISP'
  | 'GHOST_MIRROR'
  // Sky / Cloud
  | 'LIGHTNING_STRIKE'
  | 'GUST_OF_WIND'
  // Underground Cave
  | 'FALLING_STALACTITE'
  | 'MINECART_RUSH';

export interface WorldMechanicInstance {
  id: string;
  type: MechanicType;
  title: string;
  warningText: string;
  state: 'WARNING' | 'ACTIVE' | 'ENDING';
  elapsed: number;
  warningDuration: number; // Minimum 0.8s
  activeDuration: number;
  // Spatial & Physics data
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  alpha: number;
  extra?: Record<string, any>;
}

export type DifficultyTier = 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Extreme';

export type AmbientWeatherType =
  | 'CITY_DUST'
  | 'LEAVES'
  | 'SNOW'
  | 'SAND'
  | 'MAGIC_WISPS'
  | 'CYBER_GRID'
  | 'MAGMA_EMBERS'
  | 'BUBBLES'
  | 'STAR_DUST'
  | 'SPORES'
  | 'ECTOPLASM'
  | 'FEATHERS'
  | 'CAVE_CRYSTALS';

export interface StageDefinition {
  id: number;
  worldIndex: number; // 0 to 12
  cycle: number;
  difficultyTier: DifficultyTier;
  name: string;
  subtitle: string;
  themeColor: string;
  accentColor: string;
  groundColor: string;
  groundDetailColor: string;
  skyGradient: [string, string];
  bgImage: string;
  ambientType: AmbientWeatherType;
  fallSpeedMultiplier: number;
  spawnRateMultiplier: number;
  availableMechanics: MechanicType[];
  hazards: Array<{
    name: string;
    subType: string;
    radius: number;
    weight: number;
    color: string;
  }>;
  collectibles: Array<{
    name: string;
    subType: string;
    points: number;
    radius: number;
    weight: number;
    color: string;
  }>;
  powerUps: Array<{
    abilityType: AbilityType;
    weight: number;
  }>;
}

export interface GameStats {
  score: number;
  highScore: number;
  stageNumber: number;
  cycle: number;
  difficultyTier: DifficultyTier;
  itemsCollected: number;
  hazardsAvoided: number;
  powerupsCollected: number;
  maxCombo: number;
  mechanicsSurvived: number;
}

export type GraphicsQuality = 'LOW' | 'MEDIUM' | 'HIGH';
export type TargetFPS = 30 | 60;
export type ControlSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type ControlPosition = 'SPLIT' | 'INVERTED' | 'WIDE';

export interface GameSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  vibrationEnabled: boolean;
  graphicsQuality: GraphicsQuality;
  targetFps: TargetFPS;
  batterySaver: boolean;
  controlSize: ControlSize;
  controlOpacity: number; // 0.2 to 1.0
  controlPosition: ControlPosition;
}

export interface AudioSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
}

