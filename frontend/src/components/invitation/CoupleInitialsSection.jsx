import { getCoupleInitials } from '../../utils/invitationContent';

export default function CoupleInitialsSection({ event, invitation }) {
  const initials = getCoupleInitials(event, invitation);
  if (!initials) return null;

  return (
    <section className="inv-initials-section">
      <div className="inv-initials-ring">
        <span>{initials}</span>
      </div>
    </section>
  );
}
