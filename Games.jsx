import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Star, ArrowLeft, Trophy, RotateCcw, Gamepad2, Volume2, VolumeX, Cookie, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DancingPlayer from '@/components/DancingPlayer';

// Reaction Game Component
function ReactionGame() {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, go, result
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('reactionBest');
    if (saved) setBestTime(parseInt(saved));
  }, []);

  const startGame = () => {
    setGameState('ready');
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    setTimeout(() => {
      setGameState('go');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      startGame();
    } else if (gameState === 'ready') {
      setGameState('waiting');
      setReactionTime('Too early! 😅');
    } else if (gameState === 'go') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('result');
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('reactionBest', time.toString());
      }
    } else if (gameState === 'result') {
      setReactionTime(null);
      startGame();
    }
  };

  const bgColor = {
    waiting: 'from-slate-800 to-slate-900',
    ready: 'from-red-600 to-red-800',
    go: 'from-green-500 to-emerald-600',
    result: 'from-cyan-600 to-blue-700'
  }[gameState];

  const message = {
    waiting: 'Click to Start!',
    ready: 'Wait for green...',
    go: 'CLICK NOW! ⚡',
    result: typeof reactionTime === 'number' ? `${reactionTime}ms` : reactionTime
  }[gameState];

  return (
    <motion.div
        onClick={handleClick}
        className={`relative w-full h-80 rounded-3xl bg-gradient-to-br ${bgColor} flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none`}
        whileTap={{ scale: 0.98 }}
      >
        <DancingPlayer message={gameState === 'go' ? "CLICK! CLICK! 👆" : gameState === 'result' && typeof reactionTime === 'number' && reactionTime < 200 ? "AMAZING! 🎉" : "You got this! 💪"} />
      <motion.div
        key={gameState}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <Zap className="w-16 h-16 mx-auto mb-4 text-white/80" />
        <p className="text-3xl font-bold text-white">{message}</p>
        {gameState === 'result' && typeof reactionTime === 'number' && (
          <p className="text-white/70 mt-2">
            {reactionTime < 150 ? '🏆 YOU WON! Inhuman speed!' : reactionTime < 200 ? '🔥 AWESOME! Lightning fast!' : reactionTime < 300 ? '👍 Good reflexes!' : '💪 Keep practicing!'}
          </p>
        )}
      </motion.div>
      {bestTime && (
        <div className="absolute bottom-4 right-4 bg-black/30 rounded-full px-4 py-2 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-white text-sm">Best: {bestTime}ms</span>
        </div>
      )}
    </motion.div>
  );
}

