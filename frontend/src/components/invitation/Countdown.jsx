import { useEffect, useState } from 'react';
import { parseEventDate } from '../../utils/eventDate';

function getTimeLeft(targetDate) {
  const target = parseEventDate(targetDate);
  if (!target) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const now = new Date();
  if (target.getTime() <= now.getTime()) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  let tempDate = new Date(now.getFullYear(), now.getMonth() + months, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
  
  if (tempDate.getTime() > target.getTime()) {
    months--;
    tempDate = new Date(now.getFullYear(), now.getMonth() + months, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
  }

  const diffMs = target.getTime() - tempDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return {
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
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
    { value: time.months, label: 'mos' },
    { value: time.days, label: 'days' },
    { value: time.hours, label: 'hrs' },
    { value: time.minutes, label: 'mins' },
    { value: time.seconds, label: 'secs' },
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
