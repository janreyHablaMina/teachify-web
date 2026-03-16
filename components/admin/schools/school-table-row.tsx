"use client";

import { School, SchoolPlan } from "./types";
import { SchoolActionMenu } from "./school-action-menu";

interface SchoolTableRowProps {
  school: School;
  index: number;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onUpgrade: () => void;
  onToggleStatus: () => void;
}

const avatars = ["bg-[#99f6e4]", "bg-[#fef08a]", "bg-[#fda4af]", "bg-[#e9d5ff]"];
const planColors: Record<SchoolPlan, string> = { Basic: "#bae6fd", Pro: "#fda4af", School: "#e9d5ff" };

export function SchoolTableRow({
  school,
  index,
  isMenuOpen,
  onMenuToggle,
  onUpgrade,
  onToggleStatus,
}: SchoolTableRowProps) {
  return (
    <div className="group relative grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-5 bg-white border border-slate-900/5 rounded-2xl transition-all hover:scale-[1.005] hover:-translate-y-0.5 hover:shadow-lg hover:border-[#99f6e4] hover:z-10">
      {/* School Info */}
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-900/10 text-[16px] font-black ${avatars[index % 4]}`}>
          {school.name.charAt(0)}
        </div>
        <span className="text-[15px] font-extrabold text-[#0f172a]">{school.name}</span>
      </div>

      {/* Institutional Size */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-extrabold text-[#0f172a]">{school.students} students</span>
        <span className="text-xs font-semibold text-slate-500">{school.teachers.length} teachers</span>
      </div>

      {/* Usage */}
      <div>
        <span className="text-sm font-extrabold text-[#0f172a]">{school.quizzesGenerated.toLocaleString()}</span>
        <small className="ml-1 text-slate-500 font-medium text-[11px] uppercase tracking-wider">quizzes</small>
      </div>

      {/* Plan */}
      <div>
        <div
          className="w-fit border-[1.5px] border-[#0f172a] bg-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight"
          style={{ boxShadow: `2px 2px 0 ${planColors[school.plan]}` }}
        >
          {school.plan}
        </div>
      </div>

      {/* Status */}
      <div className={`flex items-center gap-2.5 ${school.status === "Active" ? "" : "opacity-60"}`}>
        <span className={`h-2.5 w-2.5 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.1)] ${
          school.status === "Active" ? "bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.4)]"
        }`} />
        <span className="text-[12px] font-extrabold text-[#0f172a]">{school.status}</span>
      </div>

      {/* Joined Date */}
      <div className="text-[12px] font-bold text-slate-500">
        {school.joinedDate}
      </div>

      {/* Operations */}
      <SchoolActionMenu
        school={school}
        isOpen={isMenuOpen}
        onToggle={onMenuToggle}
        onUpgrade={onUpgrade}
        onToggleStatus={onToggleStatus}
      />
    </div>
  );
}
