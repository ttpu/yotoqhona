'use client';

import { useEffect, useState } from 'react';

type StatCounterProps = {
  value: number;
  suffix?: string;
  durationMs?: number;
};

export function StatCounter({ value, suffix = '+', durationMs = 1000 }: StatCounterProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - startTime) / durationMs, 1);
      const next = Math.floor(value * progress);
      setCurrent(next);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [value, durationMs]);

  return (
    <span>
      {current}
      {suffix}
    </span>
  );
}