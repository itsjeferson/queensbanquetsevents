export default function AttireCoupleIllustration({ className = '' }) {
  return (
    <div className={`inv-attire-couple-art ${className}`}>
      <svg
        viewBox="0 0 220 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inv-attire-couple-svg"
      >
        <defs>
          {/* Lady Gown Gradient */}
          <linearGradient id="gown-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2C9CD" />
            <stop offset="60%" stopColor="#D4B2B8" />
            <stop offset="100%" stopColor="#C49FA6" />
          </linearGradient>
          {/* Gown Fold Shadow */}
          <linearGradient id="gown-fold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B38D94" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4B2B8" stopOpacity="0.1" />
          </linearGradient>
          {/* Barong Texture/Tone */}
          <linearGradient id="barong-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBF7EE" />
            <stop offset="100%" stopColor="#EDE5D4" />
          </linearGradient>
          {/* Pants */}
          <linearGradient id="pants-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#303338" />
            <stop offset="100%" stopColor="#1E2024" />
          </linearGradient>
          {/* Skin Tone */}
          <linearGradient id="skin-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F9DFD2" />
            <stop offset="100%" stopColor="#ECC2B0" />
          </linearGradient>
          {/* Hair Tone */}
          <linearGradient id="hair-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4A3B32" />
            <stop offset="100%" stopColor="#2B211B" />
          </linearGradient>
          <filter id="figure-shadow" x="-10%" y="-5%" width="120%" height="115%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.08" />
          </filter>
        </defs>

        <g filter="url(#figure-shadow)">
          {/* ===================== LADY (LEFT) ===================== */}
          <g id="lady">
            {/* Hair back */}
            <path d="M 62 70 C 50 85 48 115 52 140 C 56 125 60 95 64 78 Z" fill="url(#hair-grad)" />

            {/* Lady Head & Face */}
            <ellipse cx="68" cy="62" rx="10.5" ry="13.5" fill="url(#skin-grad)" />
            {/* Lady Hair Front/Bun */}
            <path d="M 58 58 C 58 48 76 46 80 56 C 81 64 78 70 76 72 C 70 70 65 65 62 60 Z" fill="url(#hair-grad)" />
            <ellipse cx="66" cy="50" rx="9" ry="6.5" fill="url(#hair-grad)" />

            {/* Neck & Shoulders */}
            <path d="M 65 74 L 71 74 L 73 85 L 63 85 Z" fill="url(#skin-grad)" />
            {/* Bare Left Shoulder (One-shoulder Gown) */}
            <path d="M 73 84 C 78 86 86 92 88 100 L 78 102 Z" fill="url(#skin-grad)" />
            {/* Lady Left Arm */}
            <path d="M 88 100 C 90 120 89 140 84 165 C 82 165 80 162 79 155 C 82 135 83 118 80 102 Z" fill="url(#skin-grad)" />

            {/* Lady Evening Gown - Draped Bodice */}
            <path
              d="M 55 86 C 58 84 75 92 78 102 C 72 118 68 126 56 128 C 50 124 50 96 55 86 Z"
              fill="url(#gown-grad)"
            />
            {/* One-shoulder sash strap */}
            <path
              d="M 55 86 C 62 82 66 94 68 108 C 62 108 58 98 55 86 Z"
              fill="#DDB6BD"
            />

            {/* Lady Long Gown Skirt with Side Slit & Folds */}
            <path
              d="M 56 128 C 68 126 73 130 76 138 C 82 175 92 230 96 280 C 78 284 62 284 42 280 C 44 235 48 170 56 128 Z"
              fill="url(#gown-grad)"
            />
            {/* Gown Slit revealing leg */}
            <path d="M 68 185 C 72 205 74 240 76 270 L 71 270 C 69 240 67 205 65 185 Z" fill="url(#skin-grad)" />
            <path d="M 71 270 L 76 270 L 75 284 L 70 284 Z" fill="url(#skin-grad)" />
            {/* Gown elegant vertical pleats */}
            <path d="M 58 132 C 55 175 50 230 48 278" stroke="url(#gown-fold)" strokeWidth="3" />
            <path d="M 65 136 C 64 175 62 225 60 279" stroke="url(#gown-fold)" strokeWidth="2.5" />
            <path d="M 78 142 C 84 185 88 235 91 279" stroke="url(#gown-fold)" strokeWidth="3" />

            {/* Heels */}
            <path d="M 70 284 L 75 284 L 76 290 L 69 290 Z" fill="#B08D94" />
          </g>

          {/* ===================== GENTLEMAN (RIGHT) ===================== */}
          <g id="gentleman">
            {/* Head & Face */}
            <ellipse cx="145" cy="58" rx="10" ry="12.5" fill="url(#skin-grad)" />
            {/* Hair */}
            <path d="M 135 54 C 135 44 153 43 156 52 C 157 58 155 62 153 64 C 148 62 143 58 138 56 Z" fill="url(#hair-grad)" />

            {/* Neck */}
            <path d="M 142 69 L 148 69 L 149 78 L 141 78 Z" fill="url(#skin-grad)" />

            {/* Barong Tagalog (Torso & Sleeves) */}
            <path
              d="M 128 78 L 162 78 L 168 152 L 122 152 Z"
              fill="url(#barong-grad)"
              stroke="#D8CCB5"
              strokeWidth="0.8"
            />
            {/* Collar */}
            <path d="M 139 77 L 145 83 L 151 77 Z" fill="#EDE4D0" stroke="#C9BC9F" strokeWidth="0.8" />

            {/* Embroidered Pechera (Center Chest Motif) */}
            <rect x="140" y="84" width="10" height="42" fill="#F4EFE3" stroke="#D1C3A5" strokeWidth="0.8" rx="1" />
            <line x1="145" y1="84" x2="145" y2="126" stroke="#B8A783" strokeWidth="0.6" strokeDasharray="1 2" />
            <line x1="142" y1="90" x2="148" y2="90" stroke="#B8A783" strokeWidth="0.6" />
            <line x1="142" y1="98" x2="148" y2="98" stroke="#B8A783" strokeWidth="0.6" />
            <line x1="142" y1="106" x2="148" y2="106" stroke="#B8A783" strokeWidth="0.6" />
            <line x1="142" y1="114" x2="148" y2="114" stroke="#B8A783" strokeWidth="0.6" />

            {/* Sleeves */}
            <path d="M 128 78 L 118 132 L 128 134 L 134 92 Z" fill="url(#barong-grad)" stroke="#D8CCB5" strokeWidth="0.8" />
            <path d="M 162 78 L 172 132 L 162 134 L 156 92 Z" fill="url(#barong-grad)" stroke="#D8CCB5" strokeWidth="0.8" />
            {/* Hands */}
            <ellipse cx="122" cy="138" rx="4.5" ry="6" fill="url(#skin-grad)" />
            <ellipse cx="168" cy="138" rx="4.5" ry="6" fill="url(#skin-grad)" />

            {/* Black Slacks / Trousers */}
            <path
              d="M 126 150 L 164 150 L 167 278 L 148 278 L 145 178 L 142 178 L 139 278 L 123 278 Z"
              fill="url(#pants-grad)"
            />
            {/* Pant Crease Lines */}
            <line x1="131" y1="162" x2="131" y2="274" stroke="#484C54" strokeWidth="1" />
            <line x1="158" y1="162" x2="158" y2="274" stroke="#484C54" strokeWidth="1" />

            {/* Formal Leather Shoes */}
            <path d="M 120 278 L 137 278 C 137 286 118 288 118 284 Z" fill="#0D0E10" />
            <path d="M 152 278 L 169 278 C 169 286 150 288 150 284 Z" fill="#0D0E10" />
          </g>
        </g>
      </svg>
    </div>
  );
}
