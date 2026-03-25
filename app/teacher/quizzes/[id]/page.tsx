"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getStoredTeacherQuizDetailById, subscribeTeacherQuizzes, type StoredTeacherQuizDetail } from "@/lib/teacher/quiz-store";
import { QuestionPreviewCard } from "@/components/teacher/quizzes/question-preview-card";
import { formatQuestionTypeLabel, orderQuestionsByType } from "@/lib/quiz/question-utils";

const QUESTIONS_PER_PAGE = 6;

function orderQuestions(quizDetail: StoredTeacherQuizDetail): StoredTeacherQuizDetail["questions"] {
  return orderQuestionsByType(quizDetail.questions);
}

export default function TeacherQuizDetailsPage() {
  const params = useParams<{ id: string }>();
  const quizId = Number(params?.id);
  const [, setStoreVersion] = useState(0);
  const [questionTypeFilter, setQuestionTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!Number.isFinite(quizId)) return;
    const unsubscribe = subscribeTeacherQuizzes(() => {
      setStoreVersion((prev) => prev + 1);
    });
    return unsubscribe;
  }, [quizId]);

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
        <Link
          href="/teacher/quizzes"
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Back to My Quizzes
        </Link>
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
        {paginatedQuestions.map((question, idx) => (
          <QuestionPreviewCard
            key={`${idx}-${question.question}`}
            question={question}
            questionNumber={pageStart + idx + 1}
          />
        ))}
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
    </div>
  );
}
