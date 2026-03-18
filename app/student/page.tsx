"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, TrendingUp, BookOpen, GraduationCap, Plus } from "lucide-react";
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

      const { response, data } = await apiGetClassrooms(token);
      if (response.ok) {
        setClassrooms(data as EnrolledClassroom[]);
      }
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
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <header className="mb-10 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-6 w-1 bg-indigo-500 rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Student Learning Portal</span>
            </div>
            <h1 className="text-[42px] font-black leading-none tracking-tight text-[#0f172a]">Hello, {firstName}!</h1>
            <p className="mt-3 text-[16px] font-medium text-slate-500">Master your classes and stay ahead of your schedule.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-indigo-500 px-6 py-4 text-[14px] font-black uppercase tracking-widest text-white shadow-[6px_6px_0_#0f172a] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#0f172a] active:translate-y-0 active:shadow-none mr-2"
             >
                <Plus className="h-5 w-5" />
                Join Class
             </button>

             <div className="hidden sm:flex rounded-[20px] border-2 border-[#0f172a] bg-white p-5 shadow-[4px_4px_0_#818cf8]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rank</p>
                    <p className="text-[20px] font-black text-[#0f172a]">Elite IV</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_350px]">
        {/* Main Content Area */}
        <div className="space-y-10">
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-[22px] font-black text-[#0f172a]">
                <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                Your Enrolled Classes
              </h3>
            </div>

            {isDataLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="h-[210px] rounded-[24px] border-2 border-[#0f172a]/10 bg-white animate-pulse" />
                ))}
              </div>
            ) : classrooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-slate-200 bg-white py-14 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-200">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h4 className="text-[20px] font-black text-[#0f172a]">No enrolled classes found</h4>
                <p className="mt-3 max-w-[280px] text-[15px] font-medium text-slate-400 mb-8">
                  You haven&apos;t joined any classes yet. Use an invite code from your teacher to get started.
                </p>
                <button 
                  onClick={() => setIsJoinModalOpen(true)}
                  className="rounded-2xl border-2 border-[#0f172a] bg-indigo-500 px-10 py-4 text-[14px] font-black uppercase tracking-widest text-white shadow-[6px_6px_0_#0f172a] transition hover:-translate-y-1 active:translate-y-0"
                >
                  Join Class Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {classrooms.map((cls) => (
                  <StudentClassCard key={cls.id} classroom={cls} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Focused Sidebar for Productivity */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-1000">
          <StudentActivity />
        </div>
      </div>

      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
