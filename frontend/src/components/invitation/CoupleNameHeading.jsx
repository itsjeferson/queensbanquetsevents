import { Fragment } from 'react';
import { splitCoupleDisplayName } from '../../utils/invitationContent';

export default function CoupleNameHeading({
  name,
  className = '',
  as: Tag = 'h1',
}) {
  const parts = splitCoupleDisplayName(name);
  if (!parts.length) return null;

  if (parts.length === 1) {
    return <Tag className={className}>{parts[0]}</Tag>;
  }

  return (
    <Tag className={className}>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {index > 0 && (
            <>
              {' '}
              <span className="inv-couple-amp" aria-hidden="true">
                &amp;
              </span>
              {' '}
            </>
          )}
          {part}
        </Fragment>
      ))}
    </Tag>
  );
}
