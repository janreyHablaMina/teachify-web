import Link from "next/link";
import { Plus, UploadCloud, BookOpen, Users, Lock, Crown } from "lucide-react";
import { DASHBOARD_BTN_BASE } from "./plan";
import type { PlanTier } from "./types";

type QuickActionsPanelProps = {
  planTier: PlanTier;
};

export function QuickActionsPanel({ planTier }: QuickActionsPanelProps) {
  const isFree = planTier === "trial";

  return (
    <section className="grid w-full gap-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[18px] font-black uppercase tracking-tight text-slate-800">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Generate Quiz */}
        <Link 
          href="/teacher/generate" 
          className="group relative flex flex-col gap-3 rounded-[20px] border-[1.5px] border-emerald-900 bg-emerald-100 p-5 shadow-[2px_2px_0_#064e3b] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-emerald-200 hover:shadow-none"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-emerald-900 bg-emerald-300 shadow-[1px_1px_0_#064e3b] group-hover:bg-emerald-400">
            <Plus className="h-6 w-6 text-emerald-900" />
          </div>
          <div>
            <p className="m-0 text-[14px] font-black text-slate-900">Generate Quiz</p>
            <p className="m-0 text-[11px] font-bold text-slate-600">Create with AI in seconds</p>
          </div>
        </Link>

        {/* Import Document - Locked for Free */}
        <Link 
          href={isFree ? "/teacher/upgrade" : "/teacher/generate?source=upload"} 
          className={`group relative flex flex-col gap-3 rounded-[20px] border-[1.5px] border-blue-900 ${isFree ? "bg-slate-100 opacity-80" : "bg-blue-100"} p-5 shadow-[2px_2px_0_#1e3a8a] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${isFree ? "hover:bg-slate-200" : "hover:bg-blue-200"}`}
        >
          {isFree ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-blue-900 bg-[#fef08a] px-2 py-0.5 text-[9px] font-black text-blue-900 shadow-[1px_1px_0_#1e3a8a]">
              <Crown className="h-3 w-3" />
              PRO
            </span>
          ) : null}
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-blue-900 ${isFree ? "bg-slate-300" : "bg-blue-300"} shadow-[1px_1px_0_#1e3a8a]`}>
            {isFree ? <Lock className="h-5 w-5 text-slate-700" /> : <UploadCloud className="h-6 w-6 text-blue-900" />}
          </div>
          <div>
            <p className="m-0 text-[14px] font-black text-slate-900">Import Doc</p>
            <p className="m-0 text-[11px] font-bold text-slate-600">Convert PDF to Questions</p>
          </div>
        </Link>

        {/* Create Lesson */}
        <Link 
          href="/teacher/generate" 
          className="group relative flex flex-col gap-3 rounded-[20px] border-[1.5px] border-cyan-900 bg-cyan-100 p-5 shadow-[2px_2px_0_#083344] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-cyan-200 hover:shadow-none"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-cyan-900 bg-cyan-300 shadow-[1px_1px_0_#083344] group-hover:bg-cyan-400">
            <BookOpen className="h-6 w-6 text-cyan-900" />
          </div>
          <div>
            <p className="m-0 text-[14px] font-black text-slate-900">Create Lesson</p>
            <p className="m-0 text-[11px] font-bold text-slate-600">AI-generated summaries</p>
          </div>
        </Link>

        {/* Create Class - Locked for Free */}
        <Link 
          href={isFree ? "/teacher/upgrade" : "/teacher/classes"} 
          className={`group relative flex flex-col gap-3 rounded-[20px] border-[1.5px] border-purple-900 ${isFree ? "bg-slate-100 opacity-80" : "bg-purple-100"} p-5 shadow-[2px_2px_0_#581c87] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${isFree ? "hover:bg-slate-200" : "hover:bg-purple-200"}`}
        >
          {isFree ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-purple-900 bg-[#fef08a] px-2 py-0.5 text-[9px] font-black text-purple-900 shadow-[1px_1px_0_#581c87]">
              <Crown className="h-3 w-3" />
              PRO
            </span>
          ) : null}
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-purple-900 ${isFree ? "bg-slate-300" : "bg-purple-300"} shadow-[1px_1px_0_#581c87]`}>
            {isFree ? <Lock className="h-5 w-5 text-slate-700" /> : <Users className="h-6 w-6 text-purple-900" />}
          </div>
          <div>
            <p className="m-0 text-[14px] font-black text-slate-900">Create Class</p>
            <p className="m-0 text-[11px] font-bold text-slate-600">Manage students & tracks</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
