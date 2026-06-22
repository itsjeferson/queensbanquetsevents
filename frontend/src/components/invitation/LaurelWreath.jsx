export default function LaurelWreath({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        {/* Left branch — wider arc */}
        <path d="M240 448 C168 426 112 372 88 302 C64 232 82 148 138 78 C162 48 188 28 214 18" />
        <path d="M138 78 C124 104 114 132 108 162" />
        <path d="M108 162 C102 192 104 222 114 252" />
        <path d="M114 252 C128 284 154 310 186 330" />
        {/* Right branch */}
        <path d="M240 448 C312 426 368 372 392 302 C416 232 398 148 342 78 C318 48 292 28 266 18" />
        <path d="M342 78 C356 104 366 132 372 162" />
        <path d="M372 162 C378 192 376 222 366 252" />
        <path d="M366 252 C352 284 326 310 294 330" />
        {/* Bottom tie */}
        <path d="M206 412 C218 432 228 440 240 446 C252 440 262 432 274 412" />
        <path d="M222 388 C230 400 236 404 240 406 C244 404 250 400 258 388" />
        {/* Left leaves — pushed outward */}
        <ellipse cx="168" cy="62" rx="5.5" ry="10" transform="rotate(-42 168 62)" />
        <ellipse cx="138" cy="98" rx="5.5" ry="10" transform="rotate(-32 138 98)" />
        <ellipse cx="118" cy="138" rx="5.5" ry="10" transform="rotate(-22 118 138)" />
        <ellipse cx="106" cy="180" rx="5.5" ry="10" transform="rotate(-14 106 180)" />
        <ellipse cx="108" cy="222" rx="5.5" ry="10" transform="rotate(-6 108 222)" />
        <ellipse cx="126" cy="262" rx="5.5" ry="10" transform="rotate(4 126 262)" />
        <ellipse cx="156" cy="298" rx="5.5" ry="10" transform="rotate(14 156 298)" />
        <ellipse cx="188" cy="328" rx="5.5" ry="10" transform="rotate(22 188 328)" />
        {/* Right leaves */}
        <ellipse cx="312" cy="62" rx="5.5" ry="10" transform="rotate(42 312 62)" />
        <ellipse cx="342" cy="98" rx="5.5" ry="10" transform="rotate(32 342 98)" />
        <ellipse cx="362" cy="138" rx="5.5" ry="10" transform="rotate(22 362 138)" />
        <ellipse cx="374" cy="180" rx="5.5" ry="10" transform="rotate(14 374 180)" />
        <ellipse cx="372" cy="222" rx="5.5" ry="10" transform="rotate(6 372 222)" />
        <ellipse cx="354" cy="262" rx="5.5" ry="10" transform="rotate(-4 354 262)" />
        <ellipse cx="324" cy="298" rx="5.5" ry="10" transform="rotate(-14 324 298)" />
        <ellipse cx="292" cy="328" rx="5.5" ry="10" transform="rotate(-22 292 328)" />
      </g>
    </svg>
  );
}
