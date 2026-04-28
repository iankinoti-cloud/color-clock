import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import './ColorClock.css';

function ColorClock() {
  const [now, setNow] = useState(new Date());
  const audioCtxRef = useRef(null);

  useEffect(() => {
    function playTick() {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
        return;
      }

      // Short noise burst shaped to sound like a mechanical tick
      const bufferSize = Math.floor(ctx.sampleRate * 0.015); // 15ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 10);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 0.5;

      const gain = ctx.createGain();
      gain.gain.value = 0.25;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    }

    const timer = setInterval(() => {
      setNow(new Date());
      playTick();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => audioCtxRef.current?.close();
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
