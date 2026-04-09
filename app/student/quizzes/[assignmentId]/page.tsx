"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL, apiGetAssignment, apiSubmitAssignment, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { normalizeChoiceText } from "@/lib/quiz/question-utils";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";
import { formatDeadline } from "../lib/deadline";
import { EXAM_START_RULES_MESSAGE } from "../lib/exam-policy";
import { seededShuffle } from "../lib/randomize";
import { useStudent } from "@/components/student/student-context";
import type { AssignmentDetail, SubmissionResult } from "../lib/types";

export default function StudentTakeQuizPage() {
  const { session } = useStudent();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params?.assignmentId;
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isExamStarted, setIsExamStarted] = useState(false);

  const answersRef = useRef<Record<string, string>>({});
  const isExamStartedRef = useRef(false);
  const isSubmittedRef = useRef(false);
  const hasAutoSubmittedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    isExamStartedRef.current = isExamStarted;
  }, [isExamStarted]);

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
  const randomizedQuestions = useMemo(() => {
    const seedBase = `${assignmentId ?? "assignment"}:${session?.id ?? "student"}`;
    return seededShuffle(questions, `${seedBase}:questions`).map((question) => ({
      ...question,
      options: Array.isArray(question.options)
        ? seededShuffle(question.options, `${seedBase}:q:${question.id}:options`)
        : question.options,
    }));
  }, [assignmentId, questions, session?.id]);
  const unansweredCount = useMemo(
    () => questions.filter((question) => !String(answers[question.id] ?? "").trim()).length,
    [answers, questions]
  );

  const submitAttemptOnClose = useCallback(() => {
    if (!assignmentId || hasAutoSubmittedRef.current || !isExamStartedRef.current || isSubmittedRef.current) return;
    const token = getStoredToken();
    if (!token) return;

    hasAutoSubmittedRef.current = true;
    const payload = JSON.stringify({ answers: answersRef.current });
    fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/submit`, {
      method: "POST",
      keepalive: true,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    }).catch(() => {
      // Keep this silent because the page may already be unloading.
    });
  }, [assignmentId]);

  useEffect(() => {
    if (searchParams.get("start") === "1") {
      setIsExamStarted(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isExamStarted || isSubmittedRef.current) return;

    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      if (!isExamStartedRef.current || isSubmittedRef.current) return;
      window.history.pushState(null, "", window.location.href);
      setErrorMessage("You cannot go back until you submit your exam.");
    };

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isExamStartedRef.current || isSubmittedRef.current) return;
      submitAttemptOnClose();
      event.preventDefault();
      event.returnValue = "Your exam will be submitted if you leave this page.";
    };

    const onPageHide = () => {
      submitAttemptOnClose();
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [isExamStarted, submitAttemptOnClose]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isExamStarted) {
      setErrorMessage("Start the exam first to submit.");
      return;
    }
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
      isSubmittedRef.current = true;
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

      {!isExamStarted && !submitMessage ? (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-4 text-[13px] font-bold text-amber-800">
          Exam has not started yet. Click <span className="font-black">Start Exam</span> to begin.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {randomizedQuestions.map((question, index) => (
          <article key={question.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
              Q{index + 1} - {question.type.replace(/_/g, " ")} | {Math.max(1, Number(question.points ?? 1) || 1)} pts
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
                        disabled={!isExamStarted || !!submitMessage}
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
                disabled={!isExamStarted || !!submitMessage}
                onChange={(event) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: event.target.value,
                  }))
                }
                rows={question.type === "essay" ? 5 : 3}
                className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] font-semibold text-slate-700 outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Type your answer..."
              />
            )}
          </article>
        ))}

        <div className="flex items-center justify-end gap-2 rounded-xl border border-slate-200 bg-white p-4">
          {!isExamStarted ? (
            <button
              type="button"
              onClick={() => {
                setIsExamStarted(true);
                setErrorMessage("");
              }}
              className="rounded-lg border border-emerald-300 bg-emerald-100 px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-emerald-900 transition hover:bg-emerald-200"
            >
              Start Exam
            </button>
          ) : (
            <span className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-rose-700">
              Back is locked until submit
            </span>
          )}
          <button
            type="submit"
            disabled={isSubmitting || questions.length === 0 || !isExamStarted || !!submitMessage}
            className="rounded-lg border border-indigo-300 bg-indigo-100 px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-indigo-900 transition hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={!isExamStarted && !submitMessage}
        onClose={() => router.push("/student/quizzes")}
        onConfirm={() => setIsExamStarted(true)}
        title="Start Exam?"
        message={EXAM_START_RULES_MESSAGE}
        confirmLabel="I Understand, Start"
        cancelLabel="Not Now"
        variant="accent"
      />

    </div>
  );
}
