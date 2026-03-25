"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiGetAssignment, apiSubmitAssignment, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { normalizeChoiceText } from "@/lib/quiz/question-utils";

type QuizQuestion = {
  id: number;
  type: string;
  question_text: string;
  options?: string[] | null;
};

type AssignmentDetail = {
  id: number;
  classroom_id: number;
  deadline_at?: string | null;
  quiz?: {
    id: number;
    title?: string | null;
    topic?: string | null;
    questions?: QuizQuestion[];
  } | null;
  classroom?: { id: number; name?: string | null } | null;
};

type SubmissionResult = {
  score?: number;
};

function parseDeadline(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatDeadline(value?: string | null): string {
  const date = parseDeadline(value);
  if (!date) return "No deadline";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function StudentTakeQuizPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params?.assignmentId;
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadAssignment() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const token = getStoredToken();
        if (!token || !assignmentId) return;
        const { response, data } = await apiGetAssignment<AssignmentDetail>(token, assignmentId);
        if (!mounted) return;
        if (!response.ok) {
          setErrorMessage(getApiErrorMessage(response, data as Record<string, unknown>, "Failed to load quiz."));
          return;
        }
        setAssignment(data);
      } catch {
        if (mounted) setErrorMessage("Failed to load quiz.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadAssignment();
    return () => {
      mounted = false;
    };
  }, [assignmentId]);

  const questions = useMemo(() => assignment?.quiz?.questions ?? [], [assignment]);
  const unansweredCount = useMemo(
    () => questions.filter((question) => !String(answers[question.id] ?? "").trim()).length,
    [answers, questions]
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!assignmentId) return;
    setIsSubmitting(true);
    setSubmitMessage("");
    setErrorMessage("");
    try {
      const token = getStoredToken();
      if (!token) {
        setErrorMessage("Session expired. Please log in again.");
        return;
      }

      const { response, data } = await apiSubmitAssignment(token, assignmentId, { answers });
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(response, data, "Failed to submit quiz."));
        return;
      }
      setSubmitMessage("Quiz submitted successfully.");
      setSubmissionResult((data as { submission?: SubmissionResult }).submission ?? null);
    } catch {
      setErrorMessage("Failed to submit quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="h-[220px] animate-pulse rounded-2xl border border-slate-100 bg-slate-50" />;
  }

  if (!assignment || !assignment.quiz) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-[22px] font-black text-[#0f172a]">Quiz not found.</p>
        <Link href="/student/quizzes" className="mt-4 inline-block text-[13px] font-black text-indigo-600 no-underline">
          Back to My Quizzes
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-[12px] font-black uppercase tracking-[0.1em] text-slate-500">Education / My Quizzes / Take Quiz</p>
        <h1 className="mt-2 text-[30px] font-black leading-tight tracking-[-0.03em] text-[#0f172a]">
          {assignment.quiz.title || `Quiz #${assignment.id}`}
        </h1>
        <p className="mt-2 text-[13px] font-semibold text-slate-600">
          Class: {assignment.classroom?.name || `Class #${assignment.classroom_id}`} | Deadline: {formatDeadline(assignment.deadline_at)}
        </p>
        <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
          {questions.length} Questions | {unansweredCount} Unanswered
        </p>
      </header>

      {submitMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-bold text-emerald-700">
          {submitMessage}
          {submissionResult?.score !== undefined ? ` Your score: ${Math.round(submissionResult.score)}%.` : ""}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-bold text-rose-700">{errorMessage}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((question, index) => (
          <article key={question.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
              Q{index + 1} - {question.type.replace(/_/g, " ")}
            </p>
            <p className="mt-2 text-[17px] font-bold text-[#0f172a]">{question.question_text}</p>

            {Array.isArray(question.options) && question.options.length > 0 ? (
              <div className="mt-3 space-y-2">
                {question.options.map((option, optionIndex) => {
                  const key = String.fromCharCode(65 + optionIndex);
                  const normalizedOption = normalizeChoiceText(option);
                  return (
                    <label key={`${question.id}-${optionIndex}`} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[14px] font-semibold text-slate-700 hover:bg-slate-50">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={normalizedOption}
                        checked={answers[question.id] === normalizedOption}
                        onChange={(event) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: event.target.value,
                          }))
                        }
                      />
                      <span>{key}. {normalizedOption}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={answers[question.id] ?? ""}
                onChange={(event) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: event.target.value,
                  }))
                }
                rows={question.type === "essay" ? 5 : 3}
                className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] font-semibold text-slate-700 outline-none focus:border-indigo-500"
                placeholder="Type your answer..."
              />
            )}
          </article>
        ))}

        <div className="flex items-center justify-end gap-2 rounded-xl border border-slate-200 bg-white p-4">
          <Link
            href="/student/quizzes"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 no-underline"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || questions.length === 0}
            className="rounded-lg border border-indigo-300 bg-indigo-100 px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-indigo-900 transition hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
