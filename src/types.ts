export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  color: string;
}

export type Point = { x: number; y: number };

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
