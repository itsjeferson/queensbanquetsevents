function normalizeNames(value) {
  if (Array.isArray(value)) return value.length ? value : [''];
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [''];
}

export default function EntourageNameListEditor({ label, names, onChange }) {
  const items = normalizeNames(names);

  const updateName = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const addName = () => onChange([...items, '']);

  const removeName = (index) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next.length ? next : ['']);
  };

  return (
    <div className="form-group entourage-name-list">
      <label>{label}</label>
      {items.map((name, index) => (
        <div key={index} className="entourage-name-row">
          <input
            value={name}
            onChange={(e) => updateName(index, e.target.value)}
            placeholder="Full name"
          />
          <button
            type="button"
            className="action-btn entourage-name-remove"
            onClick={() => removeName(index)}
            aria-label={`Remove ${label} ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={addName}>
        + Add Name
      </button>
    </div>
  );
}

export function cleanNameList(value) {
  return normalizeNames(value).map((name) => name.trim()).filter(Boolean);
}
