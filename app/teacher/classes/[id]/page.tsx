"use client";

import { StudentList } from "@/components/teacher/classes/student-list";
import { Student } from "@/components/teacher/classes/types";
import { Users, GraduationCap, ClipboardList, TrendingUp, UserPlus, Activity, AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";
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
  assignments?: AssignmentTracking[];
};

type AssignmentExamStatus = {
  student_id: number;
  student_name: string;
  student_email: string;
  status: "submitted" | "not_taken" | "in_progress" | "needs_attention";
  submission_id?: number | null;
  submitted_at?: string | null;
  score?: number | null;
  completion_rate?: number | null;
  answered_items?: number | null;
  graded_items?: number | null;
};

type AssignmentTracking = {
  id: number;
  classroom_id: number;
  deadline_at?: string | null;
  created_at?: string | null;
  quiz?: {
    id: number;
    title?: string | null;
    topic?: string | null;
    question_count?: number | null;
  } | null;
  status_counts?: {
    submitted?: number;
    not_taken?: number;
    in_progress?: number;
    needs_attention?: number;
  } | null;
  student_exam_statuses?: AssignmentExamStatus[];
};

export default function TeacherClassDetails({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { showToast } = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [classroom, setClassroom] = useState<ClassroomDetailsApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStudentId, setUpdatingStudentId] = useState<number | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [examStatusFilter, setExamStatusFilter] = useState<"all" | "submitted" | "not_taken" | "in_progress" | "needs_attention">("all");
  const [examSearch, setExamSearch] = useState("");

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
  const assignmentsWithQuiz = useMemo(
    () => (classroom?.assignments ?? []).filter((assignment) => assignment.quiz),
    [classroom?.assignments]
  );
  const selectedAssignment = useMemo(() => {
    if (assignmentsWithQuiz.length === 0) return null;
    if (selectedAssignmentId === null) return assignmentsWithQuiz[0];
    return assignmentsWithQuiz.find((assignment) => assignment.id === selectedAssignmentId) ?? assignmentsWithQuiz[0];
  }, [assignmentsWithQuiz, selectedAssignmentId]);
  const selectedAssignmentCounts = selectedAssignment?.status_counts ?? null;
  const selectedAssignmentStatuses = useMemo(() => {
    const base = selectedAssignment?.student_exam_statuses ?? [];
    return base.filter((entry) => {
      if (examStatusFilter !== "all" && entry.status !== examStatusFilter) return false;
      const query = examSearch.trim().toLowerCase();
      if (!query) return true;
      return entry.student_name.toLowerCase().includes(query) || entry.student_email.toLowerCase().includes(query);
    });
  }, [examSearch, examStatusFilter, selectedAssignment?.student_exam_statuses]);

  useEffect(() => {
    if (assignmentsWithQuiz.length === 0) {
      setSelectedAssignmentId(null);
      return;
    }

    if (!selectedAssignmentId || !assignmentsWithQuiz.some((assignment) => assignment.id === selectedAssignmentId)) {
      setSelectedAssignmentId(assignmentsWithQuiz[0].id);
    }
  }, [assignmentsWithQuiz, selectedAssignmentId]);

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

  const getExamStatusLabel = (status: AssignmentExamStatus["status"]) => {
    switch (status) {
      case "submitted":
        return "Submitted";
      case "not_taken":
        return "Not Taken";
      case "in_progress":
        return "Currently Taking";
      case "needs_attention":
        return "Needs Attention";
      default:
        return "Unknown";
    }
  };

  const getExamStatusBadge = (status: AssignmentExamStatus["status"]) => {
    switch (status) {
      case "submitted":
        return "border-emerald-300 bg-emerald-50 text-emerald-700";
      case "not_taken":
        return "border-slate-300 bg-slate-100 text-slate-700";
      case "in_progress":
        return "border-sky-300 bg-sky-50 text-sky-700";
      case "needs_attention":
        return "border-amber-300 bg-amber-50 text-amber-700";
      default:
        return "border-slate-300 bg-slate-100 text-slate-700";
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

      <section className="mb-12 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="m-0 text-[22px] font-black tracking-tight text-slate-900">Assigned Exams</h3>
            <p className="mt-1 text-[13px] font-semibold text-slate-500">
              Click an exam to see who submitted, who has not taken it, who is currently taking, and who needs attention.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800">
            Needs Attention is inferred when score or completion looks unusually low.
          </div>
        </div>

        {assignmentsWithQuiz.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-[14px] font-semibold text-slate-500">
            No exams are assigned to this class yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {assignmentsWithQuiz.map((assignment) => {
                const counts = assignment.status_counts ?? {};
                const isSelected = selectedAssignment?.id === assignment.id;
                return (
                  <button
                    key={assignment.id}
                    type="button"
                    onClick={() => setSelectedAssignmentId(assignment.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-teal-400 bg-teal-50 shadow-[0_0_0_2px_rgba(20,184,166,0.14)]"
                        : "border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40"
                    }`}
                  >
                    <p className="m-0 text-[15px] font-black text-slate-900">{assignment.quiz?.title || `Exam #${assignment.id}`}</p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-500">
                      {assignment.quiz?.question_count ?? 0} items
                      {" | "}
                      Deadline: {assignment.deadline_at ? new Date(assignment.deadline_at).toLocaleString() : "No deadline"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold">
                      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">
                        Submitted: {counts.submitted ?? 0}
                      </span>
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-slate-700">
                        Not Taken: {counts.not_taken ?? 0}
                      </span>
                      <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-sky-700">
                        Taking: {counts.in_progress ?? 0}
                      </span>
                      <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700">
                        Needs Attention: {counts.needs_attention ?? 0}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedAssignment ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="m-0 text-[20px] font-black text-slate-900">
                      {selectedAssignment.quiz?.title || `Exam #${selectedAssignment.id}`} - Student Status
                    </h4>
                    <p className="mt-1 text-[12px] font-semibold text-slate-500">
                      Showing {selectedAssignmentStatuses.length} student{selectedAssignmentStatuses.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={examSearch}
                      onChange={(event) => setExamSearch(event.target.value)}
                      placeholder="Search student..."
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-700 outline-none focus:border-teal-400"
                    />
                    <select
                      value={examStatusFilter}
                      onChange={(event) =>
                        setExamStatusFilter(
                          event.target.value as "all" | "submitted" | "not_taken" | "in_progress" | "needs_attention"
                        )
                      }
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-700 outline-none focus:border-teal-400"
                    >
                      <option value="all">All Statuses</option>
                      <option value="submitted">Submitted</option>
                      <option value="not_taken">Not Taken</option>
                      <option value="in_progress">Currently Taking</option>
                      <option value="needs_attention">Needs Attention</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-emerald-700">Submitted</p>
                    <p className="mt-1 text-[24px] font-black text-emerald-800">{selectedAssignmentCounts?.submitted ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-100 p-3">
                    <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-600">Not Taken</p>
                    <p className="mt-1 text-[24px] font-black text-slate-700">{selectedAssignmentCounts?.not_taken ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
                    <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-sky-700">Currently Taking</p>
                    <p className="mt-1 text-[24px] font-black text-sky-800">{selectedAssignmentCounts?.in_progress ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-amber-700">Needs Attention</p>
                    <p className="mt-1 text-[24px] font-black text-amber-800">{selectedAssignmentCounts?.needs_attention ?? 0}</p>
                  </div>
                </div>

                {selectedAssignmentStatuses.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-[13px] font-semibold text-slate-500">
                    No students match this filter.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedAssignmentStatuses.map((entry) => (
                      <article key={`${selectedAssignment.id}-${entry.student_id}`} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="m-0 text-[14px] font-black text-slate-900">{entry.student_name}</p>
                            <p className="mt-0.5 text-[12px] font-semibold text-slate-500">{entry.student_email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${getExamStatusBadge(entry.status)}`}>
                              {getExamStatusLabel(entry.status)}
                            </span>
                            {entry.status === "submitted" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : null}
                            {entry.status === "in_progress" ? <Clock3 className="h-4 w-4 text-sky-600" /> : null}
                            {entry.status === "needs_attention" ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : null}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4 text-[12px] font-semibold text-slate-600">
                          <span>
                            Score: <strong className="text-slate-900">{typeof entry.score === "number" ? `${Math.round(entry.score)}%` : "-"}</strong>
                          </span>
                          <span>
                            Completion: <strong className="text-slate-900">{typeof entry.completion_rate === "number" ? `${entry.completion_rate}%` : "-"}</strong>
                          </span>
                          <span>
                            Answered: <strong className="text-slate-900">{typeof entry.answered_items === "number" ? entry.answered_items : "-"}</strong>
                            {` / `}
                            <strong className="text-slate-900">{typeof entry.graded_items === "number" ? entry.graded_items : "-"}</strong>
                          </span>
                          <span>
                            Submitted At: <strong className="text-slate-900">{entry.submitted_at ? new Date(entry.submitted_at).toLocaleString() : "-"}</strong>
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </>
        )}
      </section>

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
