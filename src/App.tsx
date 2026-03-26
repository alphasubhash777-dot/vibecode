import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-500 selection:bg-amber-500/30 overflow-hidden relative font-sans">
      <div className="scanlines"></div>
      <div className="static-noise"></div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-12 p-6">
        <div className="text-center glitch-wrapper">
          <h1 className="mb-2 text-6xl font-black tracking-tighter glitch-text uppercase flex items-center justify-center gap-4" data-text="EVIL PYTHON">
            <span className="inline-block grayscale sepia saturate-[10] hue-rotate-[-10deg] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">🐍</span>
            EVIL PYTHON
            <span className="inline-block grayscale sepia saturate-[10] hue-rotate-[-10deg] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] -scale-x-100">🐍</span>
          </h1>
          <p className="text-xl font-medium tracking-widest text-amber-500 uppercase animate-pulse">
            LEVEL: CRITICAL // HIGH_SCORE: {highScore}
          </p>
        </div>

        <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-12 lg:flex-row lg:items-start">
          <div className="flex-1 w-full max-w-2xl border-4 border-yellow-500 p-1 relative bg-black">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-600 transform translate-x-2 translate-y-2 -z-10 mix-blend-screen"></div>
            <SnakeGame onScoreChange={handleScoreChange} />
          </div>
          <div className="w-full max-w-md lg:w-96 border-4 border-amber-600 p-1 relative bg-black">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-500 transform -translate-x-2 -translate-y-2 -z-10 mix-blend-screen"></div>
            <MusicPlayer />
          </div>
        </div>
      </main>
    </div>
  );
}
