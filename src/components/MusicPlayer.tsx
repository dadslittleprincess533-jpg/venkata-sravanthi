import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Oracle',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#00f3ff'
  },
  {
    id: '2',
    title: 'Cyber Drift',
    artist: 'Digital Ghost',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#ff00ff'
  },
  {
    id: '3',
    title: 'Synthwave Skyline',
    artist: 'Retro Mind',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#39ff14'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio autoplay prevented', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => console.log('Audio playback failed', e));
    }
  }, [currentTrackIndex, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      const currentTime = audioRef.current.currentTime;
      if (duration) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center gap-6 md:gap-10 px-8 py-4 bg-transparent">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex-1 min-w-0">
        <div className="label">Now Playing</div>
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-neon-cyan uppercase truncate">
            {currentTrack.title} - {currentTrack.artist}
          </div>
          <motion.div 
            animate={{ opacity: isPlaying ? [1, 0, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-2 h-2 rounded-full bg-neon-green"
          />
        </div>
        <div className="mt-2 w-full h-[2px] bg-white/10 relative">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-neon-cyan shadow-[0_0_8px_#00E5FF]"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={skipBackward}
          className="px-4 py-1 border border-neon-green text-[12px] uppercase hover:bg-neon-green hover:text-black transition-all cursor-pointer"
        >
          Prev
        </button>
        
        <button 
          onClick={togglePlay}
          className={`px-6 py-1 border border-neon-green text-[12px] uppercase transition-all cursor-pointer ${isPlaying ? 'bg-neon-green text-black' : 'hover:bg-neon-green hover:text-black'}`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button 
          onClick={skipForward}
          className="px-4 py-1 border border-neon-green text-[12px] uppercase hover:bg-neon-green hover:text-black transition-all cursor-pointer"
        >
          Next
        </button>
      </div>

      <div className="min-w-[120px] text-right hidden lg:block">
        <div className="label">Volume</div>
        <div className="text-xl font-bold">82%</div>
      </div>
    </div>
  );
}
