export function ChurchSketch({ className = '' }) {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="200" height="140" fill="#FAF7F2" rx="4" />
      <g stroke="#5A5751" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
        {/* Church Dome & Cross */}
        <line x1="82" y1="12" x2="82" y2="24" strokeWidth="1.4" />
        <line x1="77" y1="16" x2="87" y2="16" strokeWidth="1.4" />
        <path d="M 70 38 C 70 24 94 24 94 38 Z" fill="#EAE5DC" />
        <rect x="73" y="38" width="18" height="14" fill="#F4EFE6" />
        <line x1="75" y1="44" x2="75" y2="50" />
        <line x1="82" y1="44" x2="82" y2="50" />
        <line x1="89" y1="44" x2="89" y2="50" />

        {/* Church Main Body */}
        <polygon points="50,52 114,52 114,105 50,105" fill="#F5F2EB" />
        {/* Roof line */}
        <polygon points="46,52 82,34 118,52" fill="#E3DDD2" />
        {/* Rose window */}
        <circle cx="82" cy="64" r="9" />
        <circle cx="82" cy="64" r="5" />
        <line x1="82" y1="55" x2="82" y2="73" />
        <line x1="73" y1="64" x2="91" y2="64" />

        {/* Portico / Arch Entrance */}
        <path d="M 74 105 L 74 88 C 74 80 90 80 90 88 L 90 105 Z" fill="#E8E2D5" />
        <path d="M 77 105 L 77 90 C 77 84 87 84 87 90 L 87 105 Z" fill="#6B655B" />

        {/* Right Wing / Nave */}
        <polygon points="114,64 165,64 165,105 114,105" fill="#FAF6EE" />
        <polygon points="112,64 167,64 163,58 114,58" fill="#DDD6C9" />
        {/* Arched Windows */}
        <path d="M 122 92 L 122 75 C 122 70 130 70 130 75 L 130 92 Z" />
        <path d="M 136 92 L 136 75 C 136 70 144 70 144 75 L 144 92 Z" />
        <path d="M 150 92 L 150 75 C 150 70 158 70 158 75 L 158 92 Z" />

        {/* Left Side Wall */}
        <polygon points="25,72 50,64 50,105 25,105" fill="#ECE6DB" />
        <path d="M 32 94 L 32 80 C 32 76 42 76 42 80 L 42 94 Z" />

        {/* Ground and trees / foliage hatching */}
        <line x1="15" y1="105" x2="185" y2="105" strokeWidth="1.5" />
        <line x1="20" y1="110" x2="180" y2="110" strokeDasharray="3 4" />
        <line x1="30" y1="115" x2="170" y2="115" strokeDasharray="2 5" />
        {/* Shrubbery */}
        <path d="M 18 105 C 16 95 28 92 30 105 Z" fill="#D8E2D5" />
        <path d="M 160 105 C 162 90 178 92 180 105 Z" fill="#D8E2D5" />
      </g>
    </svg>
  );
}

export function ReceptionSketch({ className = '' }) {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="200" height="140" fill="#FAF7F2" rx="4" />
      <g stroke="#5A5751" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
        {/* Pavilion Villa / Pavilion Architecture */}
        <polygon points="40,55 160,55 160,102 40,102" fill="#F5F2EB" />
        {/* Overhanging Modern / Tuscan Roof */}
        <polygon points="30,55 170,55 162,45 38,45" fill="#E3DDD2" />
        <polygon points="70,45 130,45 125,36 75,36" fill="#DDD6C9" />

        {/* Grand Glass Doors / Veranda Windows */}
        <rect x="52" y="65" width="24" height="37" fill="#EAE4D8" />
        <line x1="64" y1="65" x2="64" y2="102" />
        <rect x="88" y="65" width="24" height="37" fill="#EAE4D8" />
        <line x1="100" y1="65" x2="100" y2="102" />
        <rect x="124" y="65" width="24" height="37" fill="#EAE4D8" />
        <line x1="136" y1="65" x2="136" y2="102" />

        {/* Veranda Columns */}
        <line x1="48" y1="55" x2="48" y2="102" strokeWidth="1.8" />
        <line x1="82" y1="55" x2="82" y2="102" strokeWidth="1.8" />
        <line x1="118" y1="55" x2="118" y2="102" strokeWidth="1.8" />
        <line x1="154" y1="55" x2="154" y2="102" strokeWidth="1.8" />

        {/* Fountain / Lawn in front */}
        <ellipse cx="100" cy="116" rx="28" ry="7" fill="#E8EFF0" />
        <ellipse cx="100" cy="114" rx="14" ry="4" fill="#D3E2E5" />
        <line x1="100" y1="108" x2="100" y2="114" />

        {/* Garden Trees & Palms */}
        <path d="M 22 102 C 14 78 36 75 38 102 Z" fill="#D6E0D2" />
        <path d="M 162 102 C 160 76 182 78 180 102 Z" fill="#D6E0D2" />

        <line x1="10" y1="102" x2="190" y2="102" strokeWidth="1.4" />
        <line x1="20" y1="124" x2="180" y2="124" strokeDasharray="3 4" />
      </g>
    </svg>
  );
}

export function MiniQrBadge({ mapUrl, label = 'Scan for Map', className = '' }) {
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    mapUrl || 'https://maps.google.com'
  )}&margin=2`;

  return (
    <a
      href={mapUrl || '#'}
      target="_blank"
      rel="noreferrer"
      className={`inv-venue-mini-qr ${className}`}
      title={label}
      aria-label={label}
    >
      <img src={qrSvgUrl} alt="QR Code" className="inv-venue-qr-img" />
    </a>
  );
}
