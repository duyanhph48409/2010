import React from 'react';

// Pink carnation — ruffled serrated layered petals in 2-3 pink tones with green leaves
export function Carnation({ size = 80, tone = 'medium', className = '', style = {} }) {
  const palettes = {
    light: { outer: '#fce0e6', mid: '#f9c8d4', inner: '#f4b8c2', center: '#e8576f' },
    medium: { outer: '#f9c8d4', mid: '#f4a8b8', inner: '#ee8ea0', center: '#e8576f' },
    deep: { outer: '#f4a8b8', mid: '#ee8ea0', inner: '#e8576f', center: '#c9707c' },
  };
  const c = palettes[tone] || palettes.medium;

  return (
    <svg viewBox="0 0 100 110" width={size} height={size * 1.1} className={className} style={style}>
      {/* Leaves */}
      <g>
        <ellipse cx="38" cy="85" rx="8" ry="18" fill="#6fb35a" transform="rotate(-25 38 85)" opacity="0.85" />
        <ellipse cx="62" cy="85" rx="8" ry="18" fill="#5fa34e" transform="rotate(25 62 85)" opacity="0.85" />
        <path d="M50 80 Q48 95 50 105" stroke="#5fa34e" strokeWidth="2.5" fill="none" />
      </g>
      {/* Outer petals layer */}
      <g>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M50 42 C42 32 42 22 50 16 C58 22 58 32 50 42 Z"
            fill={c.outer}
            transform={`rotate(${deg} 50 42)`}
            stroke="#f9d5da"
            strokeWidth="0.5"
          />
        ))}
      </g>
      {/* Mid petals layer */}
      <g>
        {[30, 90, 150, 210, 270, 330].map((deg) => (
          <path
            key={deg}
            d="M50 42 C44 34 44 26 50 21 C56 26 56 34 50 42 Z"
            fill={c.mid}
            transform={`rotate(${deg} 50 42)`}
          />
        ))}
      </g>
      {/* Inner petals */}
      <g opacity="0.92">
        {[0, 72, 144, 216, 288].map((deg) => (
          <path
            key={deg}
            d="M50 40 C46 35 46 29 50 25 C54 29 54 35 50 40 Z"
            fill={c.inner}
            transform={`rotate(${deg} 50 42)`}
          />
        ))}
      </g>
      {/* Serrated edge detail on outer petals */}
      <g fill={c.outer} opacity="0.6">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 50 42)`}>
            <circle cx="46" cy="22" r="1.5" />
            <circle cx="50" cy="19" r="1.5" />
            <circle cx="54" cy="22" r="1.5" />
          </g>
        ))}
      </g>
      {/* Center */}
      <circle cx="50" cy="40" r="6" fill={c.center} opacity="0.85" />
      <circle cx="48" cy="38" r="2" fill="#fff" opacity="0.3" />
    </svg>
  );
}

// Bouquet of carnations tied with a pink ribbon bow
export function Bouquet({ size = 120, className = '', style = {} }) {
  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} className={className} style={style}>
      {/* Stems */}
      <g stroke="#5fa34e" strokeWidth="2" fill="none">
        <path d="M30 70 Q40 90 55 110" />
        <path d="M60 65 Q58 88 58 112" />
        <path d="M90 68 Q78 92 62 110" />
      </g>
      {/* Leaves on stems */}
      <ellipse cx="35" cy="85" rx="5" ry="10" fill="#6fb35a" transform="rotate(-30 35 85)" opacity="0.8" />
      <ellipse cx="85" cy="85" rx="5" ry="10" fill="#5fa34e" transform="rotate(30 85 85)" opacity="0.8" />
      {/* Three carnations */}
      <g transform="translate(-15 -5) scale(0.7)">
        <Carnation tone="light" />
      </g>
      <g transform="translate(15 -10) scale(0.75)">
        <Carnation tone="medium" />
      </g>
      <g transform="translate(45 -5) scale(0.7)">
        <Carnation tone="deep" />
      </g>
      {/* Ribbon bow at base */}
      <g transform="translate(58 100)">
        <path d="M0 0 C-15 -5 -22 5 -20 12 C-12 8 -6 5 0 3" fill="#f4b8c2" />
        <path d="M0 0 C15 -5 22 5 20 12 C12 8 6 5 0 3" fill="#f9c8d4" />
        <path d="M-2 -2 Q-4 3 -2 8 Q2 3 2 -2" fill="#ee8ea0" />
        <ellipse cx="-10" cy="3" rx="5" ry="4" fill="#f9d5da" opacity="0.7" />
        <ellipse cx="10" cy="3" rx="5" ry="4" fill="#f9d5da" opacity="0.7" />
      </g>
    </svg>
  );
}

// Envelope with heart wax seal (separate flap component for animation)
export function EnvelopeBody({ width = 300, className = '', style = {} }) {
  const h = (width * 200) / 300;
  return (
    <svg viewBox="0 0 300 200" width={width} height={h} className={className} style={style}>
      {/* Envelope back */}
      <rect x="10" y="30" width="280" height="160" rx="8" fill="#f9d5da" />
      <rect x="10" y="30" width="280" height="160" rx="8" fill="url(#envGrad)" opacity="0.5" />
      {/* Fold lines */}
      <line x1="10" y1="30" x2="150" y2="110" stroke="#f4b8c2" strokeWidth="0.8" opacity="0.4" />
      <line x1="290" y1="30" x2="150" y2="110" stroke="#f4b8c2" strokeWidth="0.8" opacity="0.4" />
      <line x1="10" y1="190" x2="150" y2="110" stroke="#f4b8c2" strokeWidth="0.8" opacity="0.4" />
      <line x1="290" y1="190" x2="150" y2="110" stroke="#f4b8c2" strokeWidth="0.8" opacity="0.4" />
      {/* Envelope front (bottom triangle) */}
      <path d="M10 190 L290 190 L150 110 Z" fill="#fbe3e6" opacity="0.6" />
      <defs>
        <linearGradient id="envGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9d5da" />
          <stop offset="100%" stopColor="#f4b8c2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EnvelopeFlap({ width = 300, className = '', style = {} }) {
  const h = (width * 200) / 300;
  return (
    <svg viewBox="0 0 300 200" width={width} height={h} className={className} style={style}>
      <defs>
        <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4b8c2" />
          <stop offset="100%" stopColor="#f9d5da" />
        </linearGradient>
      </defs>
      {/* Flap - triangle pointing down */}
      <path d="M10 30 L290 30 L150 110 Z" fill="url(#flapGrad)" />
      <path d="M10 30 L290 30 L150 110 Z" fill="none" stroke="#f4b8c2" strokeWidth="0.8" opacity="0.5" />
      {/* Heart wax seal */}
      <g transform="translate(150 60)">
        <path
          d="M0 8 C-8 -2 -18 -2 -18 4 C-18 12 -8 18 0 24 C8 18 18 12 18 4 C18 -2 8 -2 0 8 Z"
          fill="#e8576f"
        />
        {/* Highlight on seal */}
        <ellipse cx="-7" cy="3" rx="4" ry="2.5" fill="#fff" opacity="0.35" />
      </g>
    </svg>
  );
}

// Polaroid frame (white border, tilted) — used as a wrapper
export function PolaroidFrame({ photoUrl, rotation = 8, className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        background: '#fff',
        padding: '6px 6px 28px 6px',
        borderRadius: '4px',
        boxShadow: '0 6px 20px rgba(201,112,124,0.25), 0 2px 8px rgba(0,0,0,0.08)',
        transform: `rotate(${rotation}deg)`,
        width: 110,
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', overflow: 'hidden', borderRadius: '2px' }}>
        <img
          src={photoUrl}
          alt="Kỷ niệm"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Tiny outline heart corner */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          style={{ position: 'absolute', bottom: 2, right: 2 }}
        >
          <path
            d="M12 21 C12 21 4 14 4 9 C4 6 6 4 9 4 C10.5 4 12 5 12 6.5 C12 5 13.5 4 15 4 C18 4 20 6 20 9 C20 14 12 21 12 21 Z"
            fill="none"
            stroke="#e8576f"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

// Tiny butterfly
export function Butterfly({ size = 24, className = '', style = {} }) {
  return (
    <svg viewBox="0 0 40 30" width={size} height={(size * 30) / 40} className={className} style={style}>
      <g fill="#f4b8c2" opacity="0.85">
        <ellipse cx="12" cy="10" rx="9" ry="8" />
        <ellipse cx="28" cy="10" rx="9" ry="8" />
        <ellipse cx="13" cy="20" rx="6" ry="7" fill="#f9c8d4" />
        <ellipse cx="27" cy="20" rx="6" ry="7" fill="#f9c8d4" />
      </g>
      <rect x="19" y="6" width="2" height="16" rx="1" fill="#c9707c" />
      <circle cx="20" cy="5" r="1.5" fill="#c9707c" />
    </svg>
  );
}

// Sparkle / star burst
export function Sparkle({ size = 16, color = '#f4b8c2', className = '', style = {} }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style}>
      <path
        d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
        fill={color}
      />
    </svg>
  );
}

// Floating petal (for background)
export function Petal({ size = 12, color = '#f9c8d4', style = {} }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} style={style}>
      <path d="M10 2 C14 4 16 10 14 16 C12 18 8 18 6 16 C4 10 6 4 10 2 Z" fill={color} opacity="0.5" />
    </svg>
  );
}
