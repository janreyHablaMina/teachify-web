"use client";

import { Sparkles } from "lucide-react";

export function AIEngineHeader() {
  return (
     <div className="border-b-2 border-slate-900 bg-indigo-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
       <div className="flex items-center gap-4 text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white text-indigo-500 shadow-[3px_3px_0_#0f172a]">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-[20px] font-black text-[#0f172a]">Teachify AI</h3>
            <p className="text-[13px] font-bold text-slate-500">Enhanced synthesis & curriculum design assistant.</p>
          </div>
       </div>
     </div>
  );
}
