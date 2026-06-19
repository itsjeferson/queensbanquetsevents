import { useEffect, useState } from 'react';
import { parseEventDate } from '../../utils/eventDate';

function getTimeLeft(targetDate) {
  const parsed = parseEventDate(targetDate);
  if (!parsed) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = parsed.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ eventDate }) {
  const [time, setTime] = useState(() => getTimeLeft(eventDate));

  useEffect(() => {
    setTime(getTimeLeft(eventDate));
    const timer = setInterval(() => setTime(getTimeLeft(eventDate)), 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  const items = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Minutes' },
    { value: time.seconds, label: 'Seconds' },
  ];

  return (
    <div className="inv-countdown">
      {items.map((item) => (
        <div key={item.label} className="inv-countdown-item">
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
