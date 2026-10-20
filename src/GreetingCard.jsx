import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
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

// Time between each sentence/paragraph appearing
const SENTENCE_DELAY = 700;

// Split letter text into paragraphs (sentences/lines)
function buildParagraphs(text) {
  return (text || '').split('\n').map((l) => l.trim()).filter(Boolean);
}

export default function GreetingCard({ config, replayKey }) {
  const [phase, setPhase] = useState(0);
  const scrollRef = useRef(null);
  const userScrolled = useRef(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const photoUrl = config.photoUrl || PLACEHOLDER_PHOTO;

  // Build paragraphs synchronously
  const paragraphs = useMemo(
    () => buildParagraphs(config.letterText),
    [config.letterText],
  );
  const totalParagraphs = paragraphs.length;

  // Phase timeline (ms): 0 closed, 1 flap open, 2 card slides up, 3 carnations spring, 4 letter expands
  useEffect(() => {
    setPhase(0);
    setVisibleCount(0);
    userScrolled.current = false;

    const timers = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 3200),
      setTimeout(() => setPhase(3), 4600),
      setTimeout(() => setPhase(4), 6200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [replayKey]);

  // Reveal paragraphs one by one with CSS animation + auto-scroll follow
  useEffect(() => {
    if (phase < 4) return;
    if (totalParagraphs === 0) return;

    // Start revealing after letter container appears
    const startTimer = setTimeout(() => {
      setVisibleCount(1);
    }, 1200);

    // Schedule each subsequent paragraph
    const timers = [];
    for (let i = 2; i <= totalParagraphs; i++) {
      timers.push(
        setTimeout(() => {
          if (!userScrolled.current) setVisibleCount(i);
        }, 1200 + (i - 1) * SENTENCE_DELAY),
      );
    }

    return () => {
      clearTimeout(startTimer);
      timers.forEach(clearTimeout);
    };
  }, [phase, replayKey, totalParagraphs]);

  // Auto-scroll to follow revealed paragraphs
  useEffect(() => {
    if (phase < 4 || visibleCount === 0 || userScrolled.current) return;
    const el = scrollRef.current;
    if (!el) return;
    // Scroll to show the latest revealed paragraph
    const target = el.children[visibleCount - 1];
    if (target) {
      const maxScroll = el.scrollHeight - el.clientHeight;
      const targetScroll = Math.min(maxScroll, target.offsetTop + target.offsetHeight - el.clientHeight + 20);
      el.scrollTop = Math.max(0, targetScroll);
    }
  }, [phase, visibleCount]);

  const handleUserScroll = useCallback(() => {
    if (phase >= 4 && visibleCount < totalParagraphs) {
      userScrolled.current = true;
    }
  }, [phase, visibleCount, totalParagraphs]);

  const handleReplay = useCallback(() => {
    // Let parent handle replay by changing replayKey
    if (config.onReplay) config.onReplay();
  }, [config]);

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
                  transition={{ duration: 1.4, ease }}
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
                  transition={{ duration: 1.2, ease }}
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
                  transition={{ duration: 1.2, delay: 0.4 }}
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
                      lineHeight: 1.8,
                      padding: '0 4px',
                      scrollBehavior: 'auto',
                    }}
                  >
                    {paragraphs.map((para, i) => {
                      const isVisible = i < visibleCount;
                      return (
                        <p
                          key={i}
                          className={isVisible ? 'letter-fade-in' : ''}
                          style={{
                            margin: '0 0 14px',
                            opacity: isVisible ? undefined : 0,
                            minHeight: '1.8em',
                          }}
                        >
                          {para}
                        </p>
                      );
                    })}
                    {visibleCount >= totalParagraphs && totalParagraphs > 0 && (
                      <div style={{ textAlign: 'right', marginTop: 8, fontStyle: 'italic', color: '#c9707c' }}>
                        — {config.senderName}
                      </div>
                    )}
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
