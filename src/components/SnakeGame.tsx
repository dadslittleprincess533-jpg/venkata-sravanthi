import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStatus, Point } from '../types';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setStatus('PLAYING');
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (status !== 'PLAYING') return;

    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      // Check walls
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(prev - 2, 60)); // Increase speed
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [direction, food, status, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (status === 'IDLE' || status === 'GAME_OVER') resetGame();
          else if (status === 'PLAYING') setStatus('PAUSED');
          else if (status === 'PAUSED') setStatus('PLAYING');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#39FF14' : '#22bb00';
      ctx.shadowBlur = i === 0 ? 15 : 0;
      ctx.shadowColor = '#39FF14';
      
      const x = segment.x * CELL_SIZE + 1;
      const y = segment.y * CELL_SIZE + 1;
      const size = CELL_SIZE - 2;
      ctx.beginPath();
      ctx.rect(x, y, size, size); // Sharper squares for the artistic theme
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF00FF';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative p-1 bg-black overflow-hidden snake-canvas neon-border-cyan rounded-none">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="shadow-[0_0_30px_rgba(0,229,255,0.2)]"
        />

        <AnimatePresence>
          {status !== 'PLAYING' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8 text-center"
            >
              {status === 'IDLE' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tighter text-neon-green">NEON_SNAKE</h2>
                  <p className="text-[10px] uppercase tracking-widest text-white/60">Ready for Uplink</p>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-2 border border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-all font-bold uppercase text-sm"
                  >
                    Start Game
                  </button>
                </div>
              )}

              {status === 'GAME_OVER' && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-neon-pink tracking-tighter uppercase">Connection Lost</h2>
                  <div className="text-4xl font-bold text-white tracking-widest">{score.toString().padStart(6, '0')}</div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-loose">Data Packets Recovered</p>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-3 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black transition-all font-bold text-xs tracking-[0.3em] uppercase"
                  >
                    Restart
                  </button>
                </div>
              )}

              {status === 'PAUSED' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-neon-cyan tracking-tighter uppercase">Paused</h2>
                  <button 
                    onClick={() => setStatus('PLAYING')}
                    className="px-8 py-2 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-bold uppercase text-xs"
                  >
                    Resume
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
