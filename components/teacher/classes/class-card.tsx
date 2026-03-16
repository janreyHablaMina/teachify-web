"use client";

import Link from "next/link";
import { Classroom } from "./types";

interface ClassCardProps {
  classroom: Classroom;
}

export function ClassCard({ classroom }: ClassCardProps) {
  return (
    <Link href={`/teacher/classes/${classroom.id}`} className="group block">
      <article className="h-full rounded-[24px] border-2 border-[#0f172a] bg-white p-7 shadow-[8px_8px_0_#99f6e4] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_#0f172a]">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="m-0 text-[20px] font-black tracking-tight text-[#0f172a] group-hover:text-teal-700">{classroom.name}</h4>
          <span className={`rounded-full border-[1.5px] border-[#0f172a] px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
            classroom.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"
          }`}>
            {classroom.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p className="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Join Code</p>
            <strong className="text-[18px] font-black tracking-widest text-[#0f172a] selection:bg-yellow-200">
              {classroom.join_code}
            </strong>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Students</p>
            <strong className="text-[18px] font-black text-[#0f172a]">{classroom.students_count}</strong>
          </div>
          
          {classroom.room && (
            <div className="flex flex-col gap-1">
              <p className="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Room</p>
              <strong className="text-[14px] font-bold text-slate-600">{classroom.room}</strong>
            </div>
          )}
          
          {classroom.schedule && (
            <div className="flex flex-col gap-1 text-right">
              <p className="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Schedule</p>
              <strong className="text-[14px] font-bold text-slate-600">{classroom.schedule}</strong>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