// Memory Game Component
function MemoryGame() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, showing, playing, won, lost
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const colors = ['red', 'blue', 'green', 'yellow'];
  const colorStyles = {
    red: 'bg-red-500 hover:bg-red-400',
    blue: 'bg-blue-500 hover:bg-blue-400',
    green: 'bg-green-500 hover:bg-green-400',
    yellow: 'bg-yellow-500 hover:bg-yellow-400'
  };

  useEffect(() => {
    const saved = localStorage.getItem('memoryHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    const firstColor = colors[Math.floor(Math.random() * 4)];
    setSequence([firstColor]);
    setPlayerSequence([]);
    setScore(0);
    setGameState('showing');
    showSequence([firstColor]);
  };

  const showSequence = async (seq) => {
    setIsShowingSequence(true);
    await new Promise(r => setTimeout(r, 500));
    
    for (let color of seq) {
      setActiveButton(color);
      await new Promise(r => setTimeout(r, 400));
      setActiveButton(null);
      await new Promise(r => setTimeout(r, 200));
    }
    
    setIsShowingSequence(false);
    setGameState('playing');
  };

  const handleColorClick = (color) => {
    if (gameState !== 'playing' || isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    setActiveButton(color);
    setTimeout(() => setActiveButton(null), 150);

    const currentIndex = newPlayerSequence.length - 1;
    if (sequence[currentIndex] !== color) {
      setGameState('lost');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('memoryHighScore', score.toString());
      }
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setPlayerSequence([]);
      
      const nextColor = colors[Math.floor(Math.random() * 4)];
      const newSequence = [...sequence, nextColor];
      setSequence(newSequence);
      
      setTimeout(() => {
        setGameState('showing');
        showSequence(newSequence);
      }, 800);
    }
  };

  return (
      <div className="w-full relative">
        <DancingPlayer message={gameState === 'showing' ? "Watch closely! 👀" : gameState === 'playing' ? "You can do it! 🧠" : gameState === 'lost' ? "Try again! 💪" : "Let's play! 🎮"} />
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
        {colors.map(color => (
          <motion.button
            key={color}
            onClick={() => handleColorClick(color)}
            disabled={gameState !== 'playing'}
            whileTap={{ scale: 0.95 }}
            className={`h-24 rounded-2xl ${colorStyles[color]} transition-all duration-150 ${
              activeButton === color ? 'brightness-150 scale-105' : ''
            } ${gameState !== 'playing' ? 'opacity-60' : ''}`}
          />
        ))}
      </div>

      <div className="text-center">
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-white">
            <span className="text-slate-400 text-sm">Score</span>
            <p className="text-2xl font-bold">{score}</p>
          </div>
          <div className="text-white">
            <span className="text-slate-400 text-sm">High Score</span>
            <p className="text-2xl font-bold text-yellow-400">{highScore}</p>
          </div>
        </div>

        {gameState === 'idle' && (
          <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-500">
            Start Game
          </Button>
        )}
        {gameState === 'showing' && (
          <p className="text-cyan-400 animate-pulse">Watch the sequence...</p>
        )}
        {gameState === 'playing' && (
          <p className="text-green-400">Your turn! Repeat the pattern</p>
        )}
        {gameState === 'lost' && (
          <div>
            <p className="text-red-400 mb-3">Game Over! Score: {score}</p>
            <Button onClick={startGame} variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Tap Frenzy Game Component
function TapFrenzyGame() {
    const [count, setCount] = useState(0);
    const [selectedTime, setSelectedTime] = useState(10); // 10, 50, or 100 seconds
    const [timeLeft, setTimeLeft] = useState(100); // In tenths of seconds
    const [gameState, setGameState] = useState('idle'); // idle, playing, finished
    const [highScore, setHighScore] = useState({});

    const timeOptions = [10, 50, 100];

    const getDancerMessage = () => {
      if (gameState === 'playing') {
        if (timeLeft <= 30) return "FASTER! ⚡";
        return "TAP TAP TAP! 👆";
      }
      if (gameState === 'finished') return "Great job! 🎉";
      return "Ready to tap? 🖐️";
    };

  useEffect(() => {
    const saved = localStorage.getItem('tapHighScores');
    if (saved) setHighScore(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 100); // Tick every 100ms
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      setGameState('finished');
      const currentBest = highScore[selectedTime] || 0;
      if (count > currentBest) {
        const newHighScores = { ...highScore, [selectedTime]: count };
        setHighScore(newHighScores);
        localStorage.setItem('tapHighScores', JSON.stringify(newHighScores));
      }
    }
  }, [gameState, timeLeft, count, highScore, selectedTime]);

  const startGame = () => {
    setCount(0);
    setTimeLeft(selectedTime * 10); // Convert seconds to tenths
    setGameState('playing');
  };

  const handleTap = () => {
    if (gameState === 'playing' && timeLeft > 0) {
      setCount(c => c + 1);
      setTimeLeft(t => Math.max(0, t - 2)); // Each tap removes 0.2 seconds
    }
  };

  return (
    <div className="w-full text-center relative">
      <DancingPlayer message={getDancerMessage()} />
      <div className="flex justify-center gap-8 mb-6">
        <div className="text-white">
          <span className="text-slate-400 text-sm">Taps</span>
          <motion.p 
            key={count}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold"
          >
            {count}
          </motion.p>
        </div>
        <div className="text-white">
          <span className="text-slate-400 text-sm">Time</span>
          <p className={`text-4xl font-bold ${timeLeft <= 30 ? 'text-red-400' : ''}`}>{(timeLeft / 10).toFixed(1)}s</p>
        </div>
      </div>

      {gameState === 'idle' && (
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {timeOptions.map(time => (
              <Button
                key={time}
                onClick={() => setSelectedTime(time)}
                variant={selectedTime === time ? "default" : "outline"}
                className={selectedTime === time 
                  ? "bg-orange-500 hover:bg-orange-400" 
                  : "border-slate-600 text-white hover:bg-slate-800"}
              >
                {time}s
              </Button>
            ))}
          </div>
          <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500">
            <Star className="mr-2" /> Start Tapping!
          </Button>
        </div>
      )}

      {gameState === 'playing' && (
        <motion.button
          onClick={handleTap}
          whileTap={{ scale: 0.9 }}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl shadow-orange-500/50 flex items-center justify-center mx-auto"
        >
          <Star className="w-20 h-20 text-white" />
        </motion.button>
      )}

      {gameState === 'finished' && (
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6"
          >
            <p className="text-5xl font-bold text-white mb-2">{count} taps!</p>
            <p className="text-slate-400">Tapping made it harder! 🔥</p>
            {count > (highScore[selectedTime] || 0) - 1 && count === highScore[selectedTime] && (
              <p className="text-yellow-400 mt-2">🏆 New High Score!</p>
            )}
          </motion.div>
          <div className="flex justify-center gap-2 mb-4">
            <span className="text-slate-400">High Score ({selectedTime}s):</span>
            <span className="text-yellow-400 font-bold">{highScore[selectedTime] || 0}</span>
          </div>
          <Button onClick={startGame} variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            <RotateCcw className="w-4 h-4 mr-2" /> Play Again
          </Button>
        </div>
      )}
    </div>
  );
}

// Snake Game Component
function SnakeGame() {
    const canvasRef = React.useRef(null);
    const [gameState, setGameState] = useState('idle'); // idle, playing, gameover
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const gameRef = React.useRef({ snake: [], food: null, direction: 'RIGHT', nextDirection: 'RIGHT' });
    const eatSoundRef = React.useRef(null);
    const gameOverSoundRef = React.useRef(null);

    const GRID_SIZE = 20;
    const CELL_SIZE = 15;

    const getDancerMessage = () => {
      if (gameState === 'playing') {
        if (score >= 50) return "You're on fire! 🔥";
        if (score >= 20) return "Keep going! 🐍";
        return "Eat the apple! 🍎";
      }
      if (gameState === 'gameover') return "Nice try! 💪";
      return "Let's go! 🎮";
    };

  useEffect(() => {
    eatSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    eatSoundRef.current.volume = 0.5;
    gameOverSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3');
    gameOverSoundRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const initGame = () => {
    const initialSnake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 }
    ];
    gameRef.current = {
      snake: initialSnake,
      food: spawnFood(initialSnake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT'
    };
    setScore(0);
    setGameState('playing');
  };

  const spawnFood = (snake) => {
    let food;
    do {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(seg => seg.x === food.x && seg.y === food.y));
    return food;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      const { direction } = gameRef.current;
      
      const keyMap = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
        W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT'
      };
      
      const newDir = keyMap[e.key];
      if (!newDir) return;
      
      const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      if (opposites[newDir] !== direction) {
        gameRef.current.nextDirection = newDir;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      const { snake, food, nextDirection } = gameRef.current;
      gameRef.current.direction = nextDirection;
      
      const head = { ...snake[0] };
      
      switch (nextDirection) {
        case 'UP': head.y--; break;
        case 'DOWN': head.y++; break;
        case 'LEFT': head.x--; break;
        case 'RIGHT': head.x++; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState('gameover');
        gameOverSoundRef.current?.play().catch(() => {});
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        return;
      }

      // Check self collision
      if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameState('gameover');
        gameOverSoundRef.current?.play().catch(() => {});
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        return;
      }

      const newSnake = [head, ...snake];
      
      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        gameRef.current.food = spawnFood(newSnake);
        eatSoundRef.current?.play().catch(() => {});
      } else {
        newSnake.pop();
      }
      
      gameRef.current.snake = newSnake;

      // Draw
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw snake
      newSnake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#22c55e' : '#4ade80';
        ctx.fillRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });
      
      // Draw food
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(
        gameRef.current.food.x * CELL_SIZE + CELL_SIZE / 2,
        gameRef.current.food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2, 0, Math.PI * 2
      );
      ctx.fill();
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameState, score, highScore]);

  const handleTouch = (dir) => {
    if (gameState !== 'playing') return;
    const { direction } = gameRef.current;
    const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (opposites[dir] !== direction) {
      gameRef.current.nextDirection = dir;
    }
  };

  return (
      <div className="w-full text-center relative">
        <DancingPlayer message={getDancerMessage()} />
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-white">
            <span className="text-slate-400 text-sm">Score</span>
            <p className="text-2xl font-bold">{score}</p>
          </div>
          <div className="text-white">
            <span className="text-slate-400 text-sm">High Score</span>
            <p className="text-2xl font-bold text-yellow-400">{highScore}</p>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="rounded-xl border-2 border-green-500/50 bg-slate-800 shadow-[0_0_20px_rgba(34,197,94,0.4),0_0_40px_rgba(34,197,94,0.2)]"
        />
      </div>

      {gameState === 'idle' && (
        <Button onClick={initGame} className="bg-green-600 hover:bg-green-500">
          Start Game
        </Button>
      )}

      {gameState === 'playing' && (
        <div className="space-y-2">
          <p className="text-slate-400 text-sm">Use arrow keys or WASD</p>
          <div className="flex justify-center gap-2 md:hidden">
            <div className="grid grid-cols-3 gap-1">
              <div />
              <Button size="sm" variant="outline" className="border-slate-600 text-white" onClick={() => handleTouch('UP')}>↑</Button>
              <div />
              <Button size="sm" variant="outline" className="border-slate-600 text-white" onClick={() => handleTouch('LEFT')}>←</Button>
              <Button size="sm" variant="outline" className="border-slate-600 text-white" onClick={() => handleTouch('DOWN')}>↓</Button>
              <Button size="sm" variant="outline" className="border-slate-600 text-white" onClick={() => handleTouch('RIGHT')}>→</Button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div>
          <p className="text-red-400 mb-3">Game Over! Score: {score}</p>
          <Button onClick={initGame} variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            <RotateCcw className="w-4 h-4 mr-2" /> Play Again
          </Button>
        </div>
      )}
    </div>
  );
}

