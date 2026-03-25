"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, CalendarClock, ChevronLeft, ClipboardList, User2 } from "lucide-react";
import { apiGetAssignments, apiGetClassrooms } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { EnrolledClassroom } from "@/components/student/types";

type EnrollmentStatus = "pending" | "approved" | "suspended" | "rejected";

type AssignmentItem = {
  id: number;
  classroom_id: number;
  deadline_at?: string | null;
  quiz?: { id: number; title?: string | null; topic?: string | null } | null;
};

function normalizeStatus(classroom: EnrolledClassroom): EnrollmentStatus {
  return (classroom.enrollment_status ?? classroom.pivot?.status ?? "approved") as EnrollmentStatus;
}

function formatDeadline(value?: string | null): string {
  if (!value) return "No deadline";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No deadline";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function StudentClassDetailPage() {
  const params = useParams<{ id: string }>();
  const [classroom, setClassroom] = useState<EnrolledClassroom | null>(null);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const classId = Number(params.id);

    async function loadData() {
      setIsLoading(true);
      try {
        const token = getStoredToken();
        if (!token || Number.isNaN(classId)) return;

        const [classRes, assignmentRes] = await Promise.all([
          apiGetClassrooms<EnrolledClassroom[]>(token),
          apiGetAssignments<AssignmentItem[]>(token),
        ]);

        if (!mounted) return;
        if (classRes.response.ok) {
          const found = classRes.data.find((c) => c.id === classId) ?? null;
          setClassroom(
            found
              ? {
                  ...found,
                  enrollment_status: normalizeStatus(found),
                }
              : null
          );
        }

        if (assignmentRes.response.ok) {
          setAssignments((assignmentRes.data ?? []).filter((a) => a.classroom_id === classId));
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  const status = useMemo(() => {
    if (!classroom) return "pending" as EnrollmentStatus;
    return normalizeStatus(classroom);
  }, [classroom]);

  if (isLoading) {
    return <div className="h-[220px] animate-pulse rounded-2xl border border-slate-100 bg-slate-50" />;
  }

  if (!classroom) {
    return (
      <section className="rounded-2xl border border-[#0f172a]/15 bg-white p-8 text-center">
        <p className="text-[22px] font-black text-[#0f172a]">Class not found.</p>
        <Link href="/student/classes" className="mt-4 inline-flex items-center gap-2 text-[13px] font-black text-indigo-600 no-underline">
          <ChevronLeft className="h-4 w-4" /> Back to My Classes
        </Link>
      </section>
    );
  }

  const isApproved = status === "approved";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/student/classes" className="inline-flex items-center gap-1.5 text-[13px] font-black text-slate-500 no-underline hover:text-indigo-600">
          <ChevronLeft className="h-4 w-4" /> Back to My Classes
        </Link>
      </div>

      <section className="rounded-[24px] border border-[#0f172a]/15 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#0f172a]/15 bg-slate-50 px-3 py-1">
              <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Class Details</span>
            </div>
            <h1 className="m-0 text-[34px] font-black leading-none tracking-[-0.02em] text-[#0f172a]">{classroom.name}</h1>
            <p className="mt-2 text-[14px] font-semibold text-slate-500">
              Teacher: <span className="text-[#0f172a]">{classroom.teacher?.fullname ?? "Educator"}</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Join Code</p>
            <p className="text-[14px] font-black text-[#0f172a]">{classroom.join_code}</p>
          </div>
        </div>
      </section>

      {!isApproved ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-[14px] font-black text-amber-800">
            {status === "pending" && "Enrollment pending: waiting for your teacher to approve your request."}
            {status === "suspended" && "Enrollment suspended: class access is currently paused by your teacher."}
            {status === "rejected" && "Enrollment rejected: please contact your teacher or request a new invite."}
          </p>
        </section>
      ) : null}

      <section className="rounded-[24px] border border-[#0f172a]/15 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 flex items-center gap-2 text-[20px] font-black text-[#0f172a]">
            <ClipboardList className="h-5 w-5 text-indigo-500" />
            Assignments
          </h2>
          <span className="text-[12px] font-black uppercase tracking-wider text-slate-400">{assignments.length} total</span>
        </div>

        {assignments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-[14px] font-bold text-slate-500">
            No assignments yet for this class.
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <article key={assignment.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[16px] font-black text-[#0f172a]">{assignment.quiz?.title || `Assignment #${assignment.id}`}</p>
                  <p className="inline-flex items-center gap-1 text-[12px] font-bold text-slate-500">
                    <CalendarClock className="h-4 w-4" />
                    {formatDeadline(assignment.deadline_at)}
                  </p>
                </div>
                <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-slate-500">
                  <User2 className="h-3.5 w-3.5" />
                  Topic: {assignment.quiz?.topic || "General"}
                </p>
                <div className="mt-3">
                  <Link
                    href={`/student/quizzes/${assignment.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 no-underline"
                  >
                    Take Quiz
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
