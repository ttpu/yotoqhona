"use client";

import { useEffect, useRef, useState } from "react";

interface StatisticCounterProps {
  value: number;
  label: string;
  icon?: string;
}

export default function StatisticCounter({ value, label, icon }: StatisticCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let current = 0;
    const increment = Math.ceil(value / 30);
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div className="statistic-card" ref={ref}>
      {icon && <div className="statistic-icon">{icon}</div>}
      <div className="statistic-value">{displayValue}+</div>
      <div className="statistic-label">{label}</div>
    </div>
  );
}
