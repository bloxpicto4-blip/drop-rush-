import { StageDefinition, AbilityType, MechanicType, DifficultyTier, AmbientWeatherType } from './types';

import bgCity from '../assets/images/bg_city_skyline_1790507349424.jpg';
import bgForest from '../assets/images/bg_forest_canopy_1790507361368.jpg';
import bgSnow from '../assets/images/bg_snow_mountains_1790507372583.jpg';
import bgDesert from '../assets/images/bg_desert_dunes_1790507383817.jpg';
import bgFantasy from '../assets/images/bg_fantasy_night_1790507396045.jpg';
import bgVolcano from '../assets/images/bg_volcano_magma_1790508970780.jpg';
import bgOcean from '../assets/images/bg_ocean_depths_1790508982943.jpg';
import bgSpace from '../assets/images/bg_cosmic_space_1790508994306.jpg';
import bgCyber from '../assets/images/bg_cyberpunk_neon_1790509006087.jpg';

interface BaseWorldData {
  worldIndex: number;
  name: string;
  themeColor: string;
  accentColor: string;
  groundColor: string;
  groundDetailColor: string;
  skyGradient: [string, string];
  bgImage: string;
  ambientType: AmbientWeatherType;
  availableMechanics: MechanicType[];
  baseHazards: Array<{
    name: string;
    subType: string;
    radius: number;
    weight: number;
    color: string;
  }>;
  cycleVariations: Array<{
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

export const BASE_WORLDS: BaseWorldData[] = [
  // 1. CITY (Metropolis)
  {
    worldIndex: 0,
    name: 'METROPOLIS',
    themeColor: '#38bdf8',
    accentColor: '#f59e0b',
    groundColor: '#334155',
    groundDetailColor: '#eab308',
    skyGradient: ['#0f172a', '#1e293b'],
    bgImage: bgCity,
    ambientType: 'CITY_DUST',
    availableMechanics: ['MOVING_CAR', 'FALLING_SIGN', 'CONSTRUCTION_OBJECT'],
    baseHazards: [
      { name: 'Falling Brick', subType: 'city_brick', radius: 18, weight: 20, color: '#b91c1c' },
      { name: 'Heavy Crate', subType: 'city_crate', radius: 24, weight: 18, color: '#b45309' },
      { name: 'Broken Bottle', subType: 'city_bottle', radius: 16, weight: 16, color: '#047857' },
      { name: 'Traffic Cone', subType: 'city_cone', radius: 20, weight: 16, color: '#ea580c' },
      { name: 'Manhole Cover', subType: 'city_brick', radius: 22, weight: 14, color: '#475569' },
      { name: 'Loose Scaffolding', subType: 'city_crate', radius: 25, weight: 12, color: '#d97706' },
      { name: 'Oil Slick Barrel', subType: 'city_bottle', radius: 21, weight: 10, color: '#1e293b' },
    ],
    cycleVariations: [
      { name: 'High-Voltage Wire', subType: 'city_brick', radius: 19, weight: 25, color: '#38bdf8' },
      { name: 'Industrial Scrap', subType: 'city_crate', radius: 25, weight: 25, color: '#64748b' },
    ],
    collectibles: [
      { name: 'Gold Coin', subType: 'city_coin', points: 10, radius: 16, weight: 45, color: '#fbbf24' },
      { name: 'Shiny Can', subType: 'city_can', points: 15, radius: 16, weight: 25, color: '#38bdf8' },
      { name: 'Pizza Slice', subType: 'city_pizza', points: 25, radius: 18, weight: 20, color: '#f97316' },
      { name: 'Golden Briefcase', subType: 'city_briefcase', points: 50, radius: 22, weight: 10, color: '#eab308' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 25 },
      { abilityType: 'MAGNET', weight: 25 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 15 },
      { abilityType: 'DOUBLE_SCORE', weight: 10 },
    ],
  },

  // 2. FOREST (Mystic Woods)
  {
    worldIndex: 1,
    name: 'MYSTIC WOODS',
    themeColor: '#4ade80',
    accentColor: '#10b981',
    groundColor: '#27272a',
    groundDetailColor: '#15803d',
    skyGradient: ['#064e3b', '#022c22'],
    bgImage: bgForest,
    ambientType: 'LEAVES',
    availableMechanics: ['FALLING_BRANCH', 'BEES', 'THORN_ZONE'],
    baseHazards: [
      { name: 'Spiked Rock', subType: 'forest_stone', radius: 22, weight: 20, color: '#71717a' },
      { name: 'Heavy Branch', subType: 'forest_branch', radius: 24, weight: 20, color: '#78350f' },
      { name: 'Thorny Pinecone', subType: 'forest_pinecone', radius: 18, weight: 18, color: '#92400e' },
      { name: 'Rotten Log', subType: 'forest_log', radius: 26, weight: 14, color: '#451a03' },
      { name: 'Poison Spore Pod', subType: 'forest_stone', radius: 19, weight: 14, color: '#9333ea' },
      { name: 'Prickly Burrs', subType: 'forest_pinecone', radius: 17, weight: 12, color: '#854d0e' },
      { name: 'Hollow Oak Knot', subType: 'forest_log', radius: 23, weight: 10, color: '#3f2e18' },
    ],
    cycleVariations: [
      { name: 'Thorny Bramble Bulb', subType: 'forest_stone', radius: 23, weight: 25, color: '#831843' },
      { name: 'Ancient Hollow Stump', subType: 'forest_log', radius: 27, weight: 20, color: '#292524' },
    ],
    collectibles: [
      { name: 'Crisp Apple', subType: 'forest_apple', points: 10, radius: 16, weight: 45, color: '#ef4444' },
      { name: 'Golden Acorn', subType: 'forest_acorn', points: 15, radius: 16, weight: 25, color: '#d97706' },
      { name: 'Magic Mushroom', subType: 'forest_mushroom', points: 25, radius: 18, weight: 20, color: '#a855f7' },
      { name: 'Nature Orb', subType: 'forest_orb', points: 50, radius: 22, weight: 10, color: '#10b981' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 20 },
      { abilityType: 'MAGNET', weight: 25 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 20 },
      { abilityType: 'DOUBLE_SCORE', weight: 10 },
    ],
  },

  // 3. SNOW (Frozen Peaks)
  {
    worldIndex: 2,
    name: 'FROZEN PEAKS',
    themeColor: '#67e8f9',
    accentColor: '#38bdf8',
    groundColor: '#e2e8f0',
    groundDetailColor: '#93c5fd',
    skyGradient: ['#0c4a6e', '#0369a1'],
    bgImage: bgSnow,
    ambientType: 'SNOW',
    availableMechanics: ['ICE_FLOOR', 'ICE_BLOCKS', 'ICICLES', 'SNOWSTORM'],
    baseHazards: [
      { name: 'Sharp Icicle', subType: 'snow_icicle', radius: 20, weight: 22, color: '#bae6fd' },
      { name: 'Giant Snowball', subType: 'snow_ball', radius: 26, weight: 20, color: '#f8fafc' },
      { name: 'Jagged Ice Chunk', subType: 'snow_icechunk', radius: 22, weight: 18, color: '#7dd3fc' },
      { name: 'Frozen Boulder', subType: 'snow_rock', radius: 24, weight: 14, color: '#64748b' },
      { name: 'Heavy Frost Anvil', subType: 'snow_rock', radius: 25, weight: 12, color: '#0369a1' },
      { name: 'Spiked Hail Cluster', subType: 'snow_icechunk', radius: 20, weight: 12, color: '#e0f2fe' },
      { name: 'Frozen Stalagmite', subType: 'snow_icicle', radius: 23, weight: 10, color: '#38bdf8' },
    ],
    cycleVariations: [
      { name: 'Hailstone Shard', subType: 'snow_icechunk', radius: 21, weight: 25, color: '#38bdf8' },
      { name: 'Glacial Ice Anvil', subType: 'snow_rock', radius: 25, weight: 20, color: '#0284c7' },
    ],
    collectibles: [
      { name: 'Frost Berry', subType: 'snow_berry', points: 10, radius: 16, weight: 45, color: '#ec4899' },
      { name: 'Ice Gem', subType: 'snow_gem', points: 15, radius: 16, weight: 25, color: '#38bdf8' },
      { name: 'Silver Snowflake', subType: 'snow_flake_gem', points: 25, radius: 18, weight: 20, color: '#e0e7ff' },
      { name: 'Diamond Star', subType: 'snow_star', points: 50, radius: 22, weight: 10, color: '#67e8f9' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 20 },
      { abilityType: 'MAGNET', weight: 20 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 25 },
      { abilityType: 'DOUBLE_SCORE', weight: 10 },
    ],
  },

  // 4. DESERT (Solar Dunes)
  {
    worldIndex: 3,
    name: 'SOLAR DUNES',
    themeColor: '#fb923c',
    accentColor: '#f59e0b',
    groundColor: '#78350f',
    groundDetailColor: '#d97706',
    skyGradient: ['#7c2d12', '#9a3412'],
    bgImage: bgDesert,
    ambientType: 'SAND',
    availableMechanics: ['SANDSTORM', 'QUICKSAND', 'FALLING_ROCKS', 'CACTUS'],
    baseHazards: [
      { name: 'Spiky Cactus', subType: 'desert_cactus', radius: 22, weight: 22, color: '#16a34a' },
      { name: 'Sandstone Boulder', subType: 'desert_boulder', radius: 25, weight: 20, color: '#b45309' },
      { name: 'Heavy Clay Pot', subType: 'desert_pot', radius: 20, weight: 18, color: '#ea580c' },
      { name: 'Ancient Trap Spike', subType: 'desert_spike', radius: 18, weight: 16, color: '#78350f' },
      { name: 'Sunbaked Skull', subType: 'desert_pot', radius: 20, weight: 12, color: '#fef3c7' },
      { name: 'Granite Slab', subType: 'desert_boulder', radius: 24, weight: 12, color: '#9a3412' },
      { name: 'Scorpion Spine', subType: 'desert_spike', radius: 19, weight: 10, color: '#b91c1c' },
    ],
    cycleVariations: [
      { name: 'Cursed Sand Urn', subType: 'desert_pot', radius: 22, weight: 25, color: '#991b1b' },
      { name: 'Molten Meteor Rock', subType: 'desert_boulder', radius: 26, weight: 20, color: '#ea580c' },
    ],
    collectibles: [
      { name: 'Scarab Coin', subType: 'desert_coin', points: 10, radius: 16, weight: 45, color: '#eab308' },
      { name: 'Sweet Date', subType: 'desert_date', points: 15, radius: 16, weight: 25, color: '#92400e' },
      { name: 'Ruby Amulet', subType: 'desert_amulet', points: 25, radius: 18, weight: 20, color: '#dc2626' },
      { name: 'Pharaoh Relic', subType: 'desert_relic', points: 50, radius: 22, weight: 10, color: '#fbbf24' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 25 },
      { abilityType: 'MAGNET', weight: 25 },
      { abilityType: 'SHIELD', weight: 20 },
      { abilityType: 'TIME_FREEZE', weight: 15 },
      { abilityType: 'DOUBLE_SCORE', weight: 15 },
    ],
  },

  // 5. NIGHT / FANTASY (Astral Realm)
  {
    worldIndex: 4,
    name: 'ASTRAL REALM',
    themeColor: '#c084fc',
    accentColor: '#e879f9',
    groundColor: '#1e1b4b',
    groundDetailColor: '#818cf8',
    skyGradient: ['#0f051d', '#2e1065'],
    bgImage: bgFantasy,
    ambientType: 'MAGIC_WISPS',
    availableMechanics: ['MAGIC_PROJECTILES', 'DARK_CREATURES', 'ENERGY_ZONE', 'TELEPORTING_OBSTACLE'],
    baseHazards: [
      { name: 'Dark Void Meteor', subType: 'fantasy_meteor', radius: 22, weight: 20, color: '#4c1d95' },
      { name: 'Chaos Energy Orb', subType: 'fantasy_chaos', radius: 24, weight: 20, color: '#be185d' },
      { name: 'Cursed Spire', subType: 'fantasy_spike', radius: 20, weight: 18, color: '#7e22ce' },
      { name: 'Nightmare Shard', subType: 'fantasy_shard', radius: 18, weight: 16, color: '#1e1b4b' },
      { name: 'Shadow Eye', subType: 'fantasy_chaos', radius: 22, weight: 14, color: '#dc2626' },
      { name: 'Rift Spike', subType: 'fantasy_spike', radius: 23, weight: 12, color: '#a21caf' },
      { name: 'Void Tendril', subType: 'fantasy_shard', radius: 21, weight: 10, color: '#581c87' },
    ],
    cycleVariations: [
      { name: 'Arcane Void Maw', subType: 'fantasy_chaos', radius: 25, weight: 25, color: '#db2777' },
      { name: 'Cosmic Singularity', subType: 'fantasy_meteor', radius: 24, weight: 20, color: '#701a75' },
    ],
    collectibles: [
      { name: 'Mana Shard', subType: 'fantasy_mana', points: 10, radius: 16, weight: 45, color: '#38bdf8' },
      { name: 'Arcane Starfruit', subType: 'fantasy_starfruit', points: 15, radius: 16, weight: 25, color: '#f43f5e' },
      { name: 'Celestial Rune', subType: 'fantasy_rune', points: 25, radius: 18, weight: 20, color: '#a855f7' },
      { name: 'Cosmic Prism', subType: 'fantasy_prism', points: 50, radius: 22, weight: 10, color: '#ec4899' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 20 },
      { abilityType: 'MAGNET', weight: 20 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 20 },
      { abilityType: 'DOUBLE_SCORE', weight: 15 },
    ],
  },

  // 6. VOLCANO (Magma Caldera)
  {
    worldIndex: 5,
    name: 'MAGMA CALDERA',
    themeColor: '#ef4444',
    accentColor: '#f97316',
    groundColor: '#1c1917',
    groundDetailColor: '#ea580c',
    skyGradient: ['#450a0a', '#7f1d1d'],
    bgImage: bgVolcano,
    ambientType: 'MAGMA_EMBERS',
    availableMechanics: ['MAGMA_BOULDER_SPLIT', 'LAVA_GEYSER', 'VOLCANIC_ASH'],
    baseHazards: [
      { name: 'Volcanic Pumice', subType: 'desert_boulder', radius: 22, weight: 22, color: '#7f1d1d' },
      { name: 'Molten Fireball', subType: 'fantasy_chaos', radius: 24, weight: 20, color: '#ea580c' },
      { name: 'Obsidian Spike', subType: 'fantasy_spike', radius: 20, weight: 18, color: '#0c0a09' },
      { name: 'Smoldering Cinder', subType: 'city_brick', radius: 18, weight: 16, color: '#f97316' },
      { name: 'Magma Slag', subType: 'forest_stone', radius: 23, weight: 14, color: '#dc2626' },
      { name: 'Ember Shard', subType: 'fantasy_shard', radius: 19, weight: 12, color: '#b91c1c' },
    ],
    cycleVariations: [
      { name: 'Core Flare', subType: 'fantasy_chaos', radius: 25, weight: 25, color: '#f97316' },
    ],
    collectibles: [
      { name: 'Fire Ruby', subType: 'desert_amulet', points: 10, radius: 16, weight: 45, color: '#ef4444' },
      { name: 'Magma Core', subType: 'forest_orb', points: 15, radius: 16, weight: 25, color: '#f97316' },
      { name: 'Phoenix Feather', subType: 'city_can', points: 25, radius: 18, weight: 20, color: '#fbbf24' },
      { name: 'Obsidian Relic', subType: 'city_briefcase', points: 50, radius: 22, weight: 10, color: '#f43f5e' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 25 },
      { abilityType: 'MAGNET', weight: 20 },
      { abilityType: 'SHIELD', weight: 30 },
      { abilityType: 'TIME_FREEZE', weight: 15 },
      { abilityType: 'DOUBLE_SCORE', weight: 10 },
    ],
  },

  // 7. OCEAN (Abyssal Depths)
  {
    worldIndex: 6,
    name: 'ABYSSAL DEPTHS',
    themeColor: '#06b6d4',
    accentColor: '#0284c7',
    groundColor: '#082f49',
    groundDetailColor: '#38bdf8',
    skyGradient: ['#021b2b', '#034568'],
    bgImage: bgOcean,
    ambientType: 'BUBBLES',
    availableMechanics: ['TORPEDO_SHARK', 'SINKING_ANCHOR', 'WHIRLPOOL'],
    baseHazards: [
      { name: 'Spiky Sea Urchin', subType: 'forest_pinecone', radius: 20, weight: 22, color: '#1e1b4b' },
      { name: 'Heavy Coral Boulder', subType: 'forest_stone', radius: 24, weight: 20, color: '#0e7490' },
      { name: 'Electric Ray', subType: 'snow_icechunk', radius: 22, weight: 18, color: '#38bdf8' },
      { name: 'Toxic Jellyfish', subType: 'fantasy_chaos', radius: 21, weight: 16, color: '#a855f7' },
      { name: 'Sunken Cannonball', subType: 'snow_rock', radius: 23, weight: 14, color: '#334155' },
      { name: 'Rusty Depth Mine', subType: 'fantasy_meteor', radius: 25, weight: 12, color: '#991b1b' },
    ],
    cycleVariations: [
      { name: 'Abyssal Maw', subType: 'fantasy_chaos', radius: 26, weight: 25, color: '#0891b2' },
    ],
    collectibles: [
      { name: 'Golden Pearl', subType: 'city_coin', points: 10, radius: 16, weight: 45, color: '#fef08a' },
      { name: 'Sea Conch', subType: 'snow_berry', points: 15, radius: 16, weight: 25, color: '#f472b6' },
      { name: 'Sunken Dubloon', subType: 'desert_coin', points: 25, radius: 18, weight: 20, color: '#f59e0b' },
      { name: 'Trident Crystal', subType: 'snow_gem', points: 50, radius: 22, weight: 10, color: '#22d3ee' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 20 },
      { abilityType: 'MAGNET', weight: 25 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 20 },
      { abilityType: 'DOUBLE_SCORE', weight: 10 },
    ],
  },

  // 8. SPACE (Cosmic Station)
  {
    worldIndex: 7,
    name: 'COSMIC STATION',
    themeColor: '#a855f7',
    accentColor: '#38bdf8',
    groundColor: '#090d16',
    groundDetailColor: '#6366f1',
    skyGradient: ['#02040a', '#111827'],
    bgImage: bgSpace,
    ambientType: 'STAR_DUST',
    availableMechanics: ['LASER_DRONE', 'GRAVITY_PULSE', 'SPLITTING_COMET'],
    baseHazards: [
      { name: 'Space Debris', subType: 'city_crate', radius: 22, weight: 22, color: '#475569' },
      { name: 'Plasma Bomb', subType: 'fantasy_chaos', radius: 23, weight: 20, color: '#a855f7' },
      { name: 'Ion Shard', subType: 'fantasy_shard', radius: 19, weight: 18, color: '#06b6d4' },
      { name: 'Dead Satellite', subType: 'city_brick', radius: 25, weight: 16, color: '#94a3b8' },
      { name: 'Solar Flare', subType: 'desert_boulder', radius: 24, weight: 14, color: '#fbbf24' },
      { name: 'Dark Matter Lump', subType: 'fantasy_meteor', radius: 22, weight: 12, color: '#1e1b4b' },
    ],
    cycleVariations: [
      { name: 'Supernova Fragment', subType: 'fantasy_chaos', radius: 26, weight: 25, color: '#ec4899' },
    ],
    collectibles: [
      { name: 'Star Fragment', subType: 'snow_star', points: 10, radius: 16, weight: 45, color: '#facc15' },
      { name: 'Solar Cell', subType: 'city_can', points: 15, radius: 16, weight: 25, color: '#38bdf8' },
      { name: 'Alien Relic', subType: 'fantasy_rune', points: 25, radius: 18, weight: 20, color: '#c084fc' },
      { name: 'Galactic Core', subType: 'fantasy_prism', points: 50, radius: 22, weight: 10, color: '#a855f7' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 20 },
      { abilityType: 'MAGNET', weight: 25 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 15 },
      { abilityType: 'DOUBLE_SCORE', weight: 15 },
    ],
  },

  // 9. ANCIENT RUINS (Temple of Sol)
  {
    worldIndex: 8,
    name: 'TEMPLE OF SOL',
    themeColor: '#eab308',
    accentColor: '#10b981',
    groundColor: '#422006',
    groundDetailColor: '#ca8a04',
    skyGradient: ['#2e1065', '#581c87'],
    bgImage: bgDesert,
    ambientType: 'SPORES',
    availableMechanics: ['ROLLING_GIANT_STONE', 'DART_TRAP', 'THORN_ZONE'],
    baseHazards: [
      { name: 'Temple Stone Slab', subType: 'desert_boulder', radius: 23, weight: 22, color: '#78350f' },
      { name: 'Cursed Idol', subType: 'desert_pot', radius: 20, weight: 20, color: '#b45309' },
      { name: 'Sacrificial Spear', subType: 'desert_spike', radius: 18, weight: 18, color: '#991b1b' },
      { name: 'Poison Dart Spire', subType: 'fantasy_spike', radius: 19, weight: 16, color: '#15803d' },
      { name: 'Ancient Clay Bomb', subType: 'city_brick', radius: 21, weight: 14, color: '#ea580c' },
      { name: 'Mossy Pillar Chunk', subType: 'forest_stone', radius: 25, weight: 12, color: '#451a03' },
    ],
    cycleVariations: [
      { name: 'Guardian Rune Stone', subType: 'fantasy_rune', radius: 24, weight: 25, color: '#d97706' },
    ],
    collectibles: [
      { name: 'Golden Ankh', subType: 'desert_coin', points: 10, radius: 16, weight: 45, color: '#fbbf24' },
      { name: 'Jade Scarab', subType: 'forest_apple', points: 15, radius: 16, weight: 25, color: '#34d399' },
      { name: 'Sun Medallion', subType: 'desert_amulet', points: 25, radius: 18, weight: 20, color: '#f59e0b' },
      { name: 'Pharaoh Scepter', subType: 'desert_relic', points: 50, radius: 22, weight: 10, color: '#fde047' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 25 },
      { abilityType: 'MAGNET', weight: 20 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 15 },
      { abilityType: 'DOUBLE_SCORE', weight: 15 },
    ],
  },

  // 10. CYBERPUNK (Neo Grid)
  {
    worldIndex: 9,
    name: 'NEO GRID',
    themeColor: '#ec4899',
    accentColor: '#06b6d4',
    groundColor: '#0f172a',
    groundDetailColor: '#06b6d4',
    skyGradient: ['#180b2a', '#2e1065'],
    bgImage: bgCyber,
    ambientType: 'CYBER_GRID',
    availableMechanics: ['HOVER_CAR', 'EMP_SHOCKWAVE', 'CONSTRUCTION_OBJECT'],
    baseHazards: [
      { name: 'Glitch Node', subType: 'fantasy_chaos', radius: 22, weight: 22, color: '#ec4899' },
      { name: 'Malfunctioning Drone', subType: 'city_can', radius: 20, weight: 20, color: '#06b6d4' },
      { name: 'Holo-Ad Debris', subType: 'city_brick', radius: 21, weight: 18, color: '#a855f7' },
      { name: 'Overcharged Capacitor', subType: 'city_crate', radius: 23, weight: 16, color: '#f43f5e' },
      { name: 'Fiber Spike', subType: 'snow_icicle', radius: 19, weight: 14, color: '#38bdf8' },
      { name: 'Corrupted Byte Block', subType: 'city_crate', radius: 24, weight: 12, color: '#1e1b4b' },
    ],
    cycleVariations: [
      { name: 'Quantum Overload', subType: 'fantasy_chaos', radius: 25, weight: 25, color: '#f43f5e' },
    ],
    collectibles: [
      { name: 'Crypto Coin', subType: 'city_coin', points: 10, radius: 16, weight: 45, color: '#22d3ee' },
      { name: 'Cyber Chip', subType: 'snow_gem', points: 15, radius: 16, weight: 25, color: '#e879f9' },
      { name: 'Holo Drive', subType: 'city_pizza', points: 25, radius: 18, weight: 20, color: '#38bdf8' },
      { name: 'Master AI Key', subType: 'city_briefcase', points: 50, radius: 22, weight: 10, color: '#f43f5e' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 25 },
      { abilityType: 'MAGNET', weight: 25 },
      { abilityType: 'SHIELD', weight: 20 },
      { abilityType: 'TIME_FREEZE', weight: 15 },
      { abilityType: 'DOUBLE_SCORE', weight: 15 },
    ],
  },

  // 11. HAUNTED CITY (Spectral Spire)
  {
    worldIndex: 10,
    name: 'SPECTRAL SPIRE',
    themeColor: '#a7f3d0',
    accentColor: '#10b981',
    groundColor: '#111827',
    groundDetailColor: '#34d399',
    skyGradient: ['#022c22', '#064e3b'],
    bgImage: bgFantasy,
    ambientType: 'ECTOPLASM',
    availableMechanics: ['BANSHEE_WISP', 'GHOST_MIRROR', 'DARK_CREATURES'],
    baseHazards: [
      { name: 'Gargoyle Chunk', subType: 'forest_stone', radius: 23, weight: 22, color: '#475569' },
      { name: 'Ghostly Skull', subType: 'fantasy_chaos', radius: 20, weight: 20, color: '#6ee7b7' },
      { name: 'Eerie Tombstone', subType: 'city_brick', radius: 24, weight: 18, color: '#334155' },
      { name: 'Cursed Iron Lantern', subType: 'desert_pot', radius: 21, weight: 16, color: '#047857' },
      { name: 'Spectral Bone', subType: 'forest_branch', radius: 19, weight: 14, color: '#cbd5e1' },
      { name: 'Witchfire Orb', subType: 'fantasy_meteor', radius: 22, weight: 12, color: '#10b981' },
    ],
    cycleVariations: [
      { name: 'Grim Reaper Scythe', subType: 'forest_branch', radius: 25, weight: 25, color: '#064e3b' },
    ],
    collectibles: [
      { name: 'Soul Wisp', subType: 'forest_orb', points: 10, radius: 16, weight: 45, color: '#6ee7b7' },
      { name: 'Phantom Coin', subType: 'city_coin', points: 15, radius: 16, weight: 25, color: '#a7f3d0' },
      { name: 'Cursed Candle', subType: 'city_can', points: 25, radius: 18, weight: 20, color: '#34d399' },
      { name: 'Necromancer Tome', subType: 'city_briefcase', points: 50, radius: 22, weight: 10, color: '#059669' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 20 },
      { abilityType: 'MAGNET', weight: 25 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 20 },
      { abilityType: 'DOUBLE_SCORE', weight: 10 },
    ],
  },

  // 12. SKY / CLOUD WORLD (Aether Citadel)
  {
    worldIndex: 11,
    name: 'AETHER CITADEL',
    themeColor: '#fde047',
    accentColor: '#38bdf8',
    groundColor: '#f8fafc',
    groundDetailColor: '#38bdf8',
    skyGradient: ['#38bdf8', '#bae6fd'],
    bgImage: bgSnow,
    ambientType: 'FEATHERS',
    availableMechanics: ['LIGHTNING_STRIKE', 'GUST_OF_WIND', 'FALLING_BRANCH'],
    baseHazards: [
      { name: 'Thunder Nimbus', subType: 'fantasy_chaos', radius: 24, weight: 22, color: '#475569' },
      { name: 'Marble Spire Shard', subType: 'snow_icechunk', radius: 22, weight: 20, color: '#e2e8f0' },
      { name: 'Golden Chandelier', subType: 'city_briefcase', radius: 25, weight: 18, color: '#ca8a04' },
      { name: 'Hail Cannon', subType: 'snow_ball', radius: 20, weight: 16, color: '#93c5fd' },
      { name: 'Sky Anchor', subType: 'city_crate', radius: 23, weight: 14, color: '#64748b' },
      { name: 'Vortex Feather', subType: 'desert_spike', radius: 19, weight: 12, color: '#eab308' },
    ],
    cycleVariations: [
      { name: 'Zeus Lightning Bolt', subType: 'snow_icicle', radius: 24, weight: 25, color: '#facc15' },
    ],
    collectibles: [
      { name: 'Sky Feather', subType: 'snow_berry', points: 10, radius: 16, weight: 45, color: '#fef08a' },
      { name: 'Cloud Dew', subType: 'forest_apple', points: 15, radius: 16, weight: 25, color: '#7dd3fc' },
      { name: 'Sun Prism', subType: 'snow_star', points: 25, radius: 18, weight: 20, color: '#f59e0b' },
      { name: 'Cherub Crown', subType: 'desert_amulet', points: 50, radius: 22, weight: 10, color: '#fbbf24' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 25 },
      { abilityType: 'MAGNET', weight: 20 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 15 },
      { abilityType: 'DOUBLE_SCORE', weight: 15 },
    ],
  },

  // 13. UNDERGROUND / CAVE (Crystal Caverns)
  {
    worldIndex: 12,
    name: 'CRYSTAL CAVERNS',
    themeColor: '#d946ef',
    accentColor: '#8b5cf6',
    groundColor: '#171717',
    groundDetailColor: '#c026d3',
    skyGradient: ['#1e102d', '#2e1065'],
    bgImage: bgFantasy,
    ambientType: 'CAVE_CRYSTALS',
    availableMechanics: ['FALLING_STALACTITE', 'MINECART_RUSH', 'QUICKSAND'],
    baseHazards: [
      { name: 'Sharp Stalactite', subType: 'snow_icicle', radius: 21, weight: 22, color: '#d946ef' },
      { name: 'Heavy Cave Rock', subType: 'desert_boulder', radius: 24, weight: 20, color: '#525252' },
      { name: 'Toxic Geode Spore', subType: 'fantasy_chaos', radius: 20, weight: 18, color: '#a21caf' },
      { name: 'Subterranean Bat', subType: 'fantasy_shard', radius: 19, weight: 16, color: '#262626' },
      { name: 'Spiked Amethyst', subType: 'forest_stone', radius: 22, weight: 14, color: '#9333ea' },
      { name: 'Loose Shale Shards', subType: 'snow_icechunk', radius: 20, weight: 12, color: '#c084fc' },
    ],
    cycleVariations: [
      { name: 'Ancient Crystal Core', subType: 'fantasy_meteor', radius: 25, weight: 25, color: '#ec4899' },
    ],
    collectibles: [
      { name: 'Amethyst Shard', subType: 'fantasy_mana', points: 10, radius: 16, weight: 45, color: '#e879f9' },
      { name: 'Gold Nugget', subType: 'city_coin', points: 15, radius: 16, weight: 25, color: '#facc15' },
      { name: 'Cave Mushroom', subType: 'forest_mushroom', points: 25, radius: 18, weight: 20, color: '#c084fc' },
      { name: 'Diamond Geode', subType: 'fantasy_prism', points: 50, radius: 22, weight: 10, color: '#f0abfc' },
    ],
    powerUps: [
      { abilityType: 'SPEED_BOOST', weight: 20 },
      { abilityType: 'MAGNET', weight: 25 },
      { abilityType: 'SHIELD', weight: 25 },
      { abilityType: 'TIME_FREEZE', weight: 15 },
      { abilityType: 'DOUBLE_SCORE', weight: 15 },
    ],
  },
];

export function getDifficultyTier(cycle: number): DifficultyTier {
  if (cycle <= 1) return 'Easy';
  if (cycle === 2) return 'Medium';
  if (cycle === 3) return 'Hard';
  if (cycle === 4) return 'Very Hard';
  return 'Extreme';
}

/**
 * Calculates stage parameters dynamically for ANY stage number (1, 2, 3... infinite).
 * Cycles through 13 base worlds every 60 seconds with progressive difficulty.
 */
export function getStageConfig(stageNumber: number): StageDefinition {
  const worldIndex = (stageNumber - 1) % BASE_WORLDS.length;
  const cycle = Math.floor((stageNumber - 1) / BASE_WORLDS.length) + 1;
  const base = BASE_WORLDS[worldIndex];
  const difficultyTier = getDifficultyTier(cycle);

  const cycleBonus = (cycle - 1) * 0.2;
  const stageBonus = (worldIndex % 5) * 0.04;

  const fallSpeedMultiplier = 1.0 + cycleBonus + stageBonus;
  const spawnRateMultiplier = 1.0 + (cycle - 1) * 0.16 + (worldIndex % 5) * 0.03;

  let stageName = base.name;
  if (cycle > 1) {
    const prefixes = ['NEO', 'ANCIENT', 'SUPER', 'HYPER', 'ETERNAL', 'CHRONO', 'INFINITE'];
    const p = prefixes[(cycle - 2) % prefixes.length];
    stageName = `${p} ${base.name}`;
  }

  const hazards = [...base.baseHazards];
  if (cycle > 1) {
    hazards.push(...base.cycleVariations);
  }

  return {
    id: stageNumber,
    worldIndex,
    cycle,
    difficultyTier,
    name: stageName,
    subtitle: `Stage ${stageNumber} · ${stageName} · ${difficultyTier}`,
    themeColor: base.themeColor,
    accentColor: base.accentColor,
    groundColor: base.groundColor,
    groundDetailColor: base.groundDetailColor,
    skyGradient: base.skyGradient,
    bgImage: base.bgImage,
    ambientType: base.ambientType,
    fallSpeedMultiplier,
    spawnRateMultiplier,
    availableMechanics: base.availableMechanics,
    hazards,
    collectibles: base.collectibles,
    powerUps: base.powerUps,
  };
}
