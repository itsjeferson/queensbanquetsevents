import { useEffect, useState } from 'react';
import { normalizeColorToHex, parseColorInput } from '../../../utils/colorInput';

export default function ColorInput({
  label,
  value,
  onChange,
  fallback = '#F4EEE7',
  placeholder = '#B47B36 or rgb(180, 123, 54)',
  compact = false,
}) {
  const normalized = normalizeColorToHex(value, fallback);
  const [text, setText] = useState(value || normalized);

  useEffect(() => {
    setText(value || normalized);
  }, [value, normalized]);

  const applyText = (raw) => {
    const parsed = parseColorInput(raw);
    if (parsed) {
      onChange(parsed);
      setText(parsed);
      return;
    }
    setText(normalized);
  };

  return (
    <div className={`form-group color-input ${compact ? 'color-input-compact' : ''}`}>
      {label && <label>{label}</label>}
      <div className="color-input-row">
        <input
          type="color"
          value={normalized}
          aria-label={label ? `${label} picker` : 'Color picker'}
          onChange={(event) => {
            const next = event.target.value.toUpperCase();
            onChange(next);
            setText(next);
          }}
        />
        <input
          type="text"
          value={text}
          placeholder={placeholder}
          aria-label={label ? `${label} hex or rgb` : 'Color hex or rgb'}
          onChange={(event) => setText(event.target.value)}
          onBlur={() => applyText(text)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              applyText(text);
            }
          }}
        />
      </div>
    </div>
  );
}
