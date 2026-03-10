"use client";

import { useEffect, useRef, useState } from "react";

type StatItem = {
  value: number;
  label: string;
  tag: string;
  tone: string;
  suffix?: string;
};

const stats: StatItem[] = [
  { value: 12450, label: "Teachers Using Teachify", tag: "Active Educators", tone: "tone-yellow", suffix: "+" },
  { value: 508200, label: "Quizzes Generated", tag: "Assessment Output", tone: "tone-teal", suffix: "+" },
  { value: 19750, label: "Hours Saved Monthly", tag: "Time Saved", tone: "tone-pink", suffix: "+" },
  { value: 860, label: "Schools Onboarded", tag: "School Partners", tone: "tone-purple", suffix: "+" },
];

function formatStat(value: number, suffix = "") {
  return `${new Intl.NumberFormat("en-US").format(Math.floor(value))}${suffix}`;
}

export default function StatsSection() {
  const [count, setCount] = useState<number[]>(() => stats.map(() => 0));
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted) return;
        setHasStarted(true);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 1400;
    const start = performance.now();
    let frameId = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(stats.map((item) => item.value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [hasStarted]);

  return (
    <section ref={sectionRef} className="lp-stats-v3 lp-stats-v3-impact" aria-label="Teachify impact metrics">
      <div className="sketch-canvas">
        <div className="stats-impact-board">
          <div className="stats-impact-head">
            <span className="stats-impact-kicker">Impact Snapshot</span>
            <p>Every number below updates as teachers scale with Teachify.</p>
          </div>
          <div className="lp-stats-v3-inner lp-stats-v3-inner-4">
            {stats.map((item, index) => (
              <article className={`stat-item-v3 ${item.tone}`} key={item.label}>
                <span className="stat-pin-v3" aria-hidden="true" />
                <span className="stat-tag-v3">{item.tag}</span>
                <strong className="stat-num-v3">{formatStat(count[index], item.suffix)}</strong>
                <span className="stat-label-v3">{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
