import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState, MouseEvent } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: 'Neon Genesis',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/200/200?blur=2',
  },
  {
    id: 2,
    title: 'Cybernetic Dreams',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/200/200?blur=2',
  },
  {
    id: 3,
    title: 'Digital Horizon',
    artist: 'Algorithm',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/synth/200/200?blur=2',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  return (
    <div className="w-full max-w-md bg-black p-6 border-b-4 border-r-4 border-yellow-500 relative">
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden border-2 border-amber-600">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className={`h-full w-full object-cover mix-blend-screen opacity-80 ${
              isPlaying ? 'animate-pulse' : 'grayscale'
            }`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-yellow-500/20 mix-blend-overlay" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="truncate text-2xl font-bold text-amber-500 uppercase tracking-widest">
            {currentTrack.title}
          </h2>
          <p className="truncate text-lg text-yellow-500 uppercase">[{currentTrack.artist}]</p>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="text-yellow-500 transition-colors hover:text-amber-500 hover:scale-110"
            >
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center border-2 border-yellow-500 text-yellow-500 transition-all hover:bg-yellow-500 hover:text-black"
            >
              {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="ml-1 fill-current" />}
            </button>
            <button
              onClick={handleNext}
              className="text-yellow-500 transition-colors hover:text-amber-500 hover:scale-110"
            >
              <SkipForward size={24} />
            </button>
            <button
              onClick={toggleMute}
              className="ml-2 text-amber-500 transition-colors hover:text-yellow-500"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t-2 border-dashed border-amber-600/50 pt-4">
        <div className="flex justify-between text-xs text-yellow-500 mb-1 uppercase">
          <span>AUDIO_STREAM</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          className="h-4 w-full cursor-pointer bg-black border border-yellow-500 relative overflow-hidden"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-amber-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
          {/* Glitch overlay on progress bar */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
