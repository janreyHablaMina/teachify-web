"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Classroom } from "./types";

interface ClassCardProps {
  classroom: Classroom;
  onDelete: (classroom: Classroom) => void;
}

export function ClassCard({ classroom, onDelete }: ClassCardProps) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[24px] border-2 border-slate-900 bg-[linear-gradient(140deg,#ffffff_0%,#ecfeff_38%,#ede9fe_100%)] p-7 shadow-[6px_6px_0_#99f6e4] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_#a78bfa]">
      <div className="pointer-events-none absolute -right-14 -top-14 h-28 w-28 rounded-full bg-fuchsia-200/55 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="pointer-events-none absolute -left-14 -bottom-14 h-28 w-28 rounded-full bg-cyan-200/55 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="mb-6 flex items-center justify-between gap-3">
        <h4 className="m-0 text-[20px] font-black tracking-tight text-slate-900 group-hover:text-fuchsia-700">{classroom.name}</h4>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border-2 border-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
            classroom.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
          }`}>
            {classroom.is_active ? "Active" : "Inactive"}
          </span>
          <button
            type="button"
            onClick={() => onDelete(classroom)}
            aria-label={`Delete ${classroom.name}`}
            title="Delete class"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-red-800 bg-red-100 text-red-800 transition hover:bg-red-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Join Code</p>
          <strong className="text-[18px] font-black tracking-widest text-slate-900 selection:bg-fuchsia-100">
            {classroom.join_code}
          </strong>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <p className="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Students</p>
          <strong className="text-[18px] font-black text-slate-900">{classroom.students_count}</strong>
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

      <div className="mt-6">
        <Link
          href={`/teacher/classes/${classroom.id}`}
          className="inline-flex items-center rounded-lg border-2 border-slate-900 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-900 no-underline transition hover:bg-slate-100"
        >
          Open Class
        </Link>
      </div>
    </article>
  );
}
