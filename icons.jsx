// Play — shared icon set (original, playful, not branded clones)
// All icons take size + color as props.

const Icon = {
  Send: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 21 4l-7 17-3-7-8-2.5Z"/>
    </svg>
  ),
  Spark: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2"/>
    </svg>
  ),
  Rocket: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4c4 0 6 2 6 6 0 5-7 10-7 10s-7-5-7-10c0-4 2-6 6-6"/>
      <circle cx="12" cy="9" r="2"/>
      <path d="M9 17c-2 1-3 3-3 5 2 0 4-1 5-3M15 17c2 1 3 3 3 5-2 0-4-1-5-3"/>
    </svg>
  ),
  Sprout: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V9"/>
      <path d="M12 9c0-3-3-5-6-5 0 4 3 6 6 5Z"/>
      <path d="M12 11c0-3 3-5 6-5 0 4-3 6-6 5Z"/>
    </svg>
  ),
  Tag: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12 12 3h8v8l-9 9-8-8Z"/>
      <circle cx="15.5" cy="8.5" r="1.4"/>
    </svg>
  ),
  Bolt: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>
    </svg>
  ),
  Plus: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M12 4v16M4 12h16"/>
    </svg>
  ),
  Copy: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="12" height="12" rx="3"/>
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>
    </svg>
  ),
  Download: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v12M6 12l6 6 6-6"/>
      <path d="M4 20h16"/>
    </svg>
  ),
  Edit: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h4l11-11-4-4L4 16v4Z"/>
      <path d="M14 6l4 4"/>
    </svg>
  ),
  Refresh: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 11A8 8 0 0 0 6.3 6.3L4 9"/>
      <path d="M4 4v5h5"/>
      <path d="M4 13a8 8 0 0 0 13.7 4.7L20 15"/>
      <path d="M20 20v-5h-5"/>
    </svg>
  ),
  Clock: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  ),
  Menu: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16"/>
    </svg>
  ),
  Heart: ({ size = 18, color = "currentColor", fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>
    </svg>
  ),
  Chat: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 4v-4H6a2 2 0 0 1-2-2V6Z"/>
    </svg>
  ),
  Share: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="2.5"/>
      <circle cx="18" cy="6" r="2.5"/>
      <circle cx="18" cy="18" r="2.5"/>
      <path d="M8 11l8-4M8 13l8 4"/>
    </svg>
  ),
  Play: ({ size = 18, color = "currentColor", fill = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinejoin="round">
      <path d="M7 4.5v15l13-7.5-13-7.5Z"/>
    </svg>
  ),
  Music: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V6l11-2v12"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="17" cy="16" r="3"/>
    </svg>
  ),
  Volume: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10v4h4l5 4V6l-5 4H4Z"/>
      <path d="M17 8a5 5 0 0 1 0 8"/>
    </svg>
  ),
  Camera: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="3"/>
      <circle cx="12" cy="13.5" r="3.5"/>
      <path d="M8 7l2-3h4l2 3"/>
    </svg>
  ),
  Comment: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.5 8.5 0 1 1-3.7-7"/>
      <path d="M21 4v5h-5"/>
    </svg>
  ),
  Sparkle: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z"/>
    </svg>
  ),
  Close: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18"/>
    </svg>
  ),
};

window.Icon = Icon;
