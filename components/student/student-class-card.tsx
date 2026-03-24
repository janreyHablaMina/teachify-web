import { BookOpen, ClipboardList, ChevronRight } from "lucide-react";
import Link from "next/link";
import { EnrolledClassroom } from "./types";

interface StudentClassCardProps {
  classroom: EnrolledClassroom;
}

export function StudentClassCard({ classroom }: StudentClassCardProps) {
  return (
    <Link href={`/student/classes/${classroom.id}`} className="group no-underline">
      <div className="h-full rounded-[26px] border-2 border-[#0f172a] bg-white p-6 shadow-[6px_6px_0_#c7d2fe] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_#6366f1] active:translate-y-0 active:shadow-none">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="rounded-full border border-[#0f172a]/15 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
            {classroom.join_code}
          </span>
        </div>
        <h4 className="text-[21px] font-black leading-tight text-[#0f172a] transition-colors group-hover:text-indigo-600">
          {classroom.name}
        </h4>
        <p className="mt-2 text-[13px] font-bold text-slate-400">
          Teacher: <span className="text-[#0f172a]">{classroom.teacher?.fullname ?? "Educator"}</span>
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-dashed border-slate-200 pt-5">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ClipboardList className="h-4 w-4" />
            <span className="text-[12px] font-black">4 Quizzes</span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
