"use client";

import { useState } from "react";
import Link from "next/link";
import { QuizCard } from "@/components/teacher/quizzes/quiz-card";
import { Quiz } from "@/components/teacher/quizzes/types";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    { id: 1, title: "Modern Physics - Quantum Mechanics", topic: "Physics", type: "file", questions_count: 20, created_at: "2026-03-10T10:00:00Z" },
    { id: 2, title: "Biology: Photosynthesis", topic: "Biology", type: "file", questions_count: 15, created_at: "2026-03-12T14:30:00Z" },
    { id: 3, title: "European History: The Renaissance", topic: "History", type: "manual", questions_count: 50, created_at: "2026-03-14T09:15:00Z" },
    { id: 4, title: "Chemical Bonding Fundamentals", topic: "Chemistry", type: "file", questions_count: 25, created_at: "2026-03-15T16:45:00Z" },
    { id: 5, title: "English Literature: Macbeth Act 1", topic: "English", type: "manual", questions_count: 10, created_at: "2026-03-16T11:20:00Z" },
  ]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);

  const handleDelete = () => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    // Mimic API call
    setTimeout(() => {
      setQuizzes(quizzes.filter(q => q.id !== quizToDelete));
      setIsDeleting(false);
      setQuizToDelete(null);
    }, 1000);
  };

  return (
    <div className="w-full">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="m-0 text-[13px] font-bold uppercase tracking-[0.1em] text-slate-500">Dashboard / Quizzes</p>
          <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">My Generated Quizzes</h2>
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
    </div>
  );
}

