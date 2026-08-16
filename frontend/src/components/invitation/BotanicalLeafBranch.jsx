export default function BotanicalLeafBranch({ className = '' }) {
  return (
    <div className={`inv-botanical-corner ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 260 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inv-botanical-svg"
      >
        <defs>
          <linearGradient id="euc-stem-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4A6B53" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2E4A35" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="euc-leaf-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7E9F85" stopOpacity="0.88" />
            <stop offset="60%" stopColor="#55755E" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#3C5C45" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="euc-leaf-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9AB6A1" stopOpacity="0.82" />
            <stop offset="70%" stopColor="#6C8C74" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#486851" stopOpacity="0.94" />
          </linearGradient>
          <linearGradient id="euc-leaf-soft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B3CBB9" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#7B9983" stopOpacity="0.85" />
          </linearGradient>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.08" />
          </filter>
        </defs>

        <g filter="url(#soft-shadow)">
          {/* Main Arcing Stem */}
          <path
            d="M 260 0 C 210 25 150 45 90 95 C 60 120 30 155 0 180"
            stroke="url(#euc-stem-grad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Secondary Sub-stem */}
          <path
            d="M 180 35 C 150 65 120 115 105 145"
            stroke="url(#euc-stem-grad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          {/* Eucalyptus Leaf Pairs Along Main Stem */}
          {/* Leaf Pair 1 (Top Right) */}
          <ellipse cx="235" cy="18" rx="22" ry="12" transform="rotate(-25 235 18)" fill="url(#euc-leaf-2)" />
          <ellipse cx="215" cy="36" rx="20" ry="11" transform="rotate(35 215 36)" fill="url(#euc-leaf-1)" />

          {/* Leaf Pair 2 */}
          <ellipse cx="190" cy="32" rx="24" ry="13" transform="rotate(-38 190 32)" fill="url(#euc-leaf-1)" />
          <ellipse cx="168" cy="58" rx="22" ry="12" transform="rotate(28 168 58)" fill="url(#euc-leaf-2)" />

          {/* Leaf Pair 3 */}
          <ellipse cx="145" cy="58" rx="25" ry="14" transform="rotate(-48 145 58)" fill="url(#euc-leaf-soft)" opacity="0.9" />
          <ellipse cx="125" cy="88" rx="24" ry="13" transform="rotate(22 125 88)" fill="url(#euc-leaf-1)" />

          {/* Leaf Pair 4 */}
          <ellipse cx="102" cy="92" rx="23" ry="12" transform="rotate(-30 102 92)" fill="url(#euc-leaf-2)" />
          <ellipse cx="80" cy="120" rx="21" ry="11" transform="rotate(30 80 120)" fill="url(#euc-leaf-soft)" />

          {/* Leaf Pair 5 */}
          <ellipse cx="58" cy="128" rx="20" ry="10" transform="rotate(-40 58 128)" fill="url(#euc-leaf-1)" />
          <ellipse cx="38" cy="152" rx="18" ry="9.5" transform="rotate(18 38 152)" fill="url(#euc-leaf-2)" />

          {/* Tip Leaf */}
          <ellipse cx="12" cy="172" rx="15" ry="8" transform="rotate(-32 12 172)" fill="url(#euc-leaf-soft)" />

          {/* Branching Leaves */}
          <ellipse cx="140" cy="115" rx="18" ry="9" transform="rotate(-15 140 115)" fill="url(#euc-leaf-2)" opacity="0.85" />
          <ellipse cx="112" cy="142" rx="16" ry="8.5" transform="rotate(42 112 142)" fill="url(#euc-leaf-1)" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}
