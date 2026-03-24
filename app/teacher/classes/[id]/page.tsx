"use client";

import { StudentList } from "@/components/teacher/classes/student-list";
import { Student } from "@/components/teacher/classes/types";
import { Users, GraduationCap, ClipboardList, TrendingUp, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useState, use, useEffect } from "react";
import { InviteStudentsModal } from "@/components/teacher/classes/invite-students-modal";
import { apiGetClassroom } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";

const MOCK_STUDENTS: Student[] = [
  { id: 1, fullname: "Marcus Aurelius", email: "marcus@rome.edu", enrolled_at: "2024-02-01T10:00:00Z" },
  { id: 2, fullname: "Seneca the Younger", email: "seneca@stoic.org", enrolled_at: "2024-02-05T14:30:00Z" },
  { id: 3, fullname: "Epictetus Slave", email: "epictetus@freedom.com", enrolled_at: "2024-02-10T09:15:00Z" },
  { id: 4, fullname: "Hypatia of Alexandria", email: "hypatia@library.gov", enrolled_at: "2024-02-12T11:45:00Z" },
  { id: 5, fullname: "Thomas Aquinas", email: "summa@theology.va", enrolled_at: "2024-02-15T16:00:00Z" },
  { id: 6, fullname: "Marie Curie", email: "pierre@radium.fr", enrolled_at: "2024-02-18T10:00:00Z" },
  { id: 7, fullname: "Isaac Newton", email: "gravity@apple.uk", enrolled_at: "2024-02-20T14:30:00Z" },
  { id: 8, fullname: "Albert Einstein", email: "relativity@emc2.de", enrolled_at: "2024-02-22T09:15:00Z" },
];

export default function TeacherClassDetails({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [classMeta, setClassMeta] = useState<{ name: string; join_code: string } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadClassMeta() {
      try {
        const token = getStoredToken();
        if (!token) return;
        const { response, data } = await apiGetClassroom<{ name?: string; join_code?: string }>(token, params.id);
        if (!response.ok || !mounted) return;
        setClassMeta({
          name: String(data?.name ?? "Classroom"),
          join_code: String(data?.join_code ?? ""),
        });
      } catch {
        // Keep fallback UI
      }
    }

    loadClassMeta();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  const className = classMeta?.name || "Classroom";
  const joinCode = classMeta?.join_code || "------";
  
  return (
    <div className="w-full">
      {/* Breadcrumbs & Simple Back */}
      <div className="mb-8 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.05em] text-slate-400">
          <Link href="/teacher" className="hover:text-teal-600 transition-colors no-underline">Dashboard</Link>
          <span className="opacity-30">/</span>
          <Link href="/teacher/classes" className="hover:text-teal-600 transition-colors no-underline">Classes</Link>
          <span className="opacity-30">/</span>
          <span className="text-slate-900">Details</span>
        </nav>
        <Link 
          href="/teacher/classes" 
          className="group flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-teal-600 transition-colors no-underline"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all group-hover:border-teal-200 group-hover:bg-teal-50">&larr;</span>
          Back to list
        </Link>
      </div>

      {/* Clean Header */}
      <header className="mb-10 flex flex-wrap items-start justify-between gap-8 border-b border-slate-100 pb-10">
        <div className="flex items-center gap-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-200/50">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="m-0 text-[32px] font-extrabold tracking-tight text-slate-900">{className}</h2>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white ring-2 ring-slate-900/10">
                <span className="text-slate-400">CODE:</span> {joinCode}
              </div>
            </div>
            <p className="mt-1.5 text-[15px] font-medium text-slate-500 max-w-xl">
              Class Overview and student performance tracking. Managing <span className="font-bold text-slate-900">{MOCK_STUDENTS.length} students</span> currently enrolled.
            </p>
          </div>
        </div>

        {/* Compact Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            disabled={!classMeta?.join_code}
            className="flex h-11 items-center gap-2 rounded-xl bg-white border-2 border-[#0f172a] px-5 text-[13px] font-black text-[#0f172a] shadow-[4px_4px_0_#99f6e4] transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <UserPlus className="h-4 w-4" />
            Invite Students
          </button>
          <button className="flex h-11 items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 text-[13px] font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300">
            Export Roster
          </button>
          <button className="flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-6 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-teal-100 active:scale-95">
            Create Assignment
          </button>
        </div>
      </header>

      {/* Flat Metrics Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {[
          { label: "Total Students", value: MOCK_STUDENTS.length, icon: Users, sub: "8 active now" },
          { label: "Active Quizzes", value: "12", icon: ClipboardList, sub: "3 pending review" },
          { label: "Avg. Performance", value: "88%", icon: TrendingUp, sub: "+4% this month" },
          { label: "Class Rank", value: "#04", icon: GraduationCap, sub: "Top 10% in school" },
        ].map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-teal-200 hover:shadow-md hover:shadow-teal-500/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 group-hover:text-teal-200 transition-colors">Unit 0{i + 1}</span>
            </div>
            <h4 className="m-0 text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</h4>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[28px] font-extrabold text-slate-900">{stat.value}</span>
              <span className="text-[12px] font-medium text-slate-400">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <section>
        <StudentList students={MOCK_STUDENTS} />
      </section>

      <InviteStudentsModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        joinCode={joinCode}
        classId={params.id}
      />
    </div>
  );
}
