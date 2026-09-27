import { CharacterAnimState, ActiveAbility } from './types';

export interface PlayerCharacter {
  x: number;
  y: number;
  baseY: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  facing: 'left' | 'right';
  animState: CharacterAnimState;
  animTimer: number;
  isGrounded: boolean;
  jumpTimer: number;
  invulnerableTimer: number;
  collectTimer: number;
  hitTimer: number;
  abilityPulseTimer: number;
  ghostTrails: Array<{ x: number; y: number; facing: 'left' | 'right'; alpha: number }>;
}

export function createPlayer(canvasWidth: number, groundY: number): PlayerCharacter {
  const height = 74;
  const width = 46;
  return {
    x: canvasWidth / 2,
    y: groundY - height,
    baseY: groundY - height,
    width,
    height,
    vx: 0,
    vy: 0,
    facing: 'right',
    animState: 'IDLE',
    animTimer: 0,
    isGrounded: true,
    jumpTimer: 0,
    invulnerableTimer: 0,
    collectTimer: 0,
    hitTimer: 0,
    abilityPulseTimer: 0,
    ghostTrails: [],
  };
}

export function updatePlayer(
  player: PlayerCharacter,
  dt: number,
  inputLeft: boolean,
  inputRight: boolean,
  inputJump: boolean,
  canvasWidth: number,
  groundY: number,
  hasSpeedBoost: boolean,
  isFrozen: boolean = false
) {
  // If frozen, player can still move because Time Freeze affects everything EXCEPT player!
  player.animTimer += dt;
  player.abilityPulseTimer += dt;

  // Decrease timers
  if (player.invulnerableTimer > 0) player.invulnerableTimer -= dt;
  if (player.collectTimer > 0) player.collectTimer -= dt;
  if (player.hitTimer > 0) player.hitTimer -= dt;

  // Update ghost trails for speed boost
  if (hasSpeedBoost && (Math.abs(player.vx) > 50 || !player.isGrounded)) {
    if (Math.random() < 0.4) {
      player.ghostTrails.push({
        x: player.x,
        y: player.y,
        facing: player.facing,
        alpha: 0.6,
      });
    }
  }
  // Decay ghost trails
  for (let i = player.ghostTrails.length - 1; i >= 0; i--) {
    player.ghostTrails[i].alpha -= dt * 2.5;
    if (player.ghostTrails[i].alpha <= 0) {
      player.ghostTrails.splice(i, 1);
    }
  }

  // Base speed
  const baseSpeed = hasSpeedBoost ? 620 : 380;
  const accel = hasSpeedBoost ? 2400 : 1600;
  const friction = 1800;

  // Horizontal input
  if (player.animState !== 'GAME_OVER') {
    if (inputLeft && !inputRight) {
      player.vx = Math.max(player.vx - accel * dt, -baseSpeed);
      player.facing = 'left';
    } else if (inputRight && !inputLeft) {
      player.vx = Math.min(player.vx + accel * dt, baseSpeed);
      player.facing = 'right';
    } else {
      // Apply friction
      if (player.vx > 0) {
        player.vx = Math.max(0, player.vx - friction * dt);
      } else if (player.vx < 0) {
        player.vx = Math.min(0, player.vx + friction * dt);
      }
    }

    // Jump logic
    if (inputJump && player.isGrounded) {
      player.vy = -680; // strong upward jump velocity
      player.isGrounded = false;
      player.jumpTimer = 0;
    }
  } else {
    // Decelerate if game over
    player.vx *= 0.85;
  }

  // Gravity
  const gravity = 1900;
  player.vy += gravity * dt;
  player.y += player.vy * dt;

  // Ground collision
  player.baseY = groundY - player.height;
  if (player.y >= player.baseY) {
    player.y = player.baseY;
    player.vy = 0;
    player.isGrounded = true;
  } else {
    player.isGrounded = false;
  }

  // Horizontal boundaries with padding
  const pad = player.width / 2 + 10;
  player.x += player.vx * dt;
  if (player.x < pad) {
    player.x = pad;
    player.vx = 0;
  }
  if (player.x > canvasWidth - pad) {
    player.x = canvasWidth - pad;
    player.vx = 0;
  }

  // Determine current animation state
  if (player.animState === 'GAME_OVER') {
    // Stay game over
  } else if (player.hitTimer > 0) {
    player.animState = 'HIT';
  } else if (player.collectTimer > 0) {
    player.animState = 'COLLECT';
  } else if (!player.isGrounded) {
    player.animState = 'JUMP';
  } else {
    const speed = Math.abs(player.vx);
    if (speed > 280) {
      player.animState = 'RUN';
    } else if (speed > 20) {
      player.animState = 'WALK';
    } else {
      player.animState = 'IDLE';
    }
  }
}

