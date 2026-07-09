import React, { useMemo } from 'react';
import { parseEventDate } from '../../utils/eventDate';

export default function WeddingMonthCalendar({ eventDate }) {
  const parsedDate = useMemo(() => parseEventDate(eventDate), [eventDate]);

  const calendarData = useMemo(() => {
    const date = parsedDate || new Date(2027, 2, 23); // Default to March 23, 2027
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const targetDay = date.getDate();

    const monthNames = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    const monthName = monthNames[month];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    const numDays = lastDay.getDate();

    const days = [];
    // Pad initial days
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    // Add active days
    for (let d = 1; d <= numDays; d++) {
      days.push(d);
    }

    return {
      monthName,
      year,
      targetDay,
      days,
    };
  }, [parsedDate]);

  const { monthName, year, targetDay, days } = calendarData;
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="wedding-calendar-card">
      <div className="wedding-calendar-header">
        <span className="wedding-calendar-month">{monthName} {year}</span>
      </div>
      
      <div className="wedding-calendar-weekdays">
        {weekdays.map((day) => (
          <div key={day} className="wedding-calendar-weekday">{day}</div>
        ))}
      </div>
      
      <div className="wedding-calendar-days">
        {days.map((day, index) => {
          const isTarget = day === targetDay;
          return (
            <div 
              key={index} 
              className={`wedding-calendar-day ${day ? 'has-day' : ''} ${isTarget ? 'is-target' : ''}`}
            >
              {day}
              {isTarget && (
                <svg className="wedding-calendar-heart" viewBox="0 0 100 100">
                  <path 
                    d="M 50 80 
                       C 22 55, 14 38, 14 26 
                       C 14 16, 22 8, 32 8 
                       C 40 8, 47 14, 50 20 
                       C 53 14, 60 8, 68 8 
                       C 78 8, 86 16, 86 26 
                       C 86 38, 78 55, 50 80 Z" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="5" 
                    strokeDasharray="400"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
