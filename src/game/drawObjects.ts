import { FallingItem } from './types';

/**
 * Renders unique falling objects (collectibles, obstacles, powerups) for each world.
 */
export function drawFallingItem(
  ctx: CanvasRenderingContext2D,
  item: FallingItem,
  globalTime: number
) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);
  ctx.scale(item.scale, item.scale);

  // If frozen, draw frost effect and icy rim
  if (item.isFrozen) {
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = 10;
  }

  // Draw based on category and subType
  if (item.category === 'POWERUP') {
    drawPowerUpItem(ctx, item, globalTime);
  } else {
    drawStageItem(ctx, item, globalTime);
  }

  // If frozen, overlay frost crystals
  if (item.isFrozen) {
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-item.radius, 0);
    ctx.lineTo(item.radius, 0);
    ctx.moveTo(0, -item.radius);
    ctx.lineTo(0, item.radius);
    ctx.stroke();
  }

  ctx.restore();
}

function drawStageItem(ctx: CanvasRenderingContext2D, item: FallingItem, time: number) {
  const r = item.radius;
  const sub = item.subType;

  switch (sub) {
    // ---- CITY ITEMS ----
    case 'city_coin': {
      // Golden Coin with inner star
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
      ctx.fill();

      // Dollar / Star symbol
      ctx.fillStyle = '#b45309';
      ctx.font = `bold ${Math.floor(r * 1.1)}px "Rubik", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 1);
      break;
    }
    case 'city_can': {
      // Soda Can
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(-r * 0.7, -r, r * 1.4, r * 2, 4);
      ctx.fill();
      // Can lid & bottom rim
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-r * 0.7, -r, r * 1.4, 3);
      ctx.fillRect(-r * 0.7, r - 3, r * 1.4, 3);
      // Can logo stripe
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-r * 0.7, -r * 0.2, r * 1.4, r * 0.6);
      break;
    }
    case 'city_pizza': {
      // Pizza slice
      ctx.fillStyle = '#f59e0b'; // crust
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, r);
      ctx.lineTo(-r, r);
      ctx.closePath();
      ctx.fill();
      // Cheese
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(0, -r + 4);
      ctx.lineTo(r - 3, r - 3);
      ctx.lineTo(-r + 3, r - 3);
      ctx.closePath();
      ctx.fill();
      // Pepperoni
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(-2, 0, 3, 0, Math.PI * 2);
      ctx.arc(3, 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'city_briefcase': {
      // Golden briefcase
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.roundRect(-r, -r * 0.7, r * 2, r * 1.4, 4);
      ctx.fill();
      // Handle
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -r * 0.7, 5, Math.PI, 0);
      ctx.stroke();
      // Clasp
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, -2, 6, 4);
      break;
    }
    case 'city_brick': {
      // Red Brick Hazard
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.roundRect(-r * 1.1, -r * 0.6, r * 2.2, r * 1.2, 2);
      ctx.fill();
      // Brick holes
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.arc(-r * 0.5, 0, 3, 0, Math.PI * 2);
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.arc(r * 0.5, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'city_crate': {
      // Wooden Crate
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(-r, -r, r * 2, r * 2, 3);
      ctx.fill();
      // Criss-cross wood plank
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-r, -r, r * 2, r * 2);
      ctx.beginPath();
      ctx.moveTo(-r, -r);
      ctx.lineTo(r, r);
      ctx.moveTo(r, -r);
      ctx.lineTo(-r, r);
      ctx.stroke();
      break;
    }
    case 'city_bottle': {
      // Broken glass bottle
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, r);
      ctx.lineTo(r * 0.5, r);
      ctx.lineTo(r * 0.4, 0);
      ctx.lineTo(r * 0.2, -r);
      ctx.lineTo(-r * 0.2, -r);
      ctx.lineTo(-r * 0.4, 0);
      ctx.closePath();
      ctx.fill();
      // Jagged sharp bottom
      ctx.fillStyle = '#047857';
      ctx.fillRect(-r * 0.3, r - 3, r * 0.6, 3);
      break;
    }
    case 'city_cone': {
      // Traffic Cone
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.8, r * 0.8);
      ctx.lineTo(-r * 0.8, r * 0.8);
      ctx.closePath();
      ctx.fill();
      // Base
      ctx.fillRect(-r, r * 0.8, r * 2, 4);
      // Reflective white band
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-r * 0.3, -r * 0.1);
      ctx.lineTo(r * 0.3, -r * 0.1);
      ctx.lineTo(r * 0.5, r * 0.3);
      ctx.lineTo(-r * 0.5, r * 0.3);
      ctx.closePath();
      ctx.fill();
      break;
    }

    // ---- FOREST ITEMS ----
    case 'forest_apple': {
      // Red Apple
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, 2, r - 2, 0, Math.PI * 2);
      ctx.fill();
      // Stem & Green Leaf
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -r + 4);
      ctx.quadraticCurveTo(2, -r - 2, 4, -r - 4);
      ctx.stroke();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(3, -r + 2, 4, 2, 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'forest_acorn': {
      // Acorn
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(0, 3, r * 0.7, r * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
      // Textured Cap
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(0, -r * 0.3, r * 0.8, Math.PI, 0);
      ctx.fill();
      break;
    }
    case 'forest_mushroom': {
      // Magic Mushroom
      ctx.fillStyle = '#f8fafc'; // stem
      ctx.fillRect(-r * 0.3, 0, r * 0.6, r);
      // Cap
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI, 0);
      ctx.fill();
      // Spots
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-r * 0.4, -r * 0.4, 2.5, 0, Math.PI * 2);
      ctx.arc(0, -r * 0.7, 3, 0, Math.PI * 2);
      ctx.arc(r * 0.4, -r * 0.3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'forest_orb': {
      // Glowing Nature Orb
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#4ade80');
      grad.addColorStop(1, '#059669');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'forest_stone': {
      // Spiked Mossy Stone
      ctx.fillStyle = '#71717a';
      ctx.beginPath();
      ctx.moveTo(-r, 0);
      ctx.lineTo(-r * 0.6, -r);
      ctx.lineTo(r * 0.4, -r * 0.9);
      ctx.lineTo(r, -r * 0.2);
      ctx.lineTo(r * 0.8, r * 0.8);
      ctx.lineTo(-r * 0.4, r);
      ctx.closePath();
      ctx.fill();
      // Sharp spike edge
      ctx.fillStyle = '#52525b';
      ctx.beginPath();
      ctx.moveTo(r * 0.4, -r * 0.9);
      ctx.lineTo(r * 0.7, -r * 1.3);
      ctx.lineTo(r, -r * 0.2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'forest_branch': {
      // Heavy Spiky Branch
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-r, r * 0.5);
      ctx.quadraticCurveTo(0, -r * 0.5, r, -r * 0.8);
      ctx.stroke();
      // Little sub branch
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-2, -2);
      ctx.lineTo(r * 0.4, 4);
      ctx.stroke();
      break;
    }
    case 'forest_pinecone': {
      // Thorny pinecone
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.7, r, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'forest_log': {
      // Rotten Log
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(-r * 1.2, -r * 0.5, r * 2.4, r, 3);
      ctx.fill();
      // Ring
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(r * 1.1, 0, 3, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // ---- SNOW ITEMS ----
    case 'snow_berry': {
      // Pink Frost Berry
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-r * 0.3, -r * 0.3, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'snow_gem': {
      // Ice Gem
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r, 0);
      ctx.closePath();
      ctx.fill();
      // Inner facet
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.6);
      ctx.lineTo(r * 0.6, 0);
      ctx.lineTo(0, r * 0.6);
      ctx.lineTo(-r * 0.6, 0);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'snow_flake_gem': {
      // Silver Snowflake
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        ctx.stroke();
      }
      break;
    }
    case 'snow_star': {
      // Diamond Star
      ctx.fillStyle = '#67e8f9';
      drawStar(ctx, 0, 0, 5, r, r * 0.45);
      break;
    }
    case 'snow_icicle': {
      // Sharp Falling Icicle
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r);
      ctx.lineTo(r * 0.5, -r);
      ctx.lineTo(0, r * 1.2);
      ctx.closePath();
      ctx.fill();
      // Shiny reflection
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, -r + 2, 2, r * 1.5);
      break;
    }
    case 'snow_ball': {
      // Giant Snowball
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(-2, 3, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'snow_icechunk': {
      // Jagged Ice Chunk
      ctx.fillStyle = '#7dd3fc';
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.6);
      ctx.lineTo(r * 0.6, -r * 0.9);
      ctx.lineTo(r * 0.9, r * 0.4);
      ctx.lineTo(0, r * 0.9);
      ctx.lineTo(-r, r * 0.2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'snow_rock': {
      // Frozen Boulder
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-r * 0.6, -r * 0.8, r * 1.2, 4);
      break;
    }

    // ---- DESERT ITEMS ----
    case 'desert_coin': {
      // Ancient Scarab Coin
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // Scarab symbol
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.4, r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'desert_date': {
      // Sweet Date
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.6, r * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'desert_amulet': {
      // Ruby Amulet
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.8, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.8, 0);
      ctx.closePath();
      ctx.fill();
      // Gold frame
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      break;
    }
    case 'desert_relic': {
      // Pharaoh Golden Relic
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'desert_cactus': {
      // Spiky Cactus Hazard
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.roundRect(-r * 0.4, -r, r * 0.8, r * 2, 4);
      ctx.fill();
      // Left arm
      ctx.beginPath();
      ctx.roundRect(-r * 0.9, -r * 0.3, r * 0.6, r * 0.3, 2);
      ctx.roundRect(-r * 0.9, -r * 0.6, r * 0.3, r * 0.6, 2);
      ctx.fill();
      // Right arm
      ctx.beginPath();
      ctx.roundRect(r * 0.3, 0, r * 0.6, r * 0.3, 2);
      ctx.roundRect(r * 0.6, -r * 0.3, r * 0.3, r * 0.6, 2);
      ctx.fill();
      // Spikes
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, 0); ctx.lineTo(-r * 0.8, 0);
      ctx.moveTo(r * 0.5, -4); ctx.lineTo(r * 0.8, -4);
      ctx.stroke();
      break;
    }
    case 'desert_boulder': {
      // Sandstone boulder
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-r * 0.4, -2, r * 0.8, 3);
      break;
    }
    case 'desert_pot': {
      // Clay pot
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, 2, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-r * 0.4, -r, r * 0.8, 4);
      break;
    }
    case 'desert_spike': {
      // Desert Spike
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.6, r);
      ctx.lineTo(-r * 0.6, r);
      ctx.closePath();
      ctx.fill();
      break;
    }

    // ---- FANTASY NIGHT ITEMS ----
    case 'fantasy_mana': {
      // Mana Crystal
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.7, -r * 0.3);
      ctx.lineTo(r * 0.5, r);
      ctx.lineTo(-r * 0.5, r);
      ctx.lineTo(-r * 0.7, -r * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.3, 0);
      ctx.lineTo(0, r);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'fantasy_starfruit': {
      // Arcane Starfruit
      ctx.fillStyle = '#f43f5e';
      drawStar(ctx, 0, 0, 5, r, r * 0.5);
      break;
    }
    case 'fantasy_rune': {
      // Celestial Rune
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.roundRect(-r, -r, r * 2, r * 2, 6);
      ctx.fill();
      // Rune mark
      ctx.strokeStyle = '#fdf4ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.4, -r * 0.5);
      ctx.lineTo(0, r * 0.6);
      ctx.lineTo(r * 0.4, -r * 0.5);
      ctx.moveTo(-r * 0.4, 0);
      ctx.lineTo(r * 0.4, 0);
      ctx.stroke();
      break;
    }
    case 'fantasy_prism': {
      // Cosmic Prism
      const grad = ctx.createLinearGradient(-r, -r, r, r);
      grad.addColorStop(0, '#ec4899');
      grad.addColorStop(0.5, '#8b5cf6');
      grad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, r * 0.8);
      ctx.lineTo(-r, r * 0.8);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'fantasy_meteor': {
      // Dark Void Meteor
      ctx.fillStyle = '#4c1d95';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // Glowing purple cracks
      ctx.strokeStyle = '#e879f9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.3);
      ctx.lineTo(0, 0);
      ctx.lineTo(r * 0.5, r * 0.4);
      ctx.moveTo(0, 0);
      ctx.lineTo(-r * 0.3, r * 0.6);
      ctx.stroke();
      break;
    }
    case 'fantasy_chaos': {
      // Chaos Energy Orb
      ctx.fillStyle = '#be185d';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r + 2, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 'fantasy_spike': {
      // Cursed Spire
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.2);
      ctx.lineTo(r * 0.6, r);
      ctx.lineTo(-r * 0.6, r);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'fantasy_shard': {
      // Nightmare Shard
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(-r, -r * 0.5);
      ctx.lineTo(r, -r);
      ctx.lineTo(r * 0.5, r);
      ctx.lineTo(-r * 0.5, r * 0.5);
      ctx.closePath();
      ctx.fill();
      break;
    }

    // Default Fallback
    default: {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

/**
 * Draws special ability Power-Up Orbs with animated glow and distinct iconography
 */
function drawPowerUpItem(ctx: CanvasRenderingContext2D, item: FallingItem, time: number) {
  const r = item.radius;
  const pulse = Math.sin(time * 6) * 2;
  const outerR = r + pulse;

  // Outer Glowing Aura
  const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, outerR + 6);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.4, item.color);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, outerR + 6, 0, Math.PI * 2);
  ctx.fill();

  // Orb body
  ctx.fillStyle = item.color;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // White boundary
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Icon inside
  switch (item.abilityType) {
    case 'SPEED_BOOST': {
      // Lightning bolt ⚡
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(2, -r * 0.65);
      ctx.lineTo(-r * 0.45, 0);
      ctx.lineTo(1, 0);
      ctx.lineTo(-2, r * 0.65);
      ctx.lineTo(r * 0.45, 0);
      ctx.lineTo(-1, 0);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'TIME_FREEZE': {
      // Clock / Snowflake ⏱️
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -r * 0.4);
      ctx.moveTo(0, 0);
      ctx.lineTo(r * 0.35, 0);
      ctx.stroke();
      break;
    }
    case 'MAGNET': {
      // Horseshoe Magnet 🧲
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.arc(0, -1, r * 0.45, Math.PI * 0.9, Math.PI * 0.1, true);
      ctx.stroke();
      // Silver tips
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-r * 0.55, 1, 4, 4);
      ctx.fillRect(r * 0.35, 1, 4, 4);
      break;
    }
    case 'SHIELD': {
      // Shield Crest 🛡️
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.5);
      ctx.lineTo(r * 0.5, -r * 0.5);
      ctx.lineTo(r * 0.45, r * 0.1);
      ctx.lineTo(0, r * 0.6);
      ctx.lineTo(-r * 0.45, r * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'DOUBLE_SCORE': {
      // 2X text
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.floor(r * 0.85)}px "Fredoka", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('2X', 0, 1);
      break;
    }
  }
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}
