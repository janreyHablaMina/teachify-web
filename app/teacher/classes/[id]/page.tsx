"use client";

import { StudentList } from "@/components/teacher/classes/student-list";
import { Student } from "@/components/teacher/classes/types";
import { Users, GraduationCap, ClipboardList, TrendingUp, UserPlus, Activity } from "lucide-react";
import Link from "next/link";
import React, { useState, use, useEffect, useMemo } from "react";
import { InviteStudentsModal } from "@/components/teacher/classes/invite-students-modal";
import { apiGetClassroom, apiUpdateClassroomStudentStatus, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";

type ClassroomDetailsApi = {
  id: number;
  name: string;
  join_code: string;
  room?: string | null;
  schedule?: string | null;
  is_active?: boolean;
  students?: Array<{
    id: number;
    fullname: string;
    email: string;
    pivot?: { created_at?: string; status?: "pending" | "approved" | "suspended" | "rejected" };
    created_at?: string;
  }>;
  assignments?: Array<{ id: number; quiz?: { id: number } | null }>;
};

export default function TeacherClassDetails({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { showToast } = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [classroom, setClassroom] = useState<ClassroomDetailsApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStudentId, setUpdatingStudentId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadClassroom() {
      setIsLoading(true);
      try {
        const token = getStoredToken();
        if (!token) return;

        const { response, data } = await apiGetClassroom<ClassroomDetailsApi>(token, params.id);
        if (!response.ok || !mounted) return;
        setClassroom(data);
      } catch {
        // keep fallback UI
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadClassroom();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  const className = classroom?.name || "Classroom";
  const joinCode = classroom?.join_code || "------";

  const students: Student[] = useMemo(() => {
    return (classroom?.students ?? []).map((student) => ({
      id: student.id,
      fullname: student.fullname,
      email: student.email,
      enrolled_at: student.pivot?.created_at || student.created_at || new Date().toISOString(),
      enrollment_status: (student.pivot?.status as "pending" | "approved" | "suspended" | "rejected" | undefined) ?? "approved",
    }));
  }, [classroom?.students]);

  const approvedStudents = students.filter((student) => student.enrollment_status === "approved");
  const pendingStudents = students.filter((student) => student.enrollment_status === "pending");
  const suspendedStudents = students.filter((student) => student.enrollment_status === "suspended");
  const totalStudents = approvedStudents.length;
  const activeQuizzes = (classroom?.assignments ?? []).filter((assignment) => assignment.quiz).length;
  const classStatus = classroom?.is_active === false ? "Inactive" : "Active";

  const applyStudentStatus = (studentId: number, status: "pending" | "approved" | "suspended" | "rejected") => {
    setClassroom((prev) => {
      if (!prev?.students) return prev;
      return {
        ...prev,
        students: prev.students.map((student) =>
          student.id === studentId
            ? {
                ...student,
                pivot: {
                  ...(student.pivot ?? {}),
                  status,
                },
              }
            : student
        ),
      };
    });
  };

  const handleChangeStudentStatus = async (
    studentId: number,
    status: "pending" | "approved" | "suspended" | "rejected"
  ) => {
    const token = getStoredToken();
    if (!token) {
      showToast("Session expired. Please log in again.", "error");
      return;
    }

    setUpdatingStudentId(studentId);
    try {
      const { response, data } = await apiUpdateClassroomStudentStatus(token, params.id, studentId, status);
      if (!response.ok) {
        showToast(getApiErrorMessage(response, data, "Failed to update student status."), "error");
        return;
      }
      applyStudentStatus(studentId, status);
      showToast(`Student status set to ${status}.`, "success");
    } catch {
      showToast("Failed to update student status.", "error");
    } finally {
      setUpdatingStudentId(null);
    }
  };

  return (
    <div className="w-full">
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
              Class overview and student tracking. Managing <span className="font-bold text-slate-900">{totalStudents}</span> enrolled students.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            disabled={!classroom?.join_code}
            className="flex h-11 items-center gap-2 rounded-xl bg-white border-2 border-[#0f172a] px-5 text-[13px] font-black text-[#0f172a] shadow-[4px_4px_0_#99f6e4] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Students",
            value: String(totalStudents),
            icon: Users,
            sub: totalStudents > 0 ? "Approved enrollments" : "No approved students",
            accent: "border-t-teal-500",
          },
          {
            label: "Active Quizzes",
            value: String(activeQuizzes),
            icon: ClipboardList,
            sub: activeQuizzes > 0 ? "Assigned" : "No active quizzes",
            accent: "border-t-amber-500",
          },
          {
            label: "Pending Requests",
            value: String(pendingStudents.length),
            icon: TrendingUp,
            sub: pendingStudents.length > 0 ? "Needs teacher approval" : "No pending requests",
            accent: "border-t-rose-500",
          },
          {
            label: "Suspended",
            value: String(suspendedStudents.length),
            icon: Activity,
            sub: suspendedStudents.length > 0 ? "Temporarily blocked" : classStatus,
            accent: "border-t-violet-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200 border-t-[5px] bg-white p-6 transition-all hover:border-teal-200 hover:shadow-md hover:shadow-teal-500/5 ${stat.accent}`}
          >
            <div className="mb-4 flex items-center justify-between">
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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <section>
          <StudentList
            students={students}
            onChangeStudentStatus={handleChangeStudentStatus}
            isUpdatingStudentId={updatingStudentId}
          />
        </section>
      )}

      <InviteStudentsModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        joinCode={joinCode}
        classId={params.id}
      />
    </div>
  );
}
