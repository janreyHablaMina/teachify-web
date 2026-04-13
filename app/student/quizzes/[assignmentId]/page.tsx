"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL, apiGetAssignment, apiSubmitAssignment, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { normalizeChoiceText } from "@/lib/quiz/question-utils";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast/toast-provider";
import { formatDeadline } from "../lib/deadline";
import { EXAM_START_RULES_MESSAGE } from "../lib/exam-policy";
import { seededShuffle } from "../lib/randomize";
import { useStudent } from "@/components/student/student-context";
import type { AssignmentDetail, SubmissionAnswerDetail, SubmissionResult } from "../lib/types";

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
};

function inferEnumerationCount(questionText: string): number | null {
  const text = questionText.toLowerCase();
  const digitMatch = text.match(/\b(?:give|list|name|mention|enumerate|write|identify)\s+(\d{1,2})\b/);
  if (digitMatch) {
    const count = Number.parseInt(digitMatch[1], 10);
    return Number.isFinite(count) && count > 0 ? count : null;
  }

  const wordMatch = text.match(/\b(?:give|list|name|mention|enumerate|write|identify)\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/);
  if (!wordMatch) return null;
  return NUMBER_WORDS[wordMatch[1]] ?? null;
}

function inferFallbackEnumerationCount(questionText: string): number | null {
  const text = questionText.toLowerCase();
  const genericDigitMatch = text.match(/\b(\d{1,2})\s+(?:answers?|items?|examples?|reasons?|ways?|steps?|differences?|points?)\b/);
  if (genericDigitMatch) {
    const count = Number.parseInt(genericDigitMatch[1], 10);
    return Number.isFinite(count) && count > 0 ? count : null;
  }

  const genericWordMatch = text.match(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(?:answers?|items?|examples?|reasons?|ways?|steps?|differences?|points?)\b/
  );
  if (!genericWordMatch) return null;
  return NUMBER_WORDS[genericWordMatch[1]] ?? null;
}

