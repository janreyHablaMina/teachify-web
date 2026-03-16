"use client";

import { useEffect, useRef, useState } from "react";
import { impactStats } from "./data";

function formatStat(value: number, suffix = "") {
  return `${new Intl.NumberFormat("en-US").format(Math.floor(value))}${suffix}`;
}

const toneClasses: Record<string, string> = {
  yellow: "from-yellow-50 to-yellow-100",
  teal: "from-teal-50 to-teal-100",
  pink: "from-rose-50 to-rose-100",
  purple: "from-violet-50 to-violet-100",
};

export function MarketingImpact() {
  const [count, setCount] = useState<number[]>(() => impactStats.map(() => 0));
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(impactStats.map((item) => item.value * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started]);

  return (
    <section ref={ref} className="relative border-y-2 border-slate-900 bg-gradient-to-b from-rose-50 to-white px-4 py-10 sm:px-8 sm:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="rounded-md border-2 border-slate-900 bg-white p-4 shadow-[8px_8px_0_rgba(15,23,42,0.14)] sm:p-5 sm:shadow-[10px_10px_0_rgba(15,23,42,0.14)]">
          <div className="mb-4 flex flex-col items-start gap-2 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-3">
            <span className="rotate-[-2deg] border border-slate-900 bg-rose-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider sm:px-3 sm:text-[11px]">
              Impact Snapshot
            </span>
            <p className="text-xs font-semibold text-slate-600 sm:text-sm">
              Every number updates as teachers scale with Teachify.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {impactStats.map((item, index) => (
              <article
                key={item.label}
                className={`rounded border-2 border-slate-900 bg-gradient-to-b p-3 shadow-[4px_4px_0_rgba(15,23,42,0.18)] sm:p-4 sm:shadow-[5px_5px_0_rgba(15,23,42,0.18)] ${toneClasses[item.tone]}`}
              >
                <span className="inline-block border border-slate-900 bg-white px-2 py-1 text-[9px] font-black uppercase tracking-wide sm:text-[10px]">
                  {item.tag}
                </span>
                <strong className="mt-2.5 block text-[34px] font-black leading-none tracking-tight text-slate-900 sm:mt-3 sm:text-4xl">
                  {formatStat(count[index], item.suffix)}
                </strong>
                <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-[11px]">
                  {item.label}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
