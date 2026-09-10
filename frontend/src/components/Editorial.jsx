import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}?rel=0`
    : null;
};

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const youtubeEmbedUrl = getYouTubeEmbedUrl(secureUrl);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  // 1. If video is a YouTube Video Link, render responsive YouTube Embed iFrame
  if (youtubeEmbedUrl) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-base-300 bg-black">
        <iframe
          src={youtubeEmbedUrl}
          title="Video Solution Editorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video border-0"
        />
      </div>
    );
  }

  // 2. Default HTML5 Direct Video Player
  return (
    <div 
      className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-base-300 bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer"
      />
      
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${
          isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={togglePlayPause}
          className="btn btn-circle btn-primary btn-sm mr-3"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <div className="flex items-center w-full mt-2">
          <span className="text-white text-xs font-mono mr-2">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="range range-primary range-xs flex-1"
          />
          <span className="text-white text-xs font-mono ml-2">
            {formatTime(duration || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
