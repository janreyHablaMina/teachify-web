"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { apiCreateAssignment, apiGetClassrooms, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";

type ClassroomOption = {
  id: number;
  name: string;
};

export default function TeacherQuizzesPage() {
  const { showToast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => getStoredTeacherQuizzes());
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([]);
  const [isClassroomsLoading, setIsClassroomsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeTeacherQuizzes(() => {
      setQuizzes(getStoredTeacherQuizzes());
    });
    return unsubscribe;
  }, []);

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

  const handleDelete = () => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    deleteTeacherQuizFromStore(quizToDelete);
    setIsDeleting(false);
    setQuizToDelete(null);
  };

  const openAssignModal = (quiz: Quiz) => {
    setQuizToAssign(quiz);
    setSelectedClassroomId(classrooms[0]?.id ?? null);
    setDeadlineInput("");
  };

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
                questions: quizDetail.questions.map((question) => ({
                  type: question.type,
                  question: question.question,
                  choices: question.choices,
                  answer: question.answer,
                  explanation: question.explanation,
                })),
              },
            }
          : {}),
      };
      const { response, data } = await apiCreateAssignment(token, payload);
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
          <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-[32px] border-2 border-dashed border-[#0f172a]/10 bg-slate-50/50 py-20 text-center">
            <h3 className="m-0 text-[24px] font-black tracking-tight text-[#0f172a]">No quizzes found</h3>
            <p className="m-0 text-[15px] font-bold text-slate-400">Start by generating your first quiz from a lesson PDF.</p>
            <Link 
              href="/teacher/generate"
              className="mt-4 rounded-xl border-2 border-[#0f172a] bg-[#0f172a] px-8 py-3 text-[13px] font-black uppercase tracking-wider text-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              Generate Now
            </Link>
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
              onChange={(e) => setSelectedClassroomId(Number(e.target.value))}
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

