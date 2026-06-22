import {
  buildContentRevealEditorRows,
  getContentRevealSectionLabel,
  moveContentRevealSection,
  setContentRevealVisibility,
} from '../../utils/contentReveal';

export default function ContentRevealOrderEditor({
  order = [],
  hideRsvp = false,
  onChange,
}) {
  const options = { hideRsvp };
  const rows = buildContentRevealEditorRows(order, options);
  const visibleRows = rows.filter((row) => row.visible);

  const setVisibility = (sectionId, visible) => {
    onChange(setContentRevealVisibility(order, sectionId, visible, options));
  };

  const moveSection = (sectionId, direction) => {
    onChange(moveContentRevealSection(order, sectionId, direction, options));
  };

  return (
    <div className="inv-reveal-order">
      <p className="form-help">
        Choose which sections guests see and in what order. The first visible section appears immediately when they open the invitation; the rest fade in as they scroll.
      </p>
      <ol className="inv-reveal-order-list">
        {rows.map((row) => {
          const visibleIndex = visibleRows.findIndex((item) => item.id === row.id);

          return (
            <li
              key={row.id}
              className={`inv-reveal-order-item${row.visible ? '' : ' inv-reveal-order-item--hidden'}`}
            >
              <span className="inv-reveal-order-index">{row.visible ? visibleIndex + 1 : '—'}</span>
              <div className="inv-reveal-order-copy">
                <span className="inv-reveal-order-label">{getContentRevealSectionLabel(row.id)}</span>
                {row.shownFirst && (
                  <span className="inv-reveal-order-badge">Shown first to guests</span>
                )}
              </div>
              <div className="inv-reveal-order-controls">
                <div className="inv-reveal-visibility-toggle" role="group" aria-label={`Visibility for ${getContentRevealSectionLabel(row.id)}`}>
                  <button
                    type="button"
                    className={`inv-reveal-visibility-btn${row.visible ? ' inv-reveal-visibility-btn--active' : ''}`}
                    onClick={() => setVisibility(row.id, true)}
                    aria-pressed={row.visible}
                  >
                    Show Content
                  </button>
                  <button
                    type="button"
                    className={`inv-reveal-visibility-btn${!row.visible ? ' inv-reveal-visibility-btn--active' : ''}`}
                    onClick={() => setVisibility(row.id, false)}
                    aria-pressed={!row.visible}
                    disabled={row.visible && visibleRows.length === 1}
                  >
                    Don&apos;t Show
                  </button>
                </div>
                {row.visible && (
                  <span className="inv-reveal-order-actions">
                    <button
                      type="button"
                      className="action-btn"
                      onClick={() => moveSection(row.id, -1)}
                      disabled={visibleIndex === 0}
                      aria-label={`Move ${getContentRevealSectionLabel(row.id)} up`}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="action-btn"
                      disabled={visibleIndex === visibleRows.length - 1}
                      onClick={() => moveSection(row.id, 1)}
                      aria-label={`Move ${getContentRevealSectionLabel(row.id)} down`}
                    >
                      Down
                    </button>
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="form-help inv-reveal-order-note">
        {visibleRows.length} section{visibleRows.length === 1 ? '' : 's'} visible to guests.
      </p>
    </div>
  );
}
