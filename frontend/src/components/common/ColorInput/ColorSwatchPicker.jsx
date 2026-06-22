import ColorInput from './ColorInput';

export default function ColorSwatchPicker({
  colors = [],
  onChange,
  labelPrefix = 'Color',
  labels = null,
  fallback = '#F4EEE7',
  count = 4,
}) {
  const swatches = colors.length >= count
    ? colors.slice(0, count)
    : [...colors, ...Array(count - colors.length).fill(fallback)].slice(0, count);

  const gridClass = count === 6 ? 'color-swatch-grid color-swatch-grid-6' : 'color-swatch-grid';

  return (
    <div className={gridClass}>
      {swatches.map((color, index) => (
        <ColorInput
          key={index}
          compact
          label={labels?.[index] || `${labelPrefix} ${index + 1}`}
          value={color || fallback}
          fallback={fallback}
          onChange={(next) => {
            const updated = [...swatches];
            updated[index] = next;
            onChange(updated);
          }}
        />
      ))}
    </div>
  );
}
