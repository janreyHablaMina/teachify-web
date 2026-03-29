"use client";

import { Sparkles } from "lucide-react";

export function AIEngineHeader() {
  return (
     <div className="border-b border-slate-100 bg-white/40 backdrop-blur-md p-8 flex flex-col items-center text-center gap-5">
       <div className="relative group">
          <div className="absolute inset-0 rounded-2xl bg-indigo-400/20 blur-xl group-hover:bg-indigo-400/30 transition-all duration-500 animate-pulse" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-indigo-500 shadow-lg shadow-indigo-500/10 transition-all hover:scale-110 hover:-rotate-3">
            <Sparkles size={28} strokeWidth={2} />
          </div>
       </div>
       <div className="space-y-1.5 max-w-md">
         <h3 className="text-[24px] font-black tracking-tight text-[#0f172a] bg-clip-text text-transparent bg-gradient-to-r from-[#0f172a] to-slate-500">Teachify AI Intelligence</h3>
         <p className="text-[14px] font-medium text-slate-500 leading-relaxed">
           Your professional curriculum partner. Input a topic below and let the AI architect your next lesson.
         </p>
       </div>
     </div>
  );
}
