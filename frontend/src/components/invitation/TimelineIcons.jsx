const iconProps = {
  width: 42,
  height: 42,
  viewBox: '0 0 42 42',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function TimelineIcon({ id }) {
  switch (id) {
    case 'ceremony':
      return (
        <svg {...iconProps}>
          <path d="M9 34V21l12-7 12 7v13" />
          <path d="M15 34v-6h12v6" />
          <path d="M21 14V7M17 10h8" />
        </svg>
      );
    case 'pictorial':
      return (
        <svg {...iconProps}>
          <rect x="9" y="13" width="24" height="16" rx="2.5" />
          <path d="M15 13l2-4h8l2 4" />
          <circle cx="21" cy="21" r="5" />
        </svg>
      );
    case 'cocktail':
      return (
        <svg {...iconProps}>
          <path d="M12 12h18l-6 10v8" />
          <path d="M18 30h6" />
          <path d="M15 12c0 4 2.5 7 6 7s6-3 6-7" />
          <circle cx="28" cy="16" r="2" />
        </svg>
      );
    case 'program':
      return (
        <svg {...iconProps}>
          <rect x="16.5" y="6" width="9" height="15" rx="4.5" />
          <path d="M12 20a9 9 0 0 0 18 0" />
          <path d="M21 29v5M16 34h10" />
        </svg>
      );
    case 'dinner':
      return (
        <svg {...iconProps}>
          <path d="M12 5v15M16 5v15" />
          <path d="M10 6a4 4 0 0 1 8 0" />
          <path d="M12 20v10M16 20v10" />
          <path d="M10 30h8" />
          <path d="M30 5v14a5 5 0 0 1-9 1V5" />
          <path d="M25.5 20v10M21 30h9" />
        </svg>
      );
    case 'sde':
      return (
        <svg {...iconProps}>
          <circle cx="21" cy="21" r="9" />
          <path d="M21 12v18M12 21h18" />
          <path d="M15 15l12 12M27 15L15 27" />
          <path d="M33 9l1.2 2.3 2.3 1.2-2.3 1.2L33 16l-1.2-2.3-2.3-1.2 2.3-1.2L33 9z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="21" cy="21" r="8" />
        </svg>
      );
  }
}
