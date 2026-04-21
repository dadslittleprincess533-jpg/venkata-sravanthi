import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg selection:bg-neon-green selection:text-black">
      <div className="scanline" />
      
      <div className="w-full max-w-[1200px] h-[90vh] lg:h-[768px] grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] grid-rows-[80px_1fr_100px] gap-5 p-5 box-border relative z-10 font-mono">
        
        {/* Header Region */}
        <header className="col-span-full neon-border flex justify-between items-center px-8">
          <div>
            <div className="label">System Status</div>
            <div className="text-sm font-bold">SYNTH_SNAKE_OS V2.4</div>
          </div>
          <div className="text-center hidden md:block">
            <h1 className="text-xl font-bold tracking-tighter text-neon-cyan">NEON_RHYTHM_SNAKE</h1>
          </div>
          <div className="text-right">
            <div className="label">Encryption</div>
            <div className="text-sm font-bold text-neon-green">AES-256_ACTIVE</div>
          </div>
        </header>

        {/* Sidebar Left: Leaderboard (Mocked from design) */}
        <aside className="neon-border p-4 flex flex-col hidden lg:flex">
          <div className="label">Global Leaderboard</div>
          <ul className="list-none p-0 text-[13px] space-y-3 mt-2">
            <li>01. USER_X99 .... 5200</li>
            <li className="text-neon-cyan">02. YOU ........ 4850</li>
            <li>03. BOT_ALPHA ... 4100</li>
            <li>04. NEO_GEN .... 3900</li>
            <li>05. NULL_PTR ... 2800</li>
          </ul>
          <div className="mt-auto text-[10px] opacity-50 uppercase leading-relaxed">
            Connection: Secure<br />
            Latency: 14ms<br />
            Server: OS_NORTH_1
          </div>
        </aside>

        {/* Center: Game Area */}
        <main className="flex items-center justify-center relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex items-center justify-center"
          >
            <SnakeGame />
          </motion.div>
          <div className="absolute bottom-2 text-[10px] opacity-50 uppercase tracking-widest hidden md:block">
            Use [W][A][S][D] or [ARROWS] to Navigate the Grid
          </div>
        </main>

        {/* Sidebar Right: System/Track info */}
        <aside className="neon-border p-4 flex flex-col hidden lg:flex">
          <div className="label">System Diagnostics</div>
          <div className="space-y-4 text-[12px] mt-2">
            <div>
              <div className="text-neon-cyan opacity-80">CPU_TEMP</div>
              <div className="h-1 w-full bg-white/5 mt-1">
                <div className="h-full w-2/3 bg-neon-cyan" />
              </div>
            </div>
            <div>
              <div className="text-neon-cyan opacity-80">MEM_ALLOC</div>
              <div className="h-1 w-full bg-white/5 mt-1">
                <div className="h-full w-4/5 bg-neon-cyan" />
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="label">Visualizer</div>
            <div className="flex items-end gap-1 h-10 mt-2">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', `${Math.random() * 100}%`, '20%'] }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                  className="w-full bg-neon-green"
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Footer Region: Music Player */}
        <footer className="col-span-full neon-border overflow-hidden">
          <MusicPlayer />
        </footer>
      </div>
    </div>
  );
}
