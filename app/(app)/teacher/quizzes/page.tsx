"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";
import Link from "next/link";

type Quiz = {
  id: number;
  title: string;
  topic: string;
  type?: string;
  questions_count?: number;
  created_at: string;
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteQuiz, setPendingDeleteQuiz] = useState<Quiz | null>(null);

  const sortedQuizzes = useMemo(
    () => [...quizzes].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [quizzes]
  );

  async function loadQuizzes() {
    setLoading(true);
    try {
      const res = await api.get("/api/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setQuizzes([]);
        setStatusMessage("");
        setStatusType("");
        return;
      }
      console.error("Failed to fetch quizzes", err);
      setStatusMessage("Failed to load quizzes.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (!statusMessage) return;

    const timer = window.setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  function requestDeleteQuiz(quizId: number) {
    const target = quizzes.find((q) => q.id === quizId) ?? null;
    setPendingDeleteQuiz(target);
  }

  async function handleDeleteQuiz(quizId: number) {
    setDeletingId(quizId);
    setStatusMessage("");
    setStatusType("");

    try {
      await api.delete(`/api/quizzes/${quizId}`);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      setPendingDeleteQuiz(null);
      setStatusMessage("Quiz deleted successfully.");
      setStatusType("success");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setStatusMessage("Your session has expired. Please sign in again.");
        setStatusType("error");
        return;
      }
      console.error("Failed to delete quiz", err);
      setStatusMessage("Failed to delete quiz.");
      setStatusType("error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-2 py-2 md:px-4">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="space-y-2">
          <p className="m-0 text-xs font-black uppercase tracking-[0.08em] text-slate-500">Dashboard / Quizzes</p>
          <h2 className="m-0 text-4xl font-black leading-none tracking-tight text-slate-900 md:text-5xl">My Generated Quizzes</h2>
          <p className="m-0 text-base font-semibold text-slate-600">Saved quizzes are available anytime.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-900 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-px"
            type="button"
            onClick={loadQuizzes}
          >
            Refresh
          </button>
          <Link
            href="/teacher/generate"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-yellow-200 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-900 no-underline shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-px"
          >
            + Create New Quiz
          </Link>
        </div>
      </header>

      {statusMessage ? (
        <p
          className={`m-0 w-fit rounded-xl border-2 border-slate-900 px-3 py-2 text-sm font-semibold shadow-[4px_4px_0_#0f172a] ${
            statusType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {statusMessage}
        </p>
      ) : null}

      {loading ? (
        <p className="m-0 text-slate-600">Loading your quizzes...</p>
      ) : sortedQuizzes.length === 0 ? (
        <div className="mx-auto grid max-w-xl place-items-center gap-3 rounded-xl border-2 border-slate-900 bg-gradient-to-b from-white to-slate-50 px-6 py-10 text-center text-slate-600 shadow-[6px_6px_0_#0f172a]">
          <div className="grid h-14 w-14 place-items-center rounded-xl border-2 border-slate-900 bg-yellow-200 text-slate-900" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M9 7h7M9 11h7M9 15h4" />
            </svg>
          </div>
          <h3 className="m-0 text-xl font-black text-slate-900">No quizzes yet</h3>
          <p className="m-0 text-sm font-semibold">Create your first quiz from a lesson PDF and it will appear here.</p>
          <Link
            href="/teacher/generate"
            className="rounded-lg border-2 border-slate-900 bg-yellow-200 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-900 no-underline shadow-[3px_3px_0_#0f172a]"
          >
            Generate My First Quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {sortedQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[5px_5px_0_#0f172a] transition hover:-translate-y-px hover:shadow-[7px_7px_0_#0f172a]"
            >
              <Link href={`/teacher/quizzes/${quiz.id}`} className="grid gap-4 text-inherit no-underline">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="m-0 pr-2 text-2xl font-black leading-tight text-slate-900">{quiz.title}</h3>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:border-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={(event) => {
                      event.preventDefault();
                      requestDeleteQuiz(quiz.id);
                    }}
                    disabled={deletingId === quiz.id}
                    aria-label="Delete quiz"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="m-0 truncate text-sm font-semibold text-slate-600">
                    <span className="font-black text-slate-700">Topic:</span> {quiz.topic}
                  </p>
                </div>

                <div className="flex items-end justify-between gap-3 border-t border-slate-200 pt-3">
                  <div className="grid gap-2">
                    <span className="w-fit rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-900">
                      {quiz.questions_count ?? 0} Questions
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Source: {quiz.type === "file" ? "PDF upload" : "Manual"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="m-0 text-xs font-semibold text-slate-700">
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </p>
                    <p className="m-0 text-xs font-black text-sky-700">View details</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {pendingDeleteQuiz ? (
        <div className="fixed inset-0 z-[1200] grid place-items-center bg-slate-900/35 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-quiz-title">
          <div className="w-full max-w-[440px] -rotate-[0.4deg] border-2 border-slate-900 bg-white p-5 shadow-[10px_10px_0_#0f172a]">
            <p className="m-0 mb-2 w-fit border border-slate-900 bg-yellow-200 px-2 py-1 text-[10px] font-black uppercase tracking-wider">Confirm action</p>
            <h3 id="delete-quiz-title" className="m-0 text-3xl font-black leading-none tracking-tight text-slate-900">Delete this quiz?</h3>
            <p className="m-0 mt-2 text-sm font-bold text-slate-500">
              <strong>{pendingDeleteQuiz.title}</strong> will be permanently removed.
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                className="cursor-pointer border-2 border-slate-900 bg-white px-3.5 py-2 text-xs font-black uppercase tracking-wide text-slate-900"
                onClick={() => setPendingDeleteQuiz(null)}
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cursor-pointer border-2 border-slate-900 bg-red-200 px-3.5 py-2 text-xs font-black uppercase tracking-wide text-red-900 shadow-[4px_4px_0_#7f1d1d]"
                onClick={() => handleDeleteQuiz(pendingDeleteQuiz.id)}
                disabled={deletingId !== null}
              >
                {deletingId === pendingDeleteQuiz.id ? "Deleting..." : "Delete quiz"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