/**
 * Draws the human character with articulated joints, expressive faces, and dynamic ability auras
 */
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: PlayerCharacter,
  activeAbilities: ActiveAbility[]
) {
  const { x, y, width, height, facing, animState, animTimer, invulnerableTimer } = player;

  // Flash when invulnerable
  if (invulnerableTimer > 0) {
    const flashFreq = Math.floor(animTimer * 20) % 2;
    if (flashFreq === 0) return; // skip frame to create flashing blink
  }

  // Ability flags
  const hasSpeed = activeAbilities.some(a => a.type === 'SPEED_BOOST');
  const hasFreeze = activeAbilities.some(a => a.type === 'TIME_FREEZE');
  const hasMagnet = activeAbilities.some(a => a.type === 'MAGNET');
  const hasShield = activeAbilities.some(a => a.type === 'SHIELD');
  const hasDouble = activeAbilities.some(a => a.type === 'DOUBLE_SCORE');

  ctx.save();

  // 1. Draw Speed Ghost Trails
  if (player.ghostTrails.length > 0) {
    for (const trail of player.ghostTrails) {
      ctx.save();
      ctx.translate(trail.x, trail.y);
      if (trail.facing === 'left') ctx.scale(-1, 1);
      ctx.globalAlpha = trail.alpha * 0.4;
      ctx.fillStyle = '#38bdf8';
      // Simplified silhouette
      ctx.beginPath();
      ctx.arc(0, 18, 14, 0, Math.PI * 2);
      ctx.rect(-12, 30, 24, 28);
      ctx.fill();
      ctx.restore();
    }
  }

  // 2. Character Shadow on Ground
  const groundOffset = (player.baseY - player.y);
  const shadowScale = Math.max(0.4, 1 - groundOffset / 200);
  ctx.save();
  ctx.translate(x, player.baseY + height + 2);
  ctx.scale(shadowScale, shadowScale * 0.4);
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fill();
  ctx.restore();

  // 3. Translate to Character Center
  ctx.translate(x, y);

  // Flip horizontally if facing left
  const flip = facing === 'left' ? -1 : 1;
  ctx.scale(flip, 1);

  // 4. Ability Aura: Speed Wind Trails around player
  if (hasSpeed) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const offset = (animTimer * 10 + i * 2) % 6;
      ctx.beginPath();
      ctx.moveTo(-20 - offset * 4, 25 + i * 15);
      ctx.lineTo(-4 - offset * 3, 25 + i * 15);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 5. Ability Aura: Magnet Flux Rings
  if (hasMagnet) {
    ctx.save();
    const pulse = Math.sin(player.abilityPulseTimer * 8) * 4;
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 36, 28 + pulse, 14 + pulse * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(236, 72, 153, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 36, 36 - pulse, 18 - pulse * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 6. Ability Aura: Time Freeze Clock Halo
  if (hasFreeze) {
    ctx.save();
    ctx.translate(0, -18);
    // Glowing clock ring
    ctx.strokeStyle = '#67e8f9';
    ctx.fillStyle = 'rgba(103, 232, 249, 0.15)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Clock hour marks
    for (let a = 0; a < 4; a++) {
      const ang = (a * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * 11, Math.sin(ang) * 11);
      ctx.lineTo(Math.cos(ang) * 15, Math.sin(ang) * 15);
      ctx.stroke();
    }

    // Rotating hand
    const handAngle = animTimer * 6;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(handAngle) * 10, Math.sin(handAngle) * 10);
    ctx.stroke();
    ctx.restore();
  }

  // 7. Ability Aura: Double Score Golden Sparkles & Halo
  if (hasDouble) {
    ctx.save();
    ctx.translate(0, -14);
    // Golden Crown/Halo
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // +2X Badge floating
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('2X', 0, -8);
    ctx.restore();
  }

  // 8. Human Character Body Parts Kinematics
  // Animation Phase calculations
  let legAngleL = 0;
  let legAngleR = 0;
  let armAngleL = 0;
  let armAngleR = 0;
  let bodyBobY = 0;
  let torsoLean = 0;
  let headTilt = 0;

  if (animState === 'IDLE') {
    // Gentle breathing
    bodyBobY = Math.sin(animTimer * 3.5) * 1.8;
    headTilt = Math.sin(animTimer * 1.8) * 0.04;
    armAngleL = Math.sin(animTimer * 3.5) * 0.08;
    armAngleR = -Math.sin(animTimer * 3.5) * 0.08;
  } else if (animState === 'WALK') {
    const cycle = animTimer * 8;
    bodyBobY = Math.abs(Math.sin(cycle)) * 3;
    legAngleL = Math.sin(cycle) * 0.45;
    legAngleR = -Math.sin(cycle) * 0.45;
    armAngleL = -Math.sin(cycle) * 0.45;
    armAngleR = Math.sin(cycle) * 0.45;
    torsoLean = 0.06;
  } else if (animState === 'RUN') {
    const cycle = animTimer * 14;
    bodyBobY = Math.abs(Math.sin(cycle)) * 5;
    legAngleL = Math.sin(cycle) * 0.85;
    legAngleR = -Math.sin(cycle) * 0.85;
    armAngleL = -Math.sin(cycle) * 0.85;
    armAngleR = Math.sin(cycle) * 0.85;
    torsoLean = 0.22; // leaning forward
    headTilt = 0.12;
  } else if (animState === 'JUMP') {
    // Airborne pose: legs tucked slightly, arms raised up
    bodyBobY = -2;
    legAngleL = 0.35;
    legAngleR = -0.3;
    armAngleL = -1.2; // arms up!
    armAngleR = -1.1;
    headTilt = -0.15; // looking up
  } else if (animState === 'HIT') {
    // Hit reaction: knocked back, head snapped back
    bodyBobY = 2;
    torsoLean = -0.35;
    headTilt = -0.4;
    armAngleL = 0.8;
    armAngleR = 0.9;
    legAngleL = -0.3;
    legAngleR = 0.4;
  } else if (animState === 'COLLECT') {
    // Joyful bounce & catch pose
    bodyBobY = -4;
    headTilt = -0.1;
    armAngleR = -1.6; // right arm reaching high to grab!
    armAngleL = 0.3;
    legAngleL = 0.1;
    legAngleR = -0.1;
  } else if (animState === 'GAME_OVER') {
    // Slumped / knocked out on the floor
    torsoLean = 0.8;
    headTilt = 0.7;
    bodyBobY = 18;
    armAngleL = 0.6;
    armAngleR = 0.8;
    legAngleL = 0.5;
    legAngleR = 0.7;
  }

  // --- DRAW LEGS (Back & Front) ---
  // Pelvis at Y ~ 46
  const hipY = 46 + bodyBobY;
  
  // Left leg (back)
  ctx.save();
  ctx.translate(-5, hipY);
  ctx.rotate(legAngleL);
  ctx.fillStyle = '#1e293b'; // dark denim pants
  ctx.beginPath();
  ctx.roundRect(-4, 0, 8, 24, 3);
  ctx.fill();
  // Shoe
  ctx.fillStyle = '#f8fafc'; // white sneaker with red stripe
  ctx.beginPath();
  ctx.roundRect(-4, 20, 11, 7, 3);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-2, 22, 6, 2);
  ctx.restore();

  // Right leg (front)
  ctx.save();
  ctx.translate(5, hipY);
  ctx.rotate(legAngleR);
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(-4, 0, 8, 24, 3);
  ctx.fill();
  // Shoe
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(-4, 20, 12, 7, 3);
  ctx.fill();
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(-2, 22, 6, 2);
  ctx.restore();

  // --- DRAW TORSO & JACKET ---
  ctx.save();
  ctx.translate(0, 30 + bodyBobY);
  ctx.rotate(torsoLean);

  // Left Arm (back)
  ctx.save();
  ctx.translate(-10, -8);
  ctx.rotate(armAngleL);
  ctx.fillStyle = '#0284c7'; // sporty blue jacket
  ctx.beginPath();
  ctx.roundRect(-3.5, 0, 7, 18, 3);
  ctx.fill();
  // Hand
  ctx.fillStyle = '#fbcfe8'; // skin tone
  ctx.beginPath();
  ctx.arc(0, 18, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Torso / Jacket
  ctx.fillStyle = '#0284c7'; // jacket primary
  ctx.beginPath();
  ctx.roundRect(-11, -10, 22, 26, 6);
  ctx.fill();

  // Jacket zipper / inner shirt
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-2.5, -8, 5, 22);

  // Dynamic collar / neck
  ctx.fillStyle = '#fbcfe8';
  ctx.fillRect(-4, -13, 8, 5);

  // Right Arm (front)
  ctx.save();
  ctx.translate(10, -8);
  ctx.rotate(armAngleR);
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.roundRect(-3.5, 0, 7, 18, 3);
  ctx.fill();
  // Hand
  ctx.fillStyle = '#fbcfe8';
  ctx.beginPath();
  ctx.arc(0, 18, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- DRAW HEAD ---
  ctx.save();
  ctx.translate(0, -18);
  ctx.rotate(headTilt);

  // Face
  ctx.fillStyle = '#fed7aa'; // warm skin tone
  ctx.beginPath();
  ctx.roundRect(-10, -10, 20, 18, 6);
  ctx.fill();

  // Hair / Stylized Arcade Cap
  ctx.fillStyle = '#f59e0b'; // energetic golden-amber cap
  ctx.beginPath();
  ctx.roundRect(-11, -14, 22, 10, [6, 6, 2, 2]);
  ctx.fill();
  // Cap Visor
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.roundRect(1, -7, 12, 4, 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(-10, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Expressions
  ctx.fillStyle = '#0f172a';
  if (animState === 'GAME_OVER') {
    // Dizzy X eyes
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    // Eye 1
    ctx.beginPath();
    ctx.moveTo(1, -4);
    ctx.lineTo(5, 0);
    ctx.moveTo(5, -4);
    ctx.lineTo(1, 0);
    ctx.stroke();
  } else if (animState === 'HIT') {
    // Closed pained eyes > <
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(2, -3);
    ctx.lineTo(5, -1);
    ctx.lineTo(2, 1);
    ctx.stroke();
  } else if (animState === 'COLLECT') {
    // Happy arch eyes ^_^
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(4, -1, 3, Math.PI, 0);
    ctx.stroke();
    // Big smile
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(3, 4, 3, 0, Math.PI);
    ctx.fill();
  } else {
    // Natural blinking
    const isBlinking = Math.floor(animTimer * 100) % 250 < 10;
    if (isBlinking) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(2, -2);
      ctx.lineTo(6, -2);
      ctx.stroke();
    } else {
      // Determined sparkling eye
      ctx.beginPath();
      ctx.ellipse(4, -2, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eye highlight spark
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(5, -3, 1, 0, Math.PI * 2);
      ctx.fill();

      // Cheerful subtle smile
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(3, 3, 2.5, 0.1, Math.PI * 0.85);
      ctx.stroke();
    }
  }

  ctx.restore(); // end head
  ctx.restore(); // end torso

  // 9. Ability Aura: SHIELD DOME (Drawn over character)
  if (hasShield) {
    ctx.save();
    const shieldPulse = Math.sin(player.abilityPulseTimer * 6) * 3;
    const shieldRadius = 42 + shieldPulse;

    // Translucent dome gradient
    const grad = ctx.createRadialGradient(0, 36, 10, 0, 36, shieldRadius);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
    grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0.85)');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.arc(0, 36, shieldRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hexagonal / Runes Pattern around edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;
    for (let h = 0; h < 6; h++) {
      const ang = (h * Math.PI) / 3 + animTimer;
      const px = Math.cos(ang) * (shieldRadius - 3);
      const py = 36 + Math.sin(ang) * (shieldRadius - 3);
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}
