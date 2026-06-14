import Calendar from '../../components/client/Calendar/Calendar';

const decemberDays = [
  ...Array(6).fill({ empty: true }),
  ...[1,2,3,4,5,6,7].map(n => ({ num: n })),
  { num: 8, booked: true },
  ...[9,10,11,12,13,14].map(n => ({ num: n })),
  { num: 15, booked: true },
  ...[16,17,18,19,20].map(n => ({ num: n })),
  { num: 21, today: true },
  ...[22,23,24,25,26,27].map(n => ({ num: n })),
  { num: 28, booked: true },
  { num: 29 }, { num: 30 }, { num: 31 },
];

const events = [
  { title: 'Wedding — Santos', details: 'Dec 28 • Signature Package • 120 guests', coordinator: 'Isabella Santos', color: 'var(--gold)' },
  { title: 'Corporate Gala — Apex', details: 'Dec 15 • Essential Package • 80 guests', coordinator: 'Miguel Cruz', color: '#DC3545' },
  { title: 'Birthday — Private', details: 'Dec 8 • Essential Package • 40 guests', coordinator: 'Clara Reyes', color: '#0050A0' },
];

export default function AdminCalendar() {
  return (
    <>
      <div className="dash-header">
        <h1>Event Calendar</h1>
        <p>View scheduled events and manage availability.</p>
      </div>
      <Calendar month="December 2024" days={decemberDays} events={events} />
    </>
  );
}
