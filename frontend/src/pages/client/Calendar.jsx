import EventTimeline from '../../components/client/EventTimeline/EventTimeline';

const timeline = [
  { title: 'Venue Visit', date: 'Dec 10, 2024 — 2:00 PM' },
  { title: 'Menu Tasting', date: 'Dec 15, 2024 — 11:00 AM' },
  { title: 'Final Briefing', date: 'Dec 26, 2024 — 10:00 AM' },
  { title: 'Wedding Day 🎉', date: 'Dec 28, 2024' },
];

export default function ClientCalendar() {
  return (
    <>
      <div className="dash-header">
        <h1>Event Calendar</h1>
        <p>View your upcoming milestones and event dates.</p>
      </div>
      <div className="card-widget">
        <h3>Upcoming Milestones</h3>
        <EventTimeline items={timeline} />
      </div>
    </>
  );
}
