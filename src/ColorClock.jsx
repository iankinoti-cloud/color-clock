import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './ColorClock.css';

function ColorClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock-widget">
      <p className="clock-label">Current Time</p>
      <div className="clock-time">{format(now, 'HH:mm:ss')}</div>
      <div className="clock-divider" aria-hidden="true" />
      <div className="clock-date">{format(now, 'EEEE, MMMM do, yyyy')}</div>
    </div>
  );
}

export default ColorClock;
