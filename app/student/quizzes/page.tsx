"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, ClipboardList, Clock3, Filter, Sparkles, Timer, AlertTriangle } from "lucide-react";
import { apiGetAssignments } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";
import { formatDeadline, getDeadlineStatus } from "./lib/deadline";
import { EXAM_START_RULES_MESSAGE_LIST } from "./lib/exam-policy";
import type { AssignmentItem, DeadlineFilter } from "./lib/types";

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

  const overview = useMemo(() => {
    const dueSoon = assignments.filter((item) => getDeadlineStatus(item.deadline_at) === "due_soon").length;
    const overdue = assignments.filter((item) => getDeadlineStatus(item.deadline_at) === "overdue").length;
    return {
      total: assignments.length,
      dueSoon,
      overdue,
    };
  }, [assignments]);

  const filterOptions: Array<{ id: DeadlineFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "due_soon", label: "Due Soon" },
    { id: "overdue", label: "Overdue" },
    { id: "no_deadline", label: "No Deadline" },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-[22px] border-2 border-slate-900 bg-[linear-gradient(135deg,#ecfeff_0%,#eef2ff_45%,#f5f3ff_100%)] p-6">
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-cyan-300/30 blur-2xl" />
        <div className="pointer-events-none absolute bottom-[-40px] left-[25%] h-36 w-36 rounded-full bg-violet-300/35 blur-2xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1 rounded-full border border-slate-300/80 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              Education / My Quizzes
            </p>
            <h1 className="mt-3 text-[36px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Assigned Quizzes</h1>
            <p className="mt-2 text-[14px] font-bold text-slate-600">Your active assessments, deadlines, and one-tap exam launch in one place.</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-emerald-800">
                <ClipboardList className="h-3.5 w-3.5" />
                Total {overview.total}
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-amber-800">
                <Timer className="h-3.5 w-3.5" />
                Due Soon {overview.dueSoon}
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-rose-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                Overdue {overview.overdue}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-5 border-t border-slate-300/70 pt-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
            Showing <span className="text-slate-900">{filteredAssignments.length}</span> quiz
            {filteredAssignments.length === 1 ? "" : "zes"} with current filter
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-slate-600">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </span>
          {filterOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] transition ${
                filter === option.id
                  ? "border-violet-700 bg-violet-100 text-violet-900 shadow-[2px_2px_0_#5b21b6]"
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
            <div key={i} className="h-[200px] animate-pulse rounded-xl border border-slate-100 bg-slate-50" />
          ))}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-[20px] font-black text-[#0f172a]">No quizzes found</p>
          <p className="mt-2 text-[14px] font-semibold text-slate-500">Try a different filter or check with your teacher for new assignments.</p>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredAssignments.map((assignment) => {
            const deadlineStatus = getDeadlineStatus(assignment.deadline_at);
            const statusClass =
              deadlineStatus === "overdue"
                ? "border-rose-300 bg-rose-100 text-rose-800"
                : deadlineStatus === "due_soon"
                  ? "border-amber-300 bg-amber-100 text-amber-800"
                  : deadlineStatus === "upcoming"
                    ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                    : "border-slate-200 bg-slate-50 text-slate-600";
            const accentClass =
              deadlineStatus === "overdue"
                ? "from-rose-500 to-rose-300"
                : deadlineStatus === "due_soon"
                  ? "from-amber-500 to-amber-300"
                  : deadlineStatus === "upcoming"
                    ? "from-emerald-500 to-emerald-300"
                    : "from-slate-400 to-slate-200";

            return (
              <article key={assignment.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-[0_10px_20px_rgba(15,23,42,0.06)]">
                <div className={`h-1.5 w-full bg-gradient-to-r ${accentClass}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="m-0 truncate text-[21px] font-black leading-tight text-[#0f172a]">
                        {assignment.quiz?.title || `Quiz #${assignment.id}`}
                      </p>
                      <p className="mt-2 inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600">
                        <ClipboardList className="mr-1 inline h-3.5 w-3.5" />
                        {assignment.quiz?.topic || "General"}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] ${statusClass}`}>
                      {deadlineStatus === "none"
                        ? "No Deadline"
                        : deadlineStatus === "due_soon"
                          ? "Due Soon"
                          : deadlineStatus === "overdue"
                            ? "Overdue"
                            : "Upcoming"}
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-3">
                    <p className="m-0 text-[13px] font-semibold text-slate-600">
                      <span className="font-black text-slate-500">Class:</span>{" "}
                      <span className="font-bold text-slate-700">{assignment.classroom?.name || `Class #${assignment.classroom_id}`}</span>
                    </p>
                    <p className="mt-2 m-0 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-600">
                      <CalendarClock className="h-4 w-4 text-slate-400" />
                      <span>{formatDeadline(assignment.deadline_at)}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setConfirmAssignment(assignment)}
                      className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-[linear-gradient(135deg,#e0e7ff_0%,#ede9fe_100%)] px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-800 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0f172a]"
                    >
                      <Clock3 className="h-3.5 w-3.5" />
                      Take Quiz
                    </button>
                  </div>
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
