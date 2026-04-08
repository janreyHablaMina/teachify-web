"use client";

import { useEffect, useState } from "react";

interface LoadingOverlayProps {
  isComplete?: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
}

const LOADING_MESSAGES = [
  "Teachify AI is reading your file...",
  "Analyzing lesson content...",
  "Identifying key concepts...",
  "Structuring question sets...",
  "Vetting accuracy with AI...",
  "Almost there, finalizing your quiz...",
];

export function LoadingOverlay({ isComplete = false, onComplete, onCancel }: LoadingOverlayProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (isComplete) {
          if (prev >= 100) return 100;
          const burst = Math.max((100 - prev) * 0.35, 2.5);
          return Math.min(100, prev + burst);
        }

        if (prev >= 94) return 94;
        const drift = Math.max((94 - prev) * 0.08, 0.4);
        return Math.min(94, prev + drift);
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isComplete]);

  useEffect(() => {
    if (!isComplete || progress < 100 || !onComplete) return;
    const timeout = setTimeout(() => {
      onComplete();
    }, 180);
    return () => clearTimeout(timeout);
  }, [isComplete, progress, onComplete]);

  return (
    <div className="w-full rounded-[24px] border border-slate-900/10 bg-white p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.01)]">
      <div className="mx-auto w-full max-w-[440px] rounded-[18px] border-2 border-slate-900 bg-white p-8 shadow-[8px_8px_0_#0f172a]">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[20px] border-2 border-slate-900 bg-cyan-50 shadow-[4px_4px_0_#0f172a]">
            <div className="pointer-events-none absolute -inset-3 rounded-[22px] border-2 border-teal-400/30 animate-[pulse_1.9s_ease-in-out_infinite]" />
            <div className="pointer-events-none absolute left-1/2 top-[-8px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-teal-400 animate-ping" />
            <div
              className="pointer-events-none absolute right-[-6px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-400 animate-ping"
              style={{ animationDelay: "300ms" }}
            />
            <div
              className="pointer-events-none absolute bottom-[-6px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-400 animate-ping"
              style={{ animationDelay: "600ms" }}
            />

            <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
              <g className="animate-[pulse_1.4s_ease-in-out_infinite]">
                <path
                  d="M23 12c-5.5 0-10 4.5-10 10 0 1.2.2 2.3.6 3.3A9.7 9.7 0 0 0 10 33c0 3.7 2.1 6.9 5.1 8.5-.1.5-.1 1-.1 1.5 0 4.4 3.6 8 8 8 2.9 0 5.5-1.6 6.9-4.1V17c-1.5-3-4-5-6.9-5Z"
                  fill="#99f6e4"
                  stroke="#0f172a"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M41 12c5.5 0 10 4.5 10 10 0 1.2-.2 2.3-.6 3.3A9.7 9.7 0 0 1 54 33c0 3.7-2.1 6.9-5.1 8.5.1.5.1 1 .1 1.5 0 4.4-3.6 8-8 8-2.9 0-5.5-1.6-6.9-4.1V17c1.5-3 4-5 6.9-5Z"
                  fill="#67e8f9"
                  stroke="#0f172a"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M31 20v24M24 24h6M24 31h6M24 38h6M34 24h6M34 31h6M34 38h6" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          <div>
            <h3 className="m-0 text-[24px] font-black tracking-tight text-[#0f172a]">Generating your Quiz</h3>
            <p className="mt-2 h-6 text-[14px] font-bold text-slate-500">{LOADING_MESSAGES[msgIdx]}</p>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full border-2 border-slate-900 bg-slate-100 p-[1px]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e_0%,#14b8a6_100%)] transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="m-0 text-[11px] font-black uppercase tracking-widest text-slate-400">This usually takes 10-15 seconds</p>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Cancel Generation
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