// FPS Zombie Shooter Game Component
function FPSGame() {
    const [gameState, setGameState] = useState('idle'); // idle, playing, finished
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [targets, setTargets] = useState([]);
    const [highScore, setHighScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [lastHit, setLastHit] = useState(null);
    const gameAreaRef = useRef(null);
    const shootSoundRef = useRef(null);

    const zombieEmojis = ['🧟', '🧟‍♂️', '🧟‍♀️'];

    const getDancerMessage = () => {
      if (gameState === 'playing') {
        if (combo >= 5) return "COMBO x5! 🔥";
        if (timeLeft <= 5) return "HURRY! ⏰";
        return "Shoot 'em! 🔫";
      }
      if (gameState === 'finished') return "Zombies down! 💀";
      return "Ready to fight? 🧟";
    };

  useEffect(() => {
    shootSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    shootSoundRef.current.volume = 0.3;
    const saved = localStorage.getItem('fpsHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      setGameState('finished');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('fpsHighScore', score.toString());
      }
    }
  }, [gameState, timeLeft, score, highScore]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const spawnTarget = () => {
      const id = Date.now() + Math.random();
      const size = Math.random() > 0.7 ? 40 : Math.random() > 0.5 ? 55 : 70;
      const points = size === 40 ? 30 : size === 55 ? 20 : 10;
      const newTarget = {
        id,
        x: Math.random() * 70 + 15,
        y: Math.random() * 60 + 20,
        size,
        points,
        zombie: zombieEmojis[Math.floor(Math.random() * zombieEmojis.length)],
        lifetime: size === 40 ? 1500 : size === 55 ? 2000 : 2500
      };
      setTargets(prev => [...prev, newTarget]);
      
      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== id));
        setCombo(0);
      }, newTarget.lifetime);
    };

    const interval = setInterval(spawnTarget, 800);
    spawnTarget();
    return () => clearInterval(interval);
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setCombo(0);
    setGameState('playing');
  };

  const handleShoot = (target, e) => {
    e.stopPropagation();
    shootSoundRef.current?.play().catch(() => {});
    const newCombo = combo + 1;
    setCombo(newCombo);
    const comboMultiplier = Math.min(newCombo, 5);
    const points = target.points * comboMultiplier;
    setScore(s => s + points);
    setLastHit({ x: target.x, y: target.y, points, id: Date.now() });
    setTargets(prev => prev.filter(t => t.id !== target.id));
    setTimeout(() => setLastHit(null), 500);
  };

  const handleMiss = () => {
    if (gameState === 'playing') {
      setCombo(0);
    }
  };

  // Shattered glass pieces for overlay
  const glassShards = [
    { clipPath: 'polygon(0% 0%, 15% 0%, 20% 30%, 5% 25%)', top: 0, left: 0 },
    { clipPath: 'polygon(15% 0%, 40% 0%, 35% 20%, 20% 30%)', top: 0, left: 0 },
    { clipPath: 'polygon(40% 0%, 60% 0%, 55% 25%, 35% 20%)', top: 0, left: 0 },
    { clipPath: 'polygon(60% 0%, 85% 0%, 80% 15%, 55% 25%)', top: 0, left: 0 },
    { clipPath: 'polygon(85% 0%, 100% 0%, 100% 20%, 80% 15%)', top: 0, left: 0 },
    { clipPath: 'polygon(0% 25%, 5% 25%, 10% 50%, 0% 55%)', top: 0, left: 0 },
    { clipPath: 'polygon(90% 20%, 100% 20%, 100% 50%, 85% 45%)', top: 0, left: 0 },
    { clipPath: 'polygon(0% 55%, 10% 50%, 15% 80%, 0% 75%)', top: 0, left: 0 },
    { clipPath: 'polygon(85% 45%, 100% 50%, 100% 80%, 90% 75%)', top: 0, left: 0 },
    { clipPath: 'polygon(0% 75%, 15% 80%, 20% 100%, 0% 100%)', top: 0, left: 0 },
    { clipPath: 'polygon(15% 80%, 35% 85%, 40% 100%, 20% 100%)', top: 0, left: 0 },
    { clipPath: 'polygon(35% 85%, 65% 90%, 70% 100%, 40% 100%)', top: 0, left: 0 },
    { clipPath: 'polygon(65% 90%, 85% 85%, 90% 100%, 70% 100%)', top: 0, left: 0 },
    { clipPath: 'polygon(85% 85%, 90% 75%, 100% 80%, 100% 100%, 90% 100%)', top: 0, left: 0 },
  ];

  return (
      <div className="w-full relative">
        <DancingPlayer message={getDancerMessage()} />
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-white">
            <span className="text-slate-400 text-sm">Kills</span>
            <p className="text-2xl font-bold text-red-400">{score}</p>
          </div>
          <div className="text-white">
            <span className="text-slate-400 text-sm">Time</span>
            <p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : ''}`}>{timeLeft}s</p>
          </div>
          <div className="text-white">
            <span className="text-slate-400 text-sm">Combo</span>
            <p className="text-2xl font-bold text-yellow-400">x{Math.min(combo, 5)}</p>
          </div>
        </div>

        {gameState === 'idle' && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🧟</div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Zombie Invasion!</h3>
          <p className="text-slate-400 mb-4">Shoot zombies through the broken window!</p>
          <p className="text-slate-500 text-sm mb-6">Smaller zombies = more points • Build combos!</p>
          <Button onClick={startGame} className="bg-red-600 hover:bg-red-500">
            🔫 Defend the Window
          </Button>
          {highScore > 0 && (
            <p className="mt-4 text-yellow-400">High Score: {highScore}</p>
          )}
        </div>
      )}

      {gameState === 'playing' && (
        <div 
          ref={gameAreaRef}
          onClick={handleMiss}
          className="relative w-full h-80 rounded-2xl overflow-hidden"
          style={{ cursor: 'crosshair' }}
        >
          {/* Dark outdoor background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-green-950 to-slate-900" />
          
          {/* Foggy atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent" />
          
          {/* Zombies */}
          {targets.map(target => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={(e) => handleShoot(target, e)}
              className="absolute hover:scale-110 transition-transform z-10"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                fontSize: target.size,
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 0 10px rgba(0,255,0,0.5))'
              }}
            >
              {target.zombie}
            </motion.button>
          ))}
          
          {/* Hit feedback */}
          {lastHit && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -40, scale: 1.5 }}
              className="absolute text-red-500 font-bold pointer-events-none z-20 text-xl"
              style={{ left: `${lastHit.x}%`, top: `${lastHit.y}%` }}
            >
              +{lastHit.points}
            </motion.div>
          )}

          {/* Shattered window frame overlay */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {/* Wooden window frame */}
            <div className="absolute inset-0 border-[12px] border-amber-900 rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" 
                 style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 49%, #78350f 49%, #78350f 51%, transparent 51%, transparent 100%), linear-gradient(0deg, transparent 0%, transparent 49%, #78350f 49%, #78350f 51%, transparent 51%, transparent 100%)' }} />
            
            {/* Glass shards - jagged broken pieces around edges */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
              {/* Remaining glass shards on edges */}
              <polygon points="0,0 60,0 45,35 25,50 0,40" fill="rgba(200,230,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <polygon points="60,0 120,0 100,25 80,40 45,35" fill="rgba(200,230,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <polygon points="280,0 340,0 340,30 320,45 295,35" fill="rgba(200,230,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <polygon points="340,0 400,0 400,45 380,55 340,30" fill="rgba(200,230,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              
              <polygon points="0,40 25,50 30,90 15,110 0,100" fill="rgba(200,230,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <polygon points="0,100 15,110 20,150 0,160" fill="rgba(200,230,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <polygon points="400,45 400,100 385,90 375,60" fill="rgba(200,230,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <polygon points="400,100 400,160 390,145 385,90" fill="rgba(200,230,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              
              <polygon points="0,220 20,210 35,250 25,280 0,270" fill="rgba(200,230,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <polygon points="0,270 25,280 40,320 0,320" fill="rgba(200,230,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <polygon points="400,200 400,260 385,245 380,215" fill="rgba(200,230,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <polygon points="400,260 400,320 360,320 375,290 385,245" fill="rgba(200,230,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              
              <polygon points="40,320 100,320 85,290 60,285 35,295" fill="rgba(200,230,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <polygon points="300,320 360,320 345,295 320,285 305,295" fill="rgba(200,230,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              
              {/* Crack lines radiating from impact */}
              <line x1="200" y1="120" x2="50" y2="30" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <line x1="200" y1="120" x2="350" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <line x1="200" y1="120" x2="30" y2="200" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <line x1="200" y1="120" x2="380" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <line x1="200" y1="120" x2="100" y2="300" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
              <line x1="200" y1="120" x2="320" y2="310" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
              <line x1="200" y1="120" x2="200" y2="310" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="200" y1="120" x2="20" y2="120" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <line x1="200" y1="120" x2="390" y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              
              {/* Secondary cracks */}
              <line x1="120" y1="70" x2="80" y2="150" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <line x1="280" y1="60" x2="330" y2="140" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <line x1="150" y1="200" x2="80" y2="280" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="260" y1="190" x2="340" y2="260" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            </svg>
            
            {/* Impact hole - jagged edges */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <polygon 
                  points="40,5 50,15 55,8 60,20 70,18 62,30 75,35 65,42 72,55 58,52 55,65 45,55 40,70 35,55 25,65 22,52 8,55 15,42 5,35 18,30 10,18 20,20 25,8 30,15" 
                  fill="transparent" 
                  stroke="rgba(255,255,255,0.6)" 
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="text-center py-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <div className="text-5xl mb-4">💀</div>
            <p className="text-4xl font-bold text-red-400 mb-2">{score} zombies!</p>
            {score >= highScore && score > 0 && (
              <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
            )}
            <p className="text-slate-400 mb-6">High Score: {highScore}</p>
            <Button onClick={startGame} variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/30">
              <RotateCcw className="w-4 h-4 mr-2" /> Defend Again
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Cookie Clicker Game Component
function CookieClickerGame() {
    const [cookies, setCookies] = useState(0);
    const [cookiesPerClick, setCookiesPerClick] = useState(1);
    const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
    const [upgrades, setUpgrades] = useState({
      cursor: 0,
      grandma: 0,
      farm: 0
    });

    const getDancerMessage = () => {
      if (cookies >= 1000) return "Cookie master! 🏆";
      if (cookies >= 100) return "So many cookies! 🍪";
      if (cookiesPerSecond > 0) return "Auto-baking! 🤖";
      return "Click click! 🍪";
    };

    const upgradeData = {
    cursor: { name: 'Cursor', baseCost: 15, cps: 0.1, cpcBonus: 1 },
    grandma: { name: 'Grandma', baseCost: 100, cps: 1, cpcBonus: 0 },
    farm: { name: 'Farm', baseCost: 500, cps: 5, cpcBonus: 0 }
  };

  useEffect(() => {
    const saved = localStorage.getItem('cookieClickerSave');
    if (saved) {
      const data = JSON.parse(saved);
      setCookies(data.cookies || 0);
      setCookiesPerClick(data.cookiesPerClick || 1);
      setCookiesPerSecond(data.cookiesPerSecond || 0);
      setUpgrades(data.upgrades || { cursor: 0, grandma: 0, farm: 0 });
    }
  }, []);

  useEffect(() => {
    const saveData = { cookies, cookiesPerClick, cookiesPerSecond, upgrades };
    localStorage.setItem('cookieClickerSave', JSON.stringify(saveData));
  }, [cookies, cookiesPerClick, cookiesPerSecond, upgrades]);

  useEffect(() => {
    if (cookiesPerSecond > 0) {
      const timer = setInterval(() => {
        setCookies(c => c + cookiesPerSecond / 10);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [cookiesPerSecond]);

  const handleClick = () => {
    setCookies(c => c + cookiesPerClick);
  };

  const getUpgradeCost = (type) => {
    return Math.floor(upgradeData[type].baseCost * Math.pow(1.15, upgrades[type]));
  };

  const buyUpgrade = (type) => {
    const cost = getUpgradeCost(type);
    if (cookies >= cost) {
      setCookies(c => c - cost);
      setUpgrades(u => ({ ...u, [type]: u[type] + 1 }));
      setCookiesPerSecond(cps => cps + upgradeData[type].cps);
      if (upgradeData[type].cpcBonus > 0) {
        setCookiesPerClick(cpc => cpc + upgradeData[type].cpcBonus);
      }
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
      <div className="w-full text-center relative">
        <DancingPlayer message={getDancerMessage()} />
        <div className="mb-6">
          <motion.p 
            key={Math.floor(cookies)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-amber-400"
          >
            🍪 {formatNumber(cookies)}
          </motion.p>
        <p className="text-slate-400 text-sm">
          {cookiesPerClick}/click • {cookiesPerSecond.toFixed(1)}/sec
        </p>
      </div>

      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 shadow-2xl shadow-amber-500/50 flex items-center justify-center mx-auto mb-8 text-7xl"
      >
        🍪
      </motion.button>

      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
        {Object.entries(upgradeData).map(([key, data]) => {
          const cost = getUpgradeCost(key);
          const canAfford = cookies >= cost;
          return (
            <motion.button
              key={key}
              onClick={() => buyUpgrade(key)}
              disabled={!canAfford}
              whileTap={canAfford ? { scale: 0.95 } : {}}
              className={`p-3 rounded-xl border transition-all ${
                canAfford 
                  ? 'bg-slate-800 border-amber-500/50 hover:border-amber-400' 
                  : 'bg-slate-900 border-slate-700 opacity-50'
              }`}
            >
              <p className="text-white font-medium text-sm">{data.name}</p>
              <p className="text-amber-400 text-xs">{formatNumber(cost)} 🍪</p>
              <p className="text-slate-500 text-xs">Owned: {upgrades[key]}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const gameComponents = {
  reaction: { component: ReactionGame, title: 'Lightning Reflexes', icon: Zap, color: 'from-cyan-500 to-blue-600' },
  memory: { component: MemoryGame, title: 'Mind Maze', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
  clicker: { component: TapFrenzyGame, title: 'Tap Frenzy', icon: Star, color: 'from-orange-500 to-red-600' },
  snake: { component: SnakeGame, title: 'Snake', icon: Gamepad2, color: 'from-green-500 to-emerald-600' },
  cookie: { component: CookieClickerGame, title: 'Cookie Clicker', icon: Cookie, color: 'from-amber-500 to-orange-600' },
  fps: { component: FPSGame, title: 'Zombie Shooter', icon: Crosshair, color: 'from-red-500 to-rose-600' }
};

export default function Games() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialGame = urlParams.get('game') || null;
  const [selectedGame, setSelectedGame] = useState(initialGame);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (musicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  const GameComponent = selectedGame ? gameComponents[selectedGame]?.component : null;
  const gameInfo = selectedGame ? gameComponents[selectedGame] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-cyan-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex-1">
            {selectedGame ? gameInfo?.title : 'Choose Your Game'}
          </h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMusic}
            className={`${musicPlaying ? 'text-cyan-400' : 'text-slate-400'} hover:text-white hover:bg-slate-800`}
          >
            {musicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {Object.entries(gameComponents).map(([id, game]) => (
                <motion.button
                  key={id}
                  onClick={() => setSelectedGame(id)}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-8 text-left transition-all"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-6`}>
                    <game.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gameInfo?.color} flex items-center justify-center`}>
                    {gameInfo && <gameInfo.icon className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{gameInfo?.title}</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="ml-auto text-slate-400 hover:text-white"
                    onClick={() => setSelectedGame(null)}
                  >
                    Change Game
                  </Button>
                </div>
                
                {GameComponent && <GameComponent />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}