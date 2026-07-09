import React from 'react';

export default function MusicPlayerCard({ musicOn, toggleMusic }) {
  return (
    <div className="music-player-card">
      <h3 className="music-player-title">PLAY OUR SONG</h3>
      
      {/* Animated dots indicating playback state */}
      <div className={`music-player-dots ${musicOn ? 'is-playing' : ''}`}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="music-player-controls">
        {/* Previous Track (Decorative) */}
        <button type="button" className="music-control-btn prev-btn" aria-label="Previous track">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
          </svg>
        </button>

        {/* Play / Pause Toggle Button */}
        <button 
          type="button" 
          className={`music-play-btn ${musicOn ? 'is-playing' : ''}`} 
          onClick={toggleMusic}
          aria-label={musicOn ? "Pause music" : "Play music"}
        >
          {musicOn ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style={{ marginLeft: '2px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next Track (Decorative) */}
        <button type="button" className="music-control-btn next-btn" aria-label="Next track">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
          </svg>
        </button>
      </div>

      {/* Progress Track Line */}
      <div className="music-player-progress-wrapper">
        <div className="music-player-progress-track">
          <div className={`music-player-progress-fill ${musicOn ? 'is-active' : ''}`}></div>
        </div>
      </div>
    </div>
  );
}
