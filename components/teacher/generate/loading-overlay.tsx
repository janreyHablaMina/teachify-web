"use client";

import { useEffect, useState } from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LOADING_MESSAGES = [
  "Teachify AI is reading your file...",
  "Analyzing lesson content...",
  "Identifying key concepts...",
  "Structuring question sets...",
  "Vetting accuracy with AI...",
  "Almost there, finalizing your quiz...",
];

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-[440px] rounded-[18px] border-2 border-slate-900 bg-white p-8 shadow-[8px_8px_0_#0f172a]">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-slate-900 bg-yellow-200 shadow-[4px_4px_0_#0f172a]">
            <span className="text-2xl font-black text-slate-900">AI</span>
            <div className="absolute -inset-2 animate-ping rounded-2xl border-2 border-teal-500/30" />
          </div>

          <div>
            <h3 className="m-0 text-[24px] font-black tracking-tight text-[#0f172a]">Generating your Quiz</h3>
            <p className="mt-2 h-6 text-[14px] font-bold text-slate-500">{LOADING_MESSAGES[msgIdx]}</p>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full border-2 border-slate-900 bg-slate-100 p-[1px]">
            <div className="h-full w-full rounded-full bg-[linear-gradient(90deg,#22c55e_0%,#14b8a6_100%)] animate-[loading_10s_ease-in-out_infinite]" />
          </div>

          <p className="m-0 text-[11px] font-black uppercase tracking-widest text-slate-400">This usually takes 10-15 seconds</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
