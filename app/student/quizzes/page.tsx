"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, ClipboardList, Clock3, Filter } from "lucide-react";
import { apiGetAssignments } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";
import { formatDeadline, getDeadlineStatus } from "./deadline-utils";
import { EXAM_START_RULES_MESSAGE_LIST } from "./exam-policy";

type AssignmentItem = {
  id: number;
  classroom_id: number;
  deadline_at?: string | null;
  quiz?: { id: number; title?: string | null; topic?: string | null } | null;
  classroom?: { id: number; name?: string | null } | null;
};

type DeadlineFilter = "all" | "due_soon" | "overdue" | "no_deadline";

export default function StudentQuizzesPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<DeadlineFilter>("all");
  const [confirmAssignment, setConfirmAssignment] = useState<AssignmentItem | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadAssignments() {
      setIsLoading(true);
      try {
        const token = getStoredToken();
        if (!token) return;
        const { response, data } = await apiGetAssignments<AssignmentItem[]>(token);
        if (!mounted || !response.ok) return;
        setAssignments(data ?? []);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadAssignments();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const status = getDeadlineStatus(assignment.deadline_at);
      if (filter === "all") return true;
      if (filter === "due_soon") return status === "due_soon";
      if (filter === "overdue") return status === "overdue";
      if (filter === "no_deadline") return status === "none";
      return true;
    });
  }, [assignments, filter]);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.1em] text-slate-500">Education / My Quizzes</p>
            <h1 className="mt-1 text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Assigned Quizzes</h1>
            <p className="mt-2 text-[14px] font-semibold text-slate-500">Track all quizzes assigned by your teachers in one place.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Total</p>
            <p className="text-[24px] font-black leading-none text-[#0f172a]">{filteredAssignments.length}</p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </span>
          {[
            { id: "all", label: "All" },
            { id: "due_soon", label: "Due Soon" },
            { id: "overdue", label: "Overdue" },
            { id: "no_deadline", label: "No Deadline" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id as DeadlineFilter)}
              className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] transition ${
                filter === option.id
                  ? "border-indigo-600 bg-indigo-100 text-indigo-900"
                  : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[170px] animate-pulse rounded-xl border border-slate-100 bg-slate-50" />
          ))}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-[20px] font-black text-[#0f172a]">No quizzes found</p>
          <p className="mt-2 text-[14px] font-semibold text-slate-500">Try a different filter or check with your teacher for new assignments.</p>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredAssignments.map((assignment) => {
            const deadlineStatus = getDeadlineStatus(assignment.deadline_at);
            const statusClass =
              deadlineStatus === "overdue"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : deadlineStatus === "due_soon"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : deadlineStatus === "upcoming"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600";

            return (
              <article key={assignment.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="m-0 text-[18px] font-black leading-tight text-[#0f172a]">
                      {assignment.quiz?.title || `Quiz #${assignment.id}`}
                    </p>
                    <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      <ClipboardList className="mr-1 inline h-3.5 w-3.5" />
                      {assignment.quiz?.topic || "General"}
                    </p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] ${statusClass}`}>
                    {deadlineStatus === "none"
                      ? "No Deadline"
                      : deadlineStatus === "due_soon"
                        ? "Due Soon"
                        : deadlineStatus === "overdue"
                          ? "Overdue"
                          : "Upcoming"}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-[13px] font-semibold text-slate-600">
                  <p className="m-0">
                    <span className="font-black text-slate-500">Class:</span> {assignment.classroom?.name || `Class #${assignment.classroom_id}`}
                  </p>
                  <p className="m-0 inline-flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4 text-slate-400" />
                    <span>{formatDeadline(assignment.deadline_at)}</span>
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setConfirmAssignment(assignment)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    <Clock3 className="h-3.5 w-3.5" />
                    Take Quiz
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!confirmAssignment}
        onClose={() => setConfirmAssignment(null)}
        onConfirm={() => {
          if (!confirmAssignment) return;
          router.push(`/student/quizzes/${confirmAssignment.id}?start=1`);
        }}
        title="Start Exam?"
        message={`${EXAM_START_RULES_MESSAGE_LIST}${confirmAssignment ? ` Quiz: ${confirmAssignment.quiz?.title || `Quiz #${confirmAssignment.id}`}.` : ""}`}
        confirmLabel="Yes, Start Exam"
        cancelLabel="Cancel"
        variant="accent"
      />
    </div>
  );
}
