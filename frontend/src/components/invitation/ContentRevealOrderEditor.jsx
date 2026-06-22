import {
  getAvailableRevealSections,
  getContentRevealSectionLabel,
  normalizeContentRevealOrder,
} from '../../utils/contentReveal';

export default function ContentRevealOrderEditor({
  order = [],
  hideRsvp = false,
  onChange,
}) {
  const normalizedOrder = normalizeContentRevealOrder(order, { hideRsvp });

  const moveSection = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= normalizedOrder.length) return;

    const updated = [...normalizedOrder];
    const [item] = updated.splice(index, 1);
    updated.splice(nextIndex, 0, item);
    onChange(updated);
  };

  return (
    <div className="inv-reveal-order">
      <p className="form-help">
        Choose the order sections appear for guests. The first item shows when they open the invitation, then each section unlocks consecutively until the full invitation is shown.
      </p>
      <ol className="inv-reveal-order-list">
        {normalizedOrder.map((sectionId, index) => (
          <li key={sectionId} className="inv-reveal-order-item">
            <span className="inv-reveal-order-index">{index + 1}</span>
            <span className="inv-reveal-order-label">{getContentRevealSectionLabel(sectionId)}</span>
            <span className="inv-reveal-order-actions">
              <button
                type="button"
                className="action-btn"
                onClick={() => moveSection(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${getContentRevealSectionLabel(sectionId)} up`}
              >
                Up
              </button>
              <button
                type="button"
                className="action-btn"
                disabled={index === normalizedOrder.length - 1}
                onClick={() => moveSection(index, 1)}
                aria-label={`Move ${getContentRevealSectionLabel(sectionId)} down`}
              >
                Down
              </button>
            </span>
          </li>
        ))}
      </ol>
      <p className="form-help inv-reveal-order-note">
        Available sections: {getAvailableRevealSections({ hideRsvp }).map((section) => section.label).join(', ')}.
      </p>
    </div>
  );
}
