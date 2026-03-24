"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Sparkles, KeyRound, Target, CalendarClock } from "lucide-react";
import { apiGetClassrooms } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { StudentClassCard } from "@/components/student/student-class-card";
import { StudentActivity } from "@/components/student/student-activity";
import { EnrolledClassroom } from "@/components/student/types";
import { JoinClassModal } from "@/components/student/join-class-modal";
import { useStudent } from "@/components/student/student-context";

export default function StudentDashboard() {
  const { session } = useStudent();
  const [classrooms, setClassrooms] = useState<EnrolledClassroom[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const firstName = session?.fullname?.split(" ")[0] || "Student";

  async function fetchDashboardData() {
    setIsDataLoading(true);
    try {
      const token = getStoredToken();
      if (!token) return;

      const { response, data } = await apiGetClassrooms<EnrolledClassroom[]>(token);
      if (response.ok) setClassrooms(data);
    } catch {
      // Silent error, empty state shown
    } finally {
      setIsDataLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full space-y-8">
      <header className="animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="relative overflow-hidden rounded-[30px] border border-[#0f172a]/20 bg-[linear-gradient(135deg,#ffffff_0%,#eef2ff_45%,#e0e7ff_100%)] p-7 lg:p-9">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border-2 border-[#0f172a]/10 bg-white/70" />
          <div className="pointer-events-none absolute -bottom-14 right-20 h-44 w-44 rounded-full border-2 border-[#0f172a]/10 bg-white/60" />

          <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#0f172a]/20 bg-white px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Student Mission Board</span>
              </div>
              <h1 className="text-[44px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Hey, {firstName}</h1>
              <p className="mt-3 max-w-2xl text-[16px] font-semibold text-slate-600">Everything important for today is here: class joins, due work, and your streak momentum.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#0f172a]/20 bg-indigo-500 px-6 py-3.5 text-[14px] font-black uppercase tracking-widest text-white transition hover:bg-indigo-600"
              >
                <Plus className="h-5 w-5" />
                Join Class
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border-2 border-[#0f172a]/10 border-t-[5px] border-t-teal-500 bg-white p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Classes Joined</p>
          <p className="mt-2 text-[30px] font-black leading-none text-[#0f172a]">{classrooms.length}</p>
        </article>
        <article className="rounded-2xl border-2 border-[#0f172a]/10 border-t-[5px] border-t-amber-500 bg-white p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Today&apos;s Focus</p>
          <p className="mt-2 text-[20px] font-black leading-none text-[#0f172a]">Review + Quiz Practice</p>
        </article>
        <article className="rounded-2xl border-2 border-[#0f172a]/10 border-t-[5px] border-t-violet-500 bg-white p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Current Streak</p>
          <p className="mt-2 text-[30px] font-black leading-none text-[#0f172a]">5 Days</p>
        </article>
      </section>

      <section className="rounded-[28px] border border-[#0f172a]/20 bg-white p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-[26px] font-black leading-none text-[#0f172a]">
            <Target className="h-6 w-6 text-indigo-500" />
            Your Enrolled Classes
          </h3>
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#0f172a] bg-white px-4 py-2.5 text-[12px] font-black uppercase tracking-wider text-[#0f172a] transition hover:bg-indigo-50"
          >
            <KeyRound className="h-4 w-4" />
            Enter Join Code
          </button>
        </div>

        {isDataLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[220px] animate-pulse rounded-[24px] border-2 border-[#0f172a]/10 bg-slate-50" />
            ))}
          </div>
        ) : classrooms.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="flex min-h-[330px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#0f172a]/20 bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] px-8 py-12 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-[#0f172a]/10 bg-white text-indigo-300 shadow-[4px_4px_0_#e0e7ff]">
                <BookOpen className="h-10 w-10" />
              </div>
              <h4 className="text-[24px] font-black text-[#0f172a]">No classes yet</h4>
              <p className="mb-8 mt-3 max-w-[420px] text-[15px] font-semibold text-slate-500">
                Use your teacher&apos;s invite link or class code to unlock lessons and quizzes.
              </p>
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="rounded-2xl border border-[#0f172a]/20 bg-indigo-500 px-10 py-4 text-[14px] font-black uppercase tracking-widest text-white transition hover:bg-indigo-600"
              >
                Join Class Now
              </button>
            </div>

            <aside className="rounded-[24px] border border-[#0f172a]/15 bg-white p-6 text-[#0f172a]">
              <h4 className="flex items-center gap-2 text-[18px] font-black text-[#0f172a]">
                <Sparkles className="h-5 w-5 text-indigo-300" />
                What You Need Here
              </h4>
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-[#0f172a]/10 bg-slate-50 p-3">
                  <p className="text-[12px] font-black uppercase tracking-wider text-indigo-500">Step 1</p>
                  <p className="mt-1 text-[14px] font-semibold text-slate-700">Get an invite link or 6-character code from your teacher.</p>
                </div>
                <div className="rounded-xl border border-[#0f172a]/10 bg-slate-50 p-3">
                  <p className="text-[12px] font-black uppercase tracking-wider text-indigo-500">Step 2</p>
                  <p className="mt-1 text-[14px] font-semibold text-slate-700">Tap Join Class and paste the code exactly.</p>
                </div>
                <div className="rounded-xl border border-[#0f172a]/10 bg-slate-50 p-3">
                  <p className="text-[12px] font-black uppercase tracking-wider text-indigo-500">Step 3</p>
                  <p className="mt-1 text-[14px] font-semibold text-slate-700">Your class, assignments, and quiz deadlines show up here.</p>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {classrooms.map((cls) => (
              <StudentClassCard key={cls.id} classroom={cls} />
            ))}

            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="group flex min-h-[220px] flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-[#0f172a]/20 bg-slate-50/60 p-7 transition-all hover:border-indigo-400 hover:bg-white hover:shadow-[8px_8px_0_#c7d2fe]"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#0f172a] bg-white shadow-[4px_4px_0_#c7d2fe] transition-transform group-hover:scale-110">
                <Plus className="h-6 w-6" />
              </div>
              <p className="m-0 text-[15px] font-black text-[#0f172a]">Join Another Class</p>
              <p className="mt-1 text-[13px] font-bold text-slate-400">Use another invite code</p>
            </button>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-[24px] font-black text-[#0f172a]">
          <CalendarClock className="h-6 w-6 text-indigo-500" />
          Deadlines & Progress
        </h3>
        <StudentActivity />
      </section>

      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
