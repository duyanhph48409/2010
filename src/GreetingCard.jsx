import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Carnation,
  Bouquet,
  EnvelopeBody,
  EnvelopeFlap,
  PolaroidFrame,
  Butterfly,
  Sparkle,
  Petal,
} from './Art.jsx';
import { PLACEHOLDER_PHOTO } from './config.js';

const ease = [0.45, 0, 0.55, 1];

export default function GreetingCard({ config, replayKey }) {
  const [phase, setPhase] = useState(0);
  const scrollRef = useRef(null);
  const autoScrollTimer = useRef(null);
  const userScrolled = useRef(false);
  const [autoScrollDone, setAutoScrollDone] = useState(false);
  const photoUrl = config.photoUrl || PLACEHOLDER_PHOTO;

  // Phase timeline (ms): 0 closed, 1 flap open, 2 card slides up, 3 carnations spring, 4 letter expands
  useEffect(() => {
    setPhase(0);
    setAutoScrollDone(false);
    userScrolled.current = false;

    const timers = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2600),
      setTimeout(() => setPhase(3), 3800),
      setTimeout(() => setPhase(4), 5400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [replayKey]);

  // Auto-scroll
  useEffect(() => {
    if (phase < 4) return;
    const el = scrollRef.current;
    if (!el) return;

    const startTimer = setTimeout(() => {
      if (userScrolled.current) return;
      const el2 = scrollRef.current;
      if (!el2) return;
      const duration = 13000;
      const startTime = performance.now();
      const startScroll = 0;
      const endScroll = el2.scrollHeight - el2.clientHeight;

      const step = (now) => {
        if (userScrolled.current) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 0.5 - 0.5 * Math.cos(Math.PI * progress);
        el2.scrollTop = startScroll + (endScroll - startScroll) * eased;
        if (progress < 1) {
          autoScrollTimer.current = requestAnimationFrame(step);
        } else {
          setAutoScrollDone(true);
        }
      };
      autoScrollTimer.current = requestAnimationFrame(step);
    }, 1000);

    return () => {
      clearTimeout(startTimer);
      if (autoScrollTimer.current) cancelAnimationFrame(autoScrollTimer.current);
    };
  }, [phase, replayKey]);

  const handleUserScroll = useCallback(() => {
    if (phase >= 4 && !autoScrollDone) {
      userScrolled.current = true;
      if (autoScrollTimer.current) cancelAnimationFrame(autoScrollTimer.current);
    }
  }, [phase, autoScrollDone]);

  const handleReplay = useCallback(() => {
    // Let parent handle replay by changing replayKey
    if (config.onReplay) config.onReplay();
  }, [config]);

  const letterParagraphs = (config.letterText || '').split('\n').filter((l) => l.trim());

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        perspective: '1200px',
      }}
    >
      {/* Floating petals background */}
      <FloatingPetals />

      {/* Music / replay handled by parent */}

      {/* Envelope + card container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 360,
        }}
      >
        {/* Phase 0-3: Envelope + card */}
        <AnimatePresence>
          {phase < 4 && (
            <motion.div
              key="envelope-scene"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              {/* Card sliding out from envelope */}
              {phase >= 2 && (
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: 90,
                    left: '50%',
                    marginLeft: -130,
                    width: 260,
                    zIndex: 5,
                    background: '#fff',
                    borderRadius: 10,
                    padding: '20px 16px',
                    boxShadow: '0 8px 24px rgba(201,112,124,0.3)',
                    border: '1px solid #fce0e6',
                    textAlign: 'center',
                  }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: phase >= 3 ? -60 : -30, opacity: 1 }}
                  transition={{ duration: 1.2, ease }}
                >
                  <div
                    style={{ fontFamily: '"Dancing Script", cursive', color: '#c9707c', fontSize: 22, lineHeight: 1.2 }}
                  >
                    {config.titleText}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Dancing Script", cursive',
                      color: '#c9707c',
                      fontSize: 44,
                      fontWeight: 700,
                      lineHeight: 1.1,
                      marginTop: 4,
                    }}
                  >
                    20/10
                  </div>
                  {/* Carnations springing up behind card */}
                  {phase >= 3 && (
                    <>
                      <motion.div
                        style={{ position: 'absolute', bottom: -10, left: -20, zIndex: -1 }}
                        initial={{ scale: 0, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.1 }}
                      >
                        <Carnation size={70} tone="medium" />
                      </motion.div>
                      <motion.div
                        style={{ position: 'absolute', bottom: -10, right: -20, zIndex: -1 }}
                        initial={{ scale: 0, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.25 }}
                      >
                        <Carnation size={56} tone="light" />
                      </motion.div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Envelope body */}
              <div style={{ position: 'relative', width: 300, height: 200 }}>
                <EnvelopeBody width={300} style={{ position: 'absolute', top: 0, left: 0 }} />

                {/* Flap — 3D rotateX from top edge */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 300,
                    height: 200,
                    transformOrigin: 'top center',
                    transformStyle: 'preserve-3d',
                    zIndex: 10,
                  }}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: phase >= 1 ? -180 : 0 }}
                  transition={{ duration: 1.0, ease }}
                >
                  <EnvelopeFlap width={300} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4: Full letter */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              key="letter-scene"
              style={{ position: 'relative', width: '100%' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease }}
            >
              {/* Envelope front panel (remains below as light pink panel) */}
              <motion.div
                style={{
                  position: 'relative',
                  width: '100%',
                  background: 'linear-gradient(180deg, #fbe3e6 0%, #f9d5da 100%)',
                  borderRadius: '14px',
                  padding: '16px 14px 0',
                  boxShadow: '0 4px 20px rgba(201,112,124,0.2)',
                  overflow: 'visible',
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease }}
              >
                {/* Letter content */}
                <motion.div
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    border: '1px solid #fce0e6',
                    padding: '16px 14px',
                    position: 'relative',
                    boxShadow: '0 2px 12px rgba(201,112,124,0.12)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {/* Corner sparkles */}
                  <Sparkle size={14} style={{ position: 'absolute', top: 6, left: 6, opacity: 0.6 }} />
                  <Sparkle size={12} style={{ position: 'absolute', top: 6, right: 6, opacity: 0.5 }} />
                  <Sparkle size={10} style={{ position: 'absolute', bottom: 6, left: 6, opacity: 0.5 }} />

                  {/* Title */}
                  <div style={{ textAlign: 'center', marginBottom: 10 }}>
                    <div
                      style={{ fontFamily: '"Dancing Script", cursive', color: '#c9707c', fontSize: 20 }}
                    >
                      {config.titleText}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Dancing Script", cursive',
                        color: '#c9707c',
                        fontSize: 40,
                        fontWeight: 700,
                        lineHeight: 1.1,
                      }}
                    >
                      20/10
                    </div>
                  </div>

                  {/* Scrollable letter text */}
                  <div
                    ref={scrollRef}
                    onScroll={handleUserScroll}
                    onTouchMove={handleUserScroll}
                    className="no-scrollbar"
                    style={{
                      height: '42vh',
                      maxHeight: 340,
                      overflowY: 'auto',
                      fontFamily: '"Itim", cursive',
                      color: '#2d2a4a',
                      fontSize: 15,
                      lineHeight: 1.7,
                      padding: '0 4px',
                    }}
                  >
                    {letterParagraphs.map((para, i) => (
                      <motion.p
                        key={i}
                        style={{ margin: '0 0 10px' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                      >
                        {para}
                      </motion.p>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: 8, fontStyle: 'italic', color: '#c9707c' }}>
                      — {config.senderName}
                    </div>
                  </div>

                  {/* Butterfly corner */}
                  <Butterfly
                    size={20}
                    style={{ position: 'absolute', bottom: 4, right: 8, opacity: 0.7 }}
                  />
                </motion.div>

                {/* Envelope front bottom section with bouquet + polaroid */}
                <div style={{ position: 'relative', height: 120, marginTop: 10, overflow: 'visible' }}>
                  {/* Bouquet bottom-left overlapping edge */}
                  <motion.div
                    style={{ position: 'absolute', bottom: -20, left: -15, zIndex: 2 }}
                    initial={{ y: 40, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.5 }}
                  >
                    <Bouquet size={110} />
                  </motion.div>

                  {/* Polaroid bottom-right */}
                  <motion.div
                    style={{ position: 'absolute', bottom: -10, right: 5, zIndex: 3 }}
                    initial={{ y: 40, opacity: 0, scale: 0.8, rotate: 0 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.7 }}
                  >
                    <PolaroidFrame photoUrl={photoUrl} rotation={8} />
                  </motion.div>

                  {/* Replay hint */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: '50%',
                      marginLeft: -50,
                      width: 100,
                      textAlign: 'center',
                      fontSize: 12,
                      color: '#c9707c',
                      opacity: 0.7,
                      cursor: 'pointer',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 2 }}
                    onClick={handleReplay}
                  >
                    ↻ Xem lại
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Floating petals background — very subtle
function FloatingPetals() {
  const petals = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 8 + Math.random() * 8,
      color: ['#f9c8d4', '#f4b8c2', '#fce0e6'][Math.floor(Math.random() * 3)],
    })),
  ).current;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          style={{ position: 'absolute', left: `${p.x}%`, top: -20 }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 0.4, 0.4, 0], rotate: 360 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Petal size={p.size} color={p.color} />
        </motion.div>
      ))}
    </div>
  );
}
