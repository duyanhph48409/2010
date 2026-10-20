import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import GreetingCard from './GreetingCard.jsx';
import { getConfig, isEditMode, DEFAULT_CONFIG } from './config.js';

const EditMode = lazy(() => import('./EditMode.jsx'));

export default function App() {
  const [config, setConfig] = useState(() => getConfig());
  const [editMode, setEditMode] = useState(() => isEditMode());
  const [replayKey, setReplayKey] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasInteracted = useRef(false);

  const handleReplay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  const handleFirstTap = useCallback(() => {
    if (hasInteracted.current) return;
    hasInteracted.current = true;
    if (config.backgroundMusicUrl) {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.3;
        audio.play().then(() => setMusicPlaying(true)).catch(() => {});
      }
    }
  }, [config.backgroundMusicUrl]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  }, [musicPlaying]);

  const handleSaveConfig = useCallback((newConfig) => {
    setConfig(newConfig);
  }, []);

  const handlePreview = useCallback(() => {
    setEditMode(false);
    setReplayKey((k) => k + 1);
  }, []);

  // Re-read config when hash changes (shared link opened)
  useEffect(() => {
    const onHashChange = () => {
      setConfig(getConfig());
      setReplayKey((k) => k + 1);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Hidden edit trigger: long-press or gear icon
  const [showGear, setShowGear] = useState(false);
  useEffect(() => {
    if (isEditMode()) return;
    const timer = setTimeout(() => setShowGear(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={handleFirstTap}
      style={{
        width: '100%',
        minHeight: '100dvh',
        background: '#f5dde2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {/* Phone frame: max-w 430px centered */}
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100dvh',
          background: 'radial-gradient(circle at 50% 40%, #ffeef1 0%, #fff8f9 70%)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(201,112,124,0.15)',
        }}
      >
        {/* Music toggle (top-right) */}
        {config.backgroundMusicUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMusic();
            }}
            style={{
              position: 'absolute',
              top: 'calc(env(safe-area-inset-top) + 12px)',
              right: 12,
              zIndex: 50,
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(201,112,124,0.2)',
            }}
          >
            <span style={{ fontSize: 16 }}>{musicPlaying ? '♪' : '♪̸'}</span>
          </button>
        )}

        {/* Gear icon for edit (small, bottom-left) */}
        {showGear && !editMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditMode(true);
            }}
            style={{
              position: 'absolute',
              bottom: 'calc(env(safe-area-inset-bottom) + 16px)',
              left: 12,
              zIndex: 50,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: 0.4,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9707c" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        )}

        {/* Greeting card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100dvh',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <GreetingCard config={config} replayKey={replayKey} />
        </div>

        {/* Tap to replay hint when animation done */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleReplay();
          }}
          style={{
            position: 'absolute',
            bottom: 'calc(env(safe-area-inset-bottom) + 16px)',
            right: 12,
            zIndex: 40,
            fontSize: 12,
            color: '#c9707c',
            opacity: 0.5,
            cursor: 'pointer',
            fontFamily: '"Itim", cursive',
          }}
        >
          Nhấn để xem lại
        </div>

        {/* Audio element */}
        {config.backgroundMusicUrl && (
          <audio ref={audioRef} src={config.backgroundMusicUrl} loop preload="auto" />
        )}

        {/* Edit mode overlay (lazy-loaded, only when needed) */}
        <AnimatePresence>
          {editMode && (
            <Suspense fallback={null}>
              <EditMode
                config={config}
                onSave={handleSaveConfig}
                onPreview={handlePreview}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
