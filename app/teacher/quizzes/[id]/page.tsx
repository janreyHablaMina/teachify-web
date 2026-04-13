"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import {
  getStoredTeacherQuizDetailById,
  subscribeTeacherQuizzes,
  type StoredTeacherQuizDetail,
  updateStoredTeacherQuizQuestions,
} from "@/lib/teacher/quiz-store";
import { QuestionPreviewCard } from "@/components/teacher/quizzes/question-preview-card";
import { formatQuestionTypeLabel, orderQuestionsByType } from "@/lib/quiz/question-utils";
import { apiCreateAssignment, apiGetClassrooms, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";

const QUESTIONS_PER_PAGE = 6;
type ClassroomOption = { id: number; name: string };

function orderQuestions(quizDetail: StoredTeacherQuizDetail): StoredTeacherQuizDetail["questions"] {
  return orderQuestionsByType(quizDetail.questions);
}

function normalizeQuestionForAssignment(question: StoredTeacherQuizDetail["questions"][number]) {
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

export default function TeacherQuizDetailsPage() {
  const { showToast } = useToast();
  const params = useParams<{ id: string }>();
  const quizId = Number(params?.id);
  const [, setStoreVersion] = useState(0);
  const [questionTypeFilter, setQuestionTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([]);
  const [isClassroomsLoading, setIsClassroomsLoading] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [deadlineInput, setDeadlineInput] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(quizId)) return;
    const unsubscribe = subscribeTeacherQuizzes(() => {
      setStoreVersion((prev) => prev + 1);
    });
    return unsubscribe;
  }, [quizId]);

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

  const quizDetail = Number.isFinite(quizId) ? getStoredTeacherQuizDetailById(quizId) : null;

  const createdAtLabel = useMemo(() => {
    if (!quizDetail || !quizDetail.created_at) return "Unknown";
    return new Date(quizDetail.created_at).toLocaleString();
  }, [quizDetail]);
  const orderedQuestions = useMemo(
    () => (quizDetail ? orderQuestions(quizDetail) : []),
    [quizDetail]
  );
  const availableQuestionTypeFilters = useMemo(
    () => ["all", ...Array.from(new Set(orderedQuestions.map((q) => q.type)))],
    [orderedQuestions]
  );
  const filteredQuestions = useMemo(() => {
    if (questionTypeFilter === "all") return orderedQuestions;
    return orderedQuestions.filter((question) => question.type === questionTypeFilter);
  }, [orderedQuestions, questionTypeFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(pageStart, pageStart + QUESTIONS_PER_PAGE);
  const updateQuestionPoints = (sourceIndex: number, nextPoints: number) => {
    if (!quizDetail) return;
    if (sourceIndex < 0 || sourceIndex >= quizDetail.questions.length) return;
    const normalizedPoints = Math.max(1, Math.min(100, Math.floor(nextPoints)));
    const nextQuestions = quizDetail.questions.map((question, index) =>
      index === sourceIndex
        ? {
            ...question,
            points: normalizedPoints,
          }
        : question
    );
    updateStoredTeacherQuizQuestions(quizDetail.id, nextQuestions);
  };
  const openAssignModal = () => {
    setIsAssignModalOpen(true);
    setSelectedClassroomId(classrooms[0]?.id ?? null);
    setDeadlineInput("");
  };
  useEffect(() => {
    if (!isAssignModalOpen) return;
    if (selectedClassroomId !== null) return;
    if (classrooms.length === 0) return;
    setSelectedClassroomId(classrooms[0].id);
  }, [classrooms, isAssignModalOpen, selectedClassroomId]);
  const handleAssignQuiz = async () => {
    if (!quizDetail || !selectedClassroomId) {
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
      const payload = {
        classroom_id: selectedClassroomId,
        quiz_id: quizDetail.id,
        deadline_at: deadlineInput ? new Date(deadlineInput).toISOString() : null,
        quiz_payload: {
          title: quizDetail.title,
          topic: quizDetail.topic,
          type: quizDetail.type,
          questions: quizDetail.questions.map((question) => normalizeQuestionForAssignment(question)),
        },
      };
      let { response, data } = await apiCreateAssignment(token, payload);

      // Local/generated quizzes may not exist in backend yet; retry with payload-only.
      if (!response.ok) {
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
      setIsAssignModalOpen(false);
    } catch {
      showToast("Failed to assign quiz.", "error");
    } finally {
      setIsAssigning(false);
    }
  };

  if (!Number.isFinite(quizId) || !quizDetail) {
    return (
      <div className="w-full">
        <header className="mb-8">
          <p className="m-0 text-[13px] font-bold uppercase tracking-[0.1em] text-slate-500">Dashboard / Quizzes / Details</p>
          <h2 className="text-[30px] font-black leading-none tracking-[-0.03em] text-slate-900">Quiz not found</h2>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="m-0 text-[16px] font-bold text-slate-700">This quiz might have been deleted or is unavailable.</p>
          <Link
            href="/teacher/quizzes"
            className="mt-5 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back to My Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-[12px] font-black uppercase tracking-[0.09em] text-slate-500">Dashboard / Quizzes / Details</p>
          <h2 className="mt-1 text-[30px] font-black leading-tight tracking-[-0.03em] text-slate-900">{quizDetail.title}</h2>
          <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
            Difficulty: {quizDetail.difficulty} | {filteredQuestions.length} of {orderedQuestions.length} Questions | Created: {createdAtLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openAssignModal}
            className="inline-flex items-center rounded-lg border border-emerald-300 bg-emerald-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-emerald-900 transition hover:bg-emerald-200"
          >
            Assign
          </button>
          <Link
            href="/teacher/quizzes"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back to My Quizzes
          </Link>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {availableQuestionTypeFilters.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setQuestionTypeFilter(type);
              setCurrentPage(1);
            }}
            className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] transition ${
              questionTypeFilter === type
                ? "border-emerald-600 bg-emerald-100 text-emerald-900"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
            }`}
          >
            {type === "all" ? "All" : formatQuestionTypeLabel(type)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {paginatedQuestions.map((question, idx) => {
          const sourceIndex = quizDetail.questions.indexOf(question);
          return (
            <QuestionPreviewCard
              key={`${idx}-${question.question}`}
              question={question}
              questionNumber={pageStart + idx + 1}
              onPointsChange={sourceIndex >= 0 ? (nextPoints) => updateQuestionPoints(sourceIndex, nextPoints) : undefined}
            />
          );
        })}
      </div>

      {filteredQuestions.length > QUESTIONS_PER_PAGE ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage <= 1}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage >= totalPages}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign: ${quizDetail.title}`}
        footer={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
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
              onChange={(event) => {
                const nextId = Number(event.target.value);
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
              onChange={(event) => setDeadlineInput(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] font-semibold text-slate-700 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