function hasEnumerationCountInQuestion(questionText: string): boolean {
  const text = questionText.toLowerCase();
  return /\b(?:give|list|name|mention|enumerate|write|identify)\s+(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/.test(text)
    || /\b(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(?:answers?|items?|examples?|reasons?|ways?|steps?|differences?|points?)\b/.test(text);
}

function buildEnumerationQuestionText(questionText: string, countHint: number | null): string {
  const base = String(questionText ?? "").trim();
  if (!base) return countHint ? `Enumerate ${countHint} answers.` : "";
  if (!countHint || hasEnumerationCountInQuestion(base)) return base;
  return `${base} (Enumerate ${countHint} answers.)`;
}

function parseEnumerationAnswerParts(rawAnswer: string, count: number): string[] {
  const normalized = String(rawAnswer ?? "");
  let tokens: string[] = [];

  if (normalized) {
    // Keep exact spacing for per-input mode by preferring newline-separated values.
    if (normalized.includes("\n")) {
      tokens = normalized.split(/\n/);
    } else if (/[;,]/.test(normalized)) {
      // Fallback for older answers that may have comma/semicolon-separated values.
      tokens = normalized
        .split(/[;,]+/)
        .map((part) => part.trim())
        .filter(Boolean);
    } else {
      // Single-field typed value: preserve all user spacing.
      tokens = [normalized];
    }
  }

  return Array.from({ length: count }, (_, index) => tokens[index] ?? "");
}

function toDisplayText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

export default function StudentTakeQuizPage() {
  const { session } = useStudent();
  const { showToast } = useToast();
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
  const [isScoreSummaryOpen, setIsScoreSummaryOpen] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [trueFalseFollowUps, setTrueFalseFollowUps] = useState<Record<string, string>>({});

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
        if ((data as AssignmentDetail).has_submitted) {
          const existingSubmission = (data as AssignmentDetail).submission;
          isSubmittedRef.current = true;
          setIsExamStarted(true);
          setSubmitMessage("Quiz already submitted. Review mode enabled.");
          setSubmissionResult(
            existingSubmission
              ? {
                  id: existingSubmission.id,
                  score: typeof existingSubmission.score === "number" ? existingSubmission.score : undefined,
                  submitted_at: existingSubmission.submitted_at ?? null,
                  answers: (existingSubmission.answers as Record<string, SubmissionAnswerDetail> | null | undefined) ?? null,
                }
              : null
          );
          const submittedAnswers = existingSubmission?.answers;
          if (submittedAnswers && typeof submittedAnswers === "object") {
            const restoredAnswers = Object.entries(submittedAnswers as Record<string, unknown>).reduce<Record<string, string>>(
              (acc, [questionId, payload]) => {
                if (payload && typeof payload === "object" && "answer" in (payload as Record<string, unknown>)) {
                  const raw = (payload as { answer?: unknown }).answer;
                  acc[questionId] = typeof raw === "string" ? raw : String(raw ?? "");
                }
                return acc;
              },
              {}
            );
            setAnswers(restoredAnswers);
          }
        }
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
  const gradedRows = useMemo(() => {
    const gradedAnswers = submissionResult?.answers;
    if (!gradedAnswers) return [];

    return randomizedQuestions.map((question, index) => {
      const grading = gradedAnswers[String(question.id)] ?? {};
      const points = Math.max(1, Number(grading.points ?? question.points ?? 1) || 1);
      const earnedPoints = Math.max(0, Number(grading.earned_points ?? 0) || 0);
      const studentAnswer = toDisplayText(grading.answer);
      const correctAnswer = toDisplayText(grading.correct_answer);
      const isCorrect = typeof grading.is_correct === "boolean" ? grading.is_correct : earnedPoints >= points;

      return {
        key: String(question.id),
        index,
        questionText: question.question_text,
        points,
        earnedPoints,
        isCorrect,
        studentAnswer,
        correctAnswer,
      };
    });
  }, [randomizedQuestions, submissionResult?.answers]);
  const scoreSummary = useMemo(() => {
    const fallbackTotalPoints = randomizedQuestions.reduce((sum, question) => sum + Math.max(1, Number(question.points ?? 1) || 1), 0);
    if (gradedRows.length === 0) {
      const numericScore = Number(submissionResult?.score ?? 0);
      const earnedFallback = Number.isFinite(numericScore) ? Math.round((Math.max(0, numericScore) / 100) * fallbackTotalPoints) : 0;
      return {
        totalItems: randomizedQuestions.length,
        correctItems: 0,
        incorrectItems: randomizedQuestions.length,
        unansweredItems: unansweredCount,
        totalPoints: fallbackTotalPoints,
        earnedPoints: earnedFallback,
      };
    }

    const totalItems = gradedRows.length;
    const correctItems = gradedRows.filter((row) => row.isCorrect).length;
    const unansweredItems = gradedRows.filter((row) => !row.studentAnswer).length;
    const totalPoints = gradedRows.reduce((sum, row) => sum + row.points, 0);
    const earnedPoints = gradedRows.reduce((sum, row) => sum + row.earnedPoints, 0);
    return {
      totalItems,
      correctItems,
      incorrectItems: Math.max(0, totalItems - correctItems),
      unansweredItems,
      totalPoints,
      earnedPoints,
    };
  }, [gradedRows, randomizedQuestions, submissionResult?.score, unansweredCount]);

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
      const submission = (data as { submission?: SubmissionResult }).submission ?? null;
      setSubmissionResult(submission);
      showToast("Quiz submitted successfully.", "success");
      if (submission) {
        setIsScoreSummaryOpen(true);
      }
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

      {submitMessage && submitMessage.includes("already submitted") ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-bold text-emerald-700">
          {submitMessage}
          {typeof submissionResult?.score === "number" ? ` Your score: ${Math.round(submissionResult.score)}%.` : ""}
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
            {(() => {
              const normalizedType = String(question.type ?? "").trim().toLowerCase();
              const isTrueFalseQuestion = normalizedType === "true_false" || normalizedType === "true false";
              const isEnumerationQuestion = normalizedType === "enumeration";
              const enumerationCountHint = isEnumerationQuestion
                ? inferEnumerationCount(question.question_text ?? "") ??
                  inferFallbackEnumerationCount(question.question_text ?? "")
                : null;
              const enumerationInputCount = isEnumerationQuestion
                ? Math.max(
                    1,
                    enumerationCountHint ??
                      (() => {
                        const tokenCount = parseEnumerationAnswerParts(answers[question.id] ?? "", 12)
                          .filter((part) => part.trim().length > 0).length;
                        return tokenCount > 0 ? tokenCount : 3;
                      })()
                  )
                : null;
              const renderedQuestionText = isEnumerationQuestion
                ? buildEnumerationQuestionText(question.question_text ?? "", enumerationCountHint)
                : question.question_text;
              const options = Array.isArray(question.options) && question.options.length > 0
                ? question.options
                : isTrueFalseQuestion
                  ? ["True", "False"]
                  : [];
              const selectedValue = String(answers[question.id] ?? "").trim().toLowerCase();
              const shouldShowFalseInput = isTrueFalseQuestion && selectedValue === "false";

              return (
                <>
                  <p className="mt-2 text-[17px] font-bold text-[#0f172a]">{renderedQuestionText}</p>

                  {options.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {options.map((option, optionIndex) => {
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

                      {shouldShowFalseInput ? (
                        <input
                          type="text"
                          value={trueFalseFollowUps[question.id] ?? ""}
                          disabled={!isExamStarted || !!submitMessage}
                          onChange={(event) =>
                            setTrueFalseFollowUps((prev) => ({
                              ...prev,
                              [question.id]: event.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] font-semibold text-slate-700 outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                          placeholder="If false, enter the corrected statement (optional)..."
                        />
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {isEnumerationQuestion ? (
                        <div className="grid gap-2">
                          {parseEnumerationAnswerParts(answers[question.id] ?? "", enumerationInputCount ?? 3).map((value, partIndex, list) => (
                            <input
                              key={`${question.id}-enum-${partIndex}`}
                              type="text"
                              value={value}
                              disabled={!isExamStarted || !!submitMessage}
                              onChange={(event) =>
                                setAnswers((prev) => {
                                  const nextParts = parseEnumerationAnswerParts(prev[question.id] ?? "", enumerationInputCount ?? 3);
                                  nextParts[partIndex] = event.target.value;
                                  const combined = nextParts
                                    .map((part) => part)
                                    .join("\n");
                                  return {
                                    ...prev,
                                    [question.id]: combined,
                                  };
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] font-semibold text-slate-700 outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                              placeholder={`Answer ${partIndex + 1} of ${list.length}`}
                            />
                          ))}
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
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] font-semibold text-slate-700 outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                          placeholder="Type your answer..."
                        />
                      )}
                    </div>
                  )}
                </>
              );
            })()}
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

      <Modal
        isOpen={isScoreSummaryOpen}
        onClose={() => setIsScoreSummaryOpen(false)}
        title="Quiz Result Summary"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsScoreSummaryOpen(false)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => router.push("/student/quizzes")}
              className="rounded-lg border border-indigo-300 bg-indigo-100 px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-indigo-900 transition hover:bg-indigo-200"
            >
              Back to Quizzes
            </button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Score</p>
              <p className="mt-1 text-[22px] font-black text-slate-900">{Math.round(Number(submissionResult?.score ?? 0))}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Points</p>
              <p className="mt-1 text-[22px] font-black text-slate-900">
                {scoreSummary.earnedPoints}/{scoreSummary.totalPoints}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Correct</p>
              <p className="mt-1 text-[22px] font-black text-emerald-700">
                {scoreSummary.correctItems}/{scoreSummary.totalItems}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Incorrect</p>
              <p className="mt-1 text-[22px] font-black text-rose-700">{scoreSummary.incorrectItems}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Unanswered</p>
              <p className="mt-1 text-[22px] font-black text-amber-700">{scoreSummary.unansweredItems}</p>
            </div>
          </div>

          {gradedRows.length > 0 ? (
            <div className="space-y-2">
              <p className="m-0 text-[12px] font-black uppercase tracking-[0.08em] text-slate-600">Per Question Results</p>
              <div className="max-h-[36vh] space-y-2 overflow-y-auto pr-1">
                {gradedRows.map((row) => (
                  <article key={row.key} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="m-0 text-[12px] font-black uppercase tracking-[0.08em] text-slate-500">Q{row.index + 1}</p>
                      <p className={`m-0 text-[12px] font-black uppercase tracking-[0.08em] ${row.isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                        {row.isCorrect ? "Correct" : "Incorrect"} | {row.earnedPoints}/{row.points} pts
                      </p>
                    </div>
                    <p className="mt-1 text-[14px] font-bold text-slate-900">{row.questionText}</p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-600">
                      Your answer: <span className="font-bold text-slate-900">{row.studentAnswer || "No answer"}</span>
                    </p>
                    <p className="mt-0.5 text-[12px] font-semibold text-slate-600">
                      Correct answer: <span className="font-bold text-slate-900">{row.correctAnswer || "N/A"}</span>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Modal>

    </div>
  );
}
