import { Fragment } from 'react';
import { normalizeWeddingProgram } from '../../utils/weddingTimeline';
import { TimelineIcon } from './TimelineIcons';

function TimelineRow({ items }) {
  return (
    <div className="inv-wedding-timeline-row">
      {items.map((item, index) => (
        <Fragment key={item.id}>
          {index > 0 && <div className="inv-wedding-timeline-connector" aria-hidden="true" />}
          <div className="inv-wedding-timeline-item">
            <p className="inv-wedding-timeline-title">{item.title}</p>
            <div className="inv-wedding-timeline-icon">
              <TimelineIcon id={item.id} />
            </div>
            <p className="inv-wedding-timeline-time">{item.time}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default function TimelineSection({ program, coupleName = '' }) {
  const items = normalizeWeddingProgram(program);
  if (!items.length) return null;

  const topRow = items.slice(0, 3);
  const bottomRow = items.slice(3, 6);

  return (
    <section className="inv-section inv-wedding-timeline-section" id="program">
      <p className="inv-script-title inv-script-title-small">Timeline</p>
      <div className="inv-divider" />

      <div className="inv-wedding-timeline">
        <TimelineRow items={topRow} />

        {coupleName && (
          <p className="inv-wedding-timeline-couple">{coupleName}</p>
        )}

        <TimelineRow items={bottomRow} />
      </div>
    </section>
  );
}
