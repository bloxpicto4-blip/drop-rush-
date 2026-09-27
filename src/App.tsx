import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/engine';
import { ActiveAbility, GameModeState, GameStats, StageDefinition, GameSettings } from './game/types';
import { getStageConfig } from './game/stages';
import { settingsManager } from './game/settings';
import { GameHUD } from './components/GameHUD';
import { MobileControls } from './components/MobileControls';
import { TitleMenu } from './components/TitleMenu';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { StageGuideModal } from './components/StageGuideModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Settings
  const [settings, setSettings] = useState<GameSettings>(() => settingsManager.load());

  // UI Reactive States
  const [gameState, setGameState] = useState<GameModeState>('MENU');
  const [hearts, setHearts] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<StageDefinition>(getStageConfig(1));
  const [nextStage, setNextStage] = useState<StageDefinition | null>(getStageConfig(2));
  const [stageNumber, setStageNumber] = useState<number>(1);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [transitionProgress, setTransitionProgress] = useState<number>(0);
  const [activeAbilities, setActiveAbilities] = useState<ActiveAbility[]>([]);
  const [gameOverStats, setGameOverStats] = useState<GameStats | null>(null);

  // Modals
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Detect touch capability
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // Initialize Game Engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, {
      onScoreUpdate: (newScore, newHigh) => {
        setScore(newScore);
        setHighScore(newHigh);
      },
      onHeartsUpdate: (newHearts) => {
        setHearts(newHearts);
      },
      onStageChange: (newStage, nextSt) => {
        setCurrentStage(newStage);
        setNextStage(nextSt);
        setStageNumber(newStage.id);
      },
      onActiveAbilitiesChange: (abilities) => {
        setActiveAbilities(abilities);
      },
      onGameOver: (stats) => {
        setGameOverStats(stats);
        setGameState('GAME_OVER');
      },
      onWorldTimerUpdate: (timeRem, transProg) => {
        setTimeRemaining(timeRem);
        setTransitionProgress(transProg);
      },
    });

    engineRef.current = engine;
    setHighScore(engine.highScore);
    engine.startLoop();

    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      engine.stopLoop();
    };
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (!eng) return;

      const code = e.code;
      if (code === 'KeyA' || code === 'ArrowLeft') {
        eng.inputLeft = true;
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        eng.inputRight = true;
      } else if (code === 'Space' || code === 'KeyW' || code === 'ArrowUp') {
        eng.inputJump = true;
      } else if (code === 'Escape' || code === 'KeyP') {
        if (eng.state === 'PLAYING') {
          eng.pauseGame();
          setGameState('PAUSED');
        } else if (eng.state === 'PAUSED') {
          eng.resumeGame();
          setGameState('PLAYING');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (!eng) return;

      const code = e.code;
      if (code === 'KeyA' || code === 'ArrowLeft') {
        eng.inputLeft = false;
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        eng.inputRight = false;
      } else if (code === 'Space' || code === 'KeyW' || code === 'ArrowUp') {
        eng.inputJump = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // UI Handlers
  const handleStartGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startNewGame();
      setGameState('PLAYING');
      setGameOverStats(null);
    }
  }, []);

  const handlePause = useCallback(() => {
    if (engineRef.current && engineRef.current.state === 'PLAYING') {
      engineRef.current.pauseGame();
      setGameState('PAUSED');
    }
  }, []);

  const handleResume = useCallback(() => {
    if (engineRef.current && engineRef.current.state === 'PAUSED') {
      engineRef.current.resumeGame();
      setGameState('PLAYING');
    }
  }, []);

  const handleRestart = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startNewGame();
      setGameState('PLAYING');
      setGameOverStats(null);
    }
  }, []);

  const handleMainMenu = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.state = 'MENU';
      engineRef.current.player.animState = 'IDLE';
      setGameState('MENU');
      setGameOverStats(null);
    }
  }, []);

  // Touch button callbacks
  const handleLeftPress = useCallback((pressed: boolean) => {
    if (engineRef.current) engineRef.current.inputLeft = pressed;
  }, []);

  const handleRightPress = useCallback((pressed: boolean) => {
    if (engineRef.current) engineRef.current.inputRight = pressed;
  }, []);

  const handleJumpPress = useCallback((pressed: boolean) => {
    if (engineRef.current) engineRef.current.inputJump = pressed;
  }, []);

  const showMobileControls =
    (gameState === 'PLAYING' || gameState === 'STAGE_TRANSITION') &&
    (isTouchDevice || true); // always ready on mobile, gracefully subtle on desktop

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none touch-none">
      {/* 2D Arcade Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-default"
      />

      {/* In-Game HUD */}
      {(gameState === 'PLAYING' || gameState === 'STAGE_TRANSITION' || gameState === 'PAUSED') && (
        <GameHUD
          hearts={hearts}
          maxHearts={3}
          score={score}
          highScore={highScore}
          timeRemaining={timeRemaining}
          transitionProgress={transitionProgress}
          currentStage={currentStage}
          nextStage={nextStage}
          stageNumber={stageNumber}
          activeAbilities={activeAbilities}
          onPause={handlePause}
        />
      )}

      {/* Mobile Touch Controls */}
      {showMobileControls && (
        <MobileControls
          onLeftPress={handleLeftPress}
          onRightPress={handleRightPress}
          onJumpPress={handleJumpPress}
          vibrationEnabled={settings.vibrationEnabled}
          controlSize={settings.controlSize}
          controlOpacity={settings.controlOpacity}
          controlPosition={settings.controlPosition}
        />
      )}

      {/* Title Screen Menu */}
      {gameState === 'MENU' && (
        <TitleMenu
          onPlay={handleStartGame}
          onOpenGuide={() => setShowGuide(true)}
          onOpenSettings={() => setShowSettings(true)}
          highScore={highScore}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'GAME_OVER' && gameOverStats && (
        <GameOverModal
          stats={gameOverStats}
          onPlayAgain={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Guide Modal */}
      {showGuide && <StageGuideModal onClose={() => setShowGuide(false)} />}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSettingsUpdated={setSettings}
        />
      )}
    </main>
  );
}
