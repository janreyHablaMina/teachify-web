"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { QuizCard } from "@/components/teacher/quizzes/quiz-card";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";
import { Modal } from "@/components/ui/modal";
import {
  deleteTeacherQuizFromStore,
  getStoredTeacherQuizDetailById,
  getStoredTeacherQuizzes,
  subscribeTeacherQuizzes,
} from "@/lib/teacher/quiz-store";
import type { Quiz } from "@/components/teacher/quizzes/types";
import { apiCreateAssignment, apiDeleteQuiz, apiGetClassrooms, apiGetQuizzes, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";

type ClassroomOption = {
  id: number;
  name: string;
};

function normalizeQuestionForAssignment(question: {
  type: string;
  question: string;
  choices?: string[] | null;
  answer?: string;
  explanation?: string;
  points?: number;
}) {
  const normalizedType = String(question.type ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const normalizedChoices = Array.isArray(question.choices)
    ? question.choices.map((choice) => String(choice).trim()).filter(Boolean)
    : [];
  const choices =
    normalizedChoices.length > 0
      ? normalizedChoices
      : normalizedType === "true_false"
        ? ["True", "False"]
        : undefined;

  return {
    type: normalizedType || "multiple_choice",
    question: String(question.question ?? "").trim(),
    choices,
    answer: typeof question.answer === "string" ? question.answer : "",
    explanation: typeof question.explanation === "string" ? question.explanation : undefined,
    points: Math.max(1, Number(question.points ?? 1) || 1),
  };
}

export default function TeacherQuizzesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClassroomsLoading, setIsClassroomsLoading] = useState(false);

  const loadQuizzes = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getStoredToken();
      const { response, data } = await apiGetQuizzes<Quiz[]>(token ?? undefined);
      if (response.ok) {
        setQuizzes(data);
      }
    } catch {
      showToast("Failed to load quizzes.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  useEffect(() => {
    let mounted = true;
    async function loadClassrooms() {
      setIsClassroomsLoading(true);
      try {
        const token = getStoredToken();
        const { response, data } = await apiGetClassrooms<ClassroomOption[]>(token ?? undefined);
        if (!mounted || !response.ok) return;
        setClassrooms((data ?? []).map((item) => ({ id: item.id, name: item.name })));
      } catch {
        // noop
      } finally {
        if (mounted) setIsClassroomsLoading(false);
      }
    }
    loadClassrooms();
    return () => {
      mounted = false;
    };
  }, []);

  const [isDeleting, setIsDeleting] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);
  const [quizToAssign, setQuizToAssign] = useState<Quiz | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [deadlineInput, setDeadlineInput] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleDelete = async () => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    try {
      const token = getStoredToken();
      const { response } = await apiDeleteQuiz(token ?? undefined, quizToDelete);
      if (response.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete));
        showToast("Quiz deleted successfully.", "success");
      } else {
        showToast("Failed to delete quiz.", "error");
      }
    } catch {
      showToast("An error occurred while deleting the quiz.", "error");
    } finally {
      setIsDeleting(false);
      setQuizToDelete(null);
    }
  };

  const openAssignModal = (quiz: Quiz) => {
    setQuizToAssign(quiz);
    setSelectedClassroomId(classrooms[0]?.id ?? null);
    setDeadlineInput("");
  };

  useEffect(() => {
    if (!quizToAssign) return;
    if (selectedClassroomId !== null) return;
    if (classrooms.length === 0) return;
    setSelectedClassroomId(classrooms[0].id);
  }, [classrooms, quizToAssign, selectedClassroomId]);

  useEffect(() => {
    const assignQuizIdRaw = searchParams.get("assignQuizId");
    if (!assignQuizIdRaw) return;
    const assignQuizId = Number(assignQuizIdRaw);
    if (!Number.isFinite(assignQuizId)) return;
    const targetQuiz = quizzes.find((quiz) => quiz.id === assignQuizId);
    if (!targetQuiz) return;

    setQuizToAssign(targetQuiz);
    setSelectedClassroomId(classrooms[0]?.id ?? null);
    setDeadlineInput("");
    router.replace("/teacher/quizzes");
  }, [classrooms, quizzes, router, searchParams]);

  const handleAssignQuiz = async () => {
    if (!quizToAssign || !selectedClassroomId) {
      showToast("Please select a classroom first.", "error");
      return;
    }
    const token = getStoredToken();
    if (!token) {
      showToast("Session expired. Please log in again.", "error");
      return;
    }

    setIsAssigning(true);
    try {
      const quizDetail = getStoredTeacherQuizDetailById(quizToAssign.id);
      const payload = {
        classroom_id: selectedClassroomId,
        quiz_id: quizToAssign.id,
        deadline_at: deadlineInput ? new Date(deadlineInput).toISOString() : null,
        ...(quizDetail
          ? {
              quiz_payload: {
                title: quizDetail.title,
                topic: quizDetail.topic,
                type: quizDetail.type,
                questions: quizDetail.questions.map((question) => normalizeQuestionForAssignment(question)),
              },
            }
          : {}),
      };
      let { response, data } = await apiCreateAssignment(token, payload);

      // Some generated/local quizzes don't exist in backend quizzes table.
      // Retry with quiz_payload only (without quiz_id) so backend can create from payload.
      if (!response.ok && quizDetail) {
        const fallbackPayload = {
          classroom_id: selectedClassroomId,
          deadline_at: deadlineInput ? new Date(deadlineInput).toISOString() : null,
          quiz_payload: {
            title: quizDetail.title,
            topic: quizDetail.topic,
            type: quizDetail.type,
            questions: quizDetail.questions.map((question) => normalizeQuestionForAssignment(question)),
          },
        };
        ({ response, data } = await apiCreateAssignment(token, fallbackPayload));
      }

      if (!response.ok) {
        showToast(getApiErrorMessage(response, data, "Failed to assign quiz."), "error");
        return;
      }
      showToast("Quiz assigned successfully.", "success");
      setQuizToAssign(null);
    } catch {
      showToast("Failed to assign quiz.", "error");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.09em] text-slate-500 mb-1">Dashboard / Quizzes</p>
          <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-slate-900">My Generated Quizzes</h2>
          <p className="mt-2 text-[15px] font-bold text-slate-500">Access and manage all your past AI-generated content.</p>
        </div>
        <Link 
          href="/teacher/generate"
          className="rounded-xl border-2 border-[#0f172a] bg-[#fef08a] px-8 py-4 text-[14px] font-black uppercase tracking-wider text-[#0f172a] shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0"
        >
          + Create New Quiz
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {quizzes.map((quiz) => (
          <QuizCard 
            key={quiz.id} 
            quiz={quiz} 
            onAssignClick={openAssignModal}
            onDeleteClick={(id) => setQuizToDelete(id)}
            isDeleting={isDeleting && quizToDelete === quiz.id}
          />
        ))}

        {quizzes.length === 0 && (
          <div className="col-span-full rounded-[36px] border-2 border-[#0f172a]/10 bg-white p-4 md:p-7">
            <div className="relative overflow-hidden rounded-[28px] border-2 border-[#0f172a]/15 bg-gradient-to-br from-[#fffbe6] via-[#f8fafc] to-[#ecfeff] p-8 md:p-12">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#fef08a]/40 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-[#67e8f9]/30 blur-2xl" />

              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <span className="inline-flex items-center rounded-full border border-[#0f172a]/20 bg-white/80 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-700">
                  quiz workspace
                </span>
                <h3 className="mt-4 m-0 text-[30px] leading-[1.05] font-black tracking-[-0.03em] text-[#0f172a]">
                  Let&apos;s create your first quiz
                </h3>
                <p className="mt-3 mb-0 max-w-xl text-[15px] font-semibold leading-relaxed text-slate-600">
                  Upload a lesson PDF, choose a question style, and publish in minutes.
                  Your quizzes will show up here with quick actions to assign, edit, and reuse.
                </p>

                <div className="mt-7 grid w-full gap-3 text-left md:grid-cols-3">
                  {[
                    "Upload lesson document",
                    "Generate AI questions",
                    "Assign to your class",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="rounded-2xl border border-[#0f172a]/10 bg-white/80 px-4 py-3"
                    >
                      <p className="m-0 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                        Step {index + 1}
                      </p>
                      <p className="mt-1 mb-0 text-[14px] font-extrabold text-[#0f172a]">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/teacher/generate"
                    className="inline-flex min-w-[190px] items-center justify-center rounded-xl border-2 border-[#0f172a] bg-[#0f172a] px-8 py-3 text-[13px] font-black uppercase tracking-wider text-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    Generate Now
                  </Link>
                  <Link
                    href="/teacher/classes"
                    className="inline-flex min-w-[190px] items-center justify-center rounded-xl border-2 border-[#0f172a] bg-[#fef08a] px-8 py-3 text-[13px] font-black uppercase tracking-wider text-[#0f172a] shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-1 hover:shadow-[5px_5px_0_#0f172a]"
                  >
                    Manage Classes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={quizToDelete !== null}
        onClose={() => setQuizToDelete(null)}
        onConfirm={handleDelete}
        title="Delete this quiz?"
        message="This action cannot be undone. You will lose all questions and settings for this quiz."
        confirmLabel="Yes, Delete Quiz"
        isLoading={isDeleting}
        variant="danger"
      />

      <Modal
        isOpen={quizToAssign !== null}
        onClose={() => setQuizToAssign(null)}
        title={quizToAssign ? `Assign: ${quizToAssign.title}` : "Assign Quiz"}
        footer={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuizToAssign(null)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssignQuiz}
              disabled={isAssigning || !selectedClassroomId}
              className="rounded-lg border border-emerald-300 bg-emerald-100 px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-emerald-900 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAssigning ? "Assigning..." : "Assign Quiz"}
            </button>
          </div>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Classroom</label>
            <select
              value={selectedClassroomId ?? ""}
              disabled={isClassroomsLoading || classrooms.length === 0}
              onChange={(e) => {
                const nextId = Number(e.target.value);
                setSelectedClassroomId(Number.isFinite(nextId) ? nextId : null);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] font-semibold text-slate-700 outline-none focus:border-emerald-500"
            >
              {classrooms.length === 0 ? (
                <option value="">{isClassroomsLoading ? "Loading classrooms..." : "No classrooms available"}</option>
              ) : (
                classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Deadline (optional)</label>
            <input
              type="datetime-local"
              value={deadlineInput}
              onChange={(e) => setDeadlineInput(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] font-semibold text-slate-700 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

