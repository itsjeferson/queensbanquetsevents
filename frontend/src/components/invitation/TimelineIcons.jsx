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
          <path d="M21 8v26M14 14h14M17 14V11a4 4 0 0 1 8 0v3" />
          <path d="M12 34h18" />
          <path d="M21 8l-3 4h6l-3-4z" />
        </svg>
      );
    case 'pictorial':
      return (
        <svg {...iconProps}>
          <rect x="8" y="12" width="16" height="18" rx="1.5" />
          <rect x="18" y="8" width="16" height="18" rx="1.5" />
          <circle cx="16" cy="20" r="2.5" />
          <path d="M11 27l4-4 3 3 5-6 4 5" />
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
          <path d="M12 28c2-8 6-12 9-12s7 4 9 12" />
          <circle cx="15" cy="30" r="2.5" />
          <circle cx="27" cy="30" r="2.5" />
          <path d="M17.5 30h7" />
        </svg>
      );
    case 'dinner':
      return (
        <svg {...iconProps}>
          <circle cx="21" cy="21" r="10" />
          <path d="M21 11v20M11 21h20" />
          <path d="M14 14l14 14M28 14L14 28" />
        </svg>
      );
    case 'sde':
      return (
        <svg {...iconProps}>
          <rect x="10" y="13" width="22" height="16" rx="2" />
          <path d="M16 13l2-4h8l2 4" />
          <circle cx="21" cy="21" r="4" />
          <path d="M10 19h3M29 19h3" />
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
