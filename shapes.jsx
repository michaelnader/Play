// Play — decorative shapes (chunky geometric, grainy fills)
// These echo the reference: arrow-circle, half-discs, triangle pairs, etc.

const Shape = {
  // Arrow with circle head (like the reference's left-side stamp)
  ArrowDot: ({ color = "var(--tang)", size = 200, rotate = 0 }) => (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100" style={{ transform: `rotate(${rotate}deg)`, overflow: 'visible' }}>
      <defs>
        <filter id="grain1" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      <circle cx="22" cy="50" r="16" fill="none" stroke="#111" strokeWidth="6"/>
      <line x1="38" y1="50" x2="130" y2="50" stroke="#111" strokeWidth="6" strokeLinecap="round"/>
      <polygon points="130,38 156,50 130,62" fill="#111"/>
      <g>
        <circle cx="160" cy="50" r="30" fill={color}/>
        <circle cx="160" cy="50" r="30" fill="black" opacity="0.35" filter="url(#grain1)"/>
      </g>
    </svg>
  ),

  // Half disc pair (like the reference's purple+green D shapes)
  HalfDiscs: ({ a = "var(--grape)", b = "var(--leaf)", size = 180 }) => (
    <svg width={size} height={size} viewBox="0 0 180 180" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="grainA" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      <g>
        <path d="M50 10 a80 80 0 0 1 0 160 Z" fill={a}/>
        <path d="M50 10 a80 80 0 0 1 0 160 Z" fill="black" opacity="0.4" filter="url(#grainA)"/>
      </g>
      <g>
        <path d="M100 10 a80 80 0 0 1 0 160 Z" fill={b}/>
        <path d="M100 10 a80 80 0 0 1 0 160 Z" fill="black" opacity="0.4" filter="url(#grainA)"/>
      </g>
    </svg>
  ),

  // Two opposing triangles (like the reference's bottom-right)
  Triangles: ({ a = "var(--tang)", b = "var(--ocean)", size = 220 }) => (
    <svg width={size} height={size * 0.65} viewBox="0 0 220 140" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="grainT" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      <g>
        <polygon points="10,10 110,10 60,140" fill={a}/>
        <polygon points="10,10 110,10 60,140" fill="black" opacity="0.4" filter="url(#grainT)"/>
      </g>
      <g>
        <polygon points="110,10 210,10 160,140" fill={b}/>
        <polygon points="110,10 210,10 160,140" fill="black" opacity="0.4" filter="url(#grainT)"/>
      </g>
    </svg>
  ),

  // Dot + cross + dot (the reference's blue·×·green pattern)
  DotCrossDot: ({ a = "var(--ocean)", b = "var(--leaf)", size = 160 }) => (
    <svg width={size} height={size * 0.35} viewBox="0 0 160 56" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="grainDC" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      <g><circle cx="22" cy="28" r="22" fill={a}/><circle cx="22" cy="28" r="22" fill="black" opacity="0.4" filter="url(#grainDC)"/></g>
      <g stroke="#111" strokeWidth="6" strokeLinecap="round">
        <line x1="68" y1="14" x2="92" y2="42"/>
        <line x1="92" y1="14" x2="68" y2="42"/>
      </g>
      <g><circle cx="138" cy="28" r="22" fill={b}/><circle cx="138" cy="28" r="22" fill="black" opacity="0.4" filter="url(#grainDC)"/></g>
    </svg>
  ),

  // Speech bubble with a dot inside (the reference's yellow bubble vibe)
  ChatBubble: ({ color = "var(--sun)", dot = "var(--tang)", size = 200 }) => (
    <svg width={size} height={size * 0.55} viewBox="0 0 200 110" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="grainB" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      <g>
        <rect x="6" y="10" width="180" height="80" rx="40" fill={color} stroke="#111" strokeWidth="5"/>
        <rect x="6" y="10" width="180" height="80" rx="40" fill="black" opacity="0.3" filter="url(#grainB)"/>
        <path d="M30 92 L42 110 L58 92 Z" fill={color} stroke="#111" strokeWidth="5" strokeLinejoin="round"/>
      </g>
      <circle cx="60" cy="50" r="14" fill={dot} stroke="#111" strokeWidth="4"/>
      <line x1="74" y1="50" x2="160" y2="50" stroke="#111" strokeWidth="6" strokeLinecap="round" strokeDasharray="2,10"/>
      <circle cx="160" cy="50" r="6" fill="#111"/>
    </svg>
  ),

  // Smiley sticker mascot — Play's character
  Mascot: ({ color = "var(--tang)", size = 160 }) => (
    <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="grainM" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.5 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      <g>
        <circle cx="80" cy="80" r="70" fill={color} stroke="#111" strokeWidth="6"/>
        <circle cx="80" cy="80" r="70" fill="black" opacity="0.3" filter="url(#grainM)"/>
        {/* eyes */}
        <ellipse cx="58" cy="68" rx="6" ry="9" fill="#111"/>
        <ellipse cx="102" cy="68" rx="6" ry="9" fill="#111"/>
        {/* mouth */}
        <path d="M50 92 Q80 120 110 92" fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round"/>
        {/* tongue */}
        <path d="M76 108 Q82 118 88 108" fill="var(--bubble)" stroke="#111" strokeWidth="4" strokeLinejoin="round"/>
      </g>
      {/* sparkle */}
      <g transform="translate(140, 24)">
        <path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="var(--sun)" stroke="#111" strokeWidth="3"/>
      </g>
    </svg>
  ),

  // Squiggle underline (for emphasis)
  Squiggle: ({ color = "var(--ink)", width = 200, height = 14 }) => (
    <svg width={width} height={height} viewBox="0 0 200 14" preserveAspectRatio="none">
      <path d="M2 8 Q 15 -2 30 8 T 60 8 T 90 8 T 120 8 T 150 8 T 180 8 T 198 8" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),

  // Star burst (small accent)
  Burst: ({ color = "var(--sun)", size = 60 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ overflow: 'visible' }}>
      <path d="M30 2 L34 22 L54 18 L40 32 L58 42 L36 40 L34 58 L28 42 L10 50 L20 34 L2 28 L22 26 L18 8 L28 20 Z"
            fill={color} stroke="#111" strokeWidth="3" strokeLinejoin="round"/>
    </svg>
  ),
};

window.Shape = Shape;
