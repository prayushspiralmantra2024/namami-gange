import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
 
const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};
 
const AudioResponse = ({ audioUrl, messageId }) => {
  const audioRef = useRef(null);
  const sliderRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
 
  // Use this to track the current playing audio
  const [audioId, setAudioId] = useState("");
 
  // A static variable to track which audio is currently playing
  // This ensures only one audio plays at a time
  if (!window.currentPlayingAudio) {
    window.currentPlayingAudio = {
      id: null,
      pauseOthers: () => {}
    };
  }
 
  useEffect(() => {
    const audio = audioRef.current;
 
    const updateProgress = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 95);
      }
    };
 
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
   
    const onEnded = () => {
      setIsPlaying(false);
      if (window.currentPlayingAudio.id === messageId) {
        window.currentPlayingAudio.id = null;
      }
    };
 
    if (audio) {
      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("loadedmetadata", onLoadedMetadata);
      audio.addEventListener("ended", onEnded);
    }
 
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("loadedmetadata", onLoadedMetadata);
        audio.removeEventListener("ended", onEnded);
      }
   
      // Clear the global reference if this was the playing one
      if (window.currentPlayingAudio?.id === messageId) {
        window.currentPlayingAudio = null;
      }
    };
  }, [isDragging, messageId]);
 
  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
 
    if (isPlaying) {
      audio.pause();
      window.currentPlayingAudio.id = null;
    } else {
      // Pause any other playing audio
      if (window.currentPlayingAudio.id && window.currentPlayingAudio.id !== messageId) {
        window.currentPlayingAudio.pauseOthers();
      }
     
      // Set this as the current playing audio
      window.currentPlayingAudio.id = messageId;
      window.currentPlayingAudio.pauseOthers = () => {
        audio.pause();
        setIsPlaying(false);
      };
     
      audio.play().catch(err => {
        console.error("Audio playback failed:", err);
      });
    }
 
    setIsPlaying(!isPlaying);
  };
 
  const handleSeek = (e) => {
    const audio = audioRef.current;
    const value = parseFloat(e.target.value);
    const newTime = (value / 100) * audio.duration;
 
    setCurrentTime(newTime);
    setProgress(value);
 
    if (value >= 100) {
      audio.currentTime = 0;
      setProgress(0);
      audio.pause();
      setIsPlaying(false);
      window.currentPlayingAudio.id = null;
    } else {
      audio.currentTime = newTime;
    }
  };
 
  const handleMouseDown = () => {
    setIsDragging(true);
  };
 
  const handleMouseUp = () => {
    setIsDragging(false);
  };
 
  // Create gradient string for the slider background (full width)
  const createGradient = () => {
    return `linear-gradient(to right,
      #4f46e5 0%,
      #3b82f6 30%,
      #60a5fa 60%,
      #93c5fd 85%,
      #bfdbfe 100%)`;
  };
 
  return (
    <div className="w-full sm:w-3/5 flex justify-center">
       <div className="w-16 h-16 bot-logo mr-2">
        <img src="https://nmcg.nic.in/logo/GIF.gif" alt="namami-gange-ai-logo" />
        </div>
      <div className="flex flex-col gap-2 items-center w-4/5 pt-4 pr-4 pl-4 pb-1 bg-white rounded-lg shadow">
        <h1 className="w-full text-lg font-semibold px-2 text-blue-600">Namami Gange</h1>
        <audio ref={audioRef} src={audioUrl} preload="auto" />
       
        <div className="w-full flex flex-col gap-2">
          {/* Play button and slider in the same row */}
          <div className="w-full flex items-center gap-3">
            <div className="h-full">
              <button
                onClick={togglePlayback}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>
           
            {/* Enhanced slider container */}
            <div className="mt-3 w-full flex flex-col gap-1">
            <div className="relative w-full h-3">
  <input
    ref={sliderRef}
    type="range"
    className="absolute w-full h-3 rounded-lg appearance-none cursor-pointer bg-gray-200 slider-thumb z-10"
    min="0"
    max="100"
    step="0.1"
    value={progress}
    onChange={handleSeek}
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    onTouchStart={handleMouseDown}
    onTouchEnd={handleMouseUp}
  />
 
  {/* Background track with gradient fill */}
  <div className="absolute top-0 left-0 w-full h-3 rounded-lg bg-gray-200 overflow-hidden">
    <div
      className="absolute top-0 left-0 h-full"
      style={{
        width: `${progress}%`,
        background: createGradient(),
      }}
    />
  </div>
 
  {/* Animated thumb rendered separately */}
  <div
    className="absolute top-1/2 transform -translate-y-1/2"
    style={{
      left: `${progress}%`,
      height: '18px',
      width: '18px',
      borderRadius: '9999px',
      background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
      boxShadow: '0 0 10px rgba(59, 130, 246, 0.7), inset 0 0 6px rgba(255, 255, 255, 0.8)',
      border: '2px solid white',
      transition: 'left 0.3s ease, transform 0.15s ease',
      pointerEvents: 'none',
      zIndex: 50,
    }}
  />
</div>
 
              <div className="w-full flex items-center justify-between text-xs text-gray-500 px-1 mt-1">
                <span className="text-sm text-sky-600 font-semibold">{formatTime(currentTime)}</span>
                <span className="text-sm text-sky-600 font-semibold">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <style jsx>{`
  input[type="range"].slider-thumb {
    opacity: 0;
  }
 
  .slider-thumb::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: transparent;
    height: 16px;
    width: 16px;
    margin-top: -7px;
    cursor: pointer;
  }
`}</style>
</div>
  );
};
 
export default AudioResponse;