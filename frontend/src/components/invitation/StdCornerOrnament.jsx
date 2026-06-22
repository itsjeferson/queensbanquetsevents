import { useId } from 'react';

function Leaf({ cx, cy, rotate, gradId }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx="4.8"
      ry="10.5"
      transform={`rotate(${rotate} ${cx} ${cy})`}
      fill={`url(#${gradId})`}
    />
  );
}

export default function StdCornerOrnament({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const bloomGrad = `std-bloom-${uid}`;
  const leafGrad = `std-leaf-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bloomGrad} x1="0.15" y1="0.05" x2="0.85" y2="0.95">
          <stop offset="0%" stopColor="var(--inv-floral-bloom, var(--inv-primary))" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--inv-floral-bloom-soft, var(--inv-primary))" stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id={leafGrad} x1="0" y1="0.2" x2="1" y2="0.9">
          <stop offset="0%" stopColor="var(--inv-floral-leaf, var(--inv-primary-dark))" stopOpacity="0.92" />
          <stop offset="100%" stopColor="var(--inv-floral-leaf-soft, var(--inv-primary-dark))" stopOpacity="0.78" />
        </linearGradient>
      </defs>

      <Leaf cx="24" cy="34" rotate={-48} gradId={leafGrad} />
      <Leaf cx="20" cy="46" rotate={-62} gradId={leafGrad} />
      <Leaf cx="26" cy="58" rotate={-28} gradId={leafGrad} />
      <Leaf cx="36" cy="68" rotate={-12} gradId={leafGrad} />
      <Leaf cx="48" cy="76" rotate={8} gradId={leafGrad} />
      <Leaf cx="30" cy="42" rotate={-18} gradId={leafGrad} />
      <Leaf cx="34" cy="54" rotate={6} gradId={leafGrad} />
      <Leaf cx="44" cy="64" rotate={22} gradId={leafGrad} />

      <ellipse
        cx="96"
        cy="24"
        rx="16"
        ry="13"
        transform="rotate(-18 96 24)"
        fill={`url(#${bloomGrad})`}
      />
      <ellipse
        cx="108"
        cy="34"
        rx="13"
        ry="10"
        transform="rotate(14 108 34)"
        fill={`url(#${bloomGrad})`}
        opacity="0.88"
      />
      <ellipse
        cx="88"
        cy="36"
        rx="11"
        ry="9"
        transform="rotate(-32 88 36)"
        fill={`url(#${bloomGrad})`}
        opacity="0.82"
      />
      <ellipse
        cx="102"
        cy="20"
        rx="9"
        ry="7"
        transform="rotate(8 102 20)"
        fill={`url(#${bloomGrad})`}
        opacity="0.76"
      />
      <circle
        cx="98"
        cy="28"
        r="4.5"
        fill="var(--inv-floral-leaf, var(--inv-primary-dark))"
        opacity="0.35"
      />
    </svg>
  );
}
