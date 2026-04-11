"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";
import { apiDeleteSummary, apiGetSummaries, getApiErrorMessage } from "@/lib/api/client";
import type { QuestionDifficulty, QuestionType } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { Search } from "lucide-react";
import { downloadSummaryPdf } from "@/lib/pdf/download-summary-pdf";
import { useToast } from "@/components/ui/toast/toast-provider";
import { LessonCard, type LessonSummary } from "@/components/teacher/lessons/lesson-card";
import { GeneratedDocumentViewer } from "@/components/teacher/generate/generated-document-viewer";
import { DocumentModalActions } from "@/components/teacher/shared/document-modal-actions";
import { generateQuestionsFromSummary } from "@/lib/teacher/generate-service";
import { QuestionGenerationProgress } from "@/components/teacher/generate/question-generation-progress";
import { QuestionPreviewCard } from "@/components/teacher/quizzes/question-preview-card";
import { parseGeneratedQuestions } from "@/lib/quiz/generated-questions-parser";
import { formatQuestionTypeLabel } from "@/lib/quiz/question-utils";
import { addGeneratedQuizToStore } from "@/lib/teacher/quiz-store";

const LESSONS_CACHE_KEY = "teachify_teacher_lessons_cache_v1";
const QUESTION_TYPE_OPTIONS: Array<{ id: QuestionType; label: string }> = [
  { id: "multiple_choice", label: "Multiple Choice" },
  { id: "true_false", label: "True / False" },
  { id: "enumeration", label: "Enumeration" },
  { id: "identification", label: "Identification" },
  { id: "fill_in_the_blanks", label: "Fill in Blanks" },
  { id: "essay", label: "Essay" },
];

type QuestionTypeCountConfig = Record<QuestionType, { enabled: boolean; count: number }>;

function buildInitialQuestionTypeCounts(defaultCount = 8): QuestionTypeCountConfig {
  return {
    multiple_choice: { enabled: true, count: defaultCount },
    true_false: { enabled: false, count: 1 },
    enumeration: { enabled: false, count: 1 },
    matching: { enabled: false, count: 1 },
    identification: { enabled: false, count: 1 },
    fill_in_the_blanks: { enabled: false, count: 1 },
    short_answer: { enabled: false, count: 1 },
    essay: { enabled: false, count: 1 },
  };
}

export default function TeacherLessonsPage() {
  const { showToast } = useToast();
  const activeQuestionGenerationAbortControllerRef = useRef<AbortController | null>(null);
  const [summaries, setSummaries] = useState<LessonSummary[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSummary, setSelectedSummary] = useState<LessonSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [summaryToDelete, setSummaryToDelete] = useState<LessonSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [questionsResult, setQuestionsResult] = useState("");
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [questionsResultTypeFilter, setQuestionsResultTypeFilter] = useState("all");
  const [questionsQuizTitle, setQuestionsQuizTitle] = useState("");
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [isQuestionSettingsStep, setIsQuestionSettingsStep] = useState(false);
  const [questionDifficulty, setQuestionDifficulty] = useState<QuestionDifficulty>("medium");
  const [questionTypeCounts, setQuestionTypeCounts] = useState<QuestionTypeCountConfig>(() =>
    buildInitialQuestionTypeCounts()
  );
  const questionSettingsMaxItems = 50;

  useEffect(() => {
    let mounted = true;

    if (typeof window !== "undefined") {
      try {
          const raw = window.localStorage.getItem(LESSONS_CACHE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as LessonSummary[];
            if (Array.isArray(parsed)) {
              setSummaries(parsed);
            }
          }
        } catch {
        // Ignore cache parse issues and continue with API fetch.
      }
    }

    async function loadData() {
      try {
        const token = getStoredToken();
        if (!token) return;

        // Load Summaries
        const { response, data } = await apiGetSummaries<LessonSummary[]>(token);
        if (!mounted) return;
        if (response.ok) {
          setSummaries(data);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(LESSONS_CACHE_KEY, JSON.stringify(data));
          }
        }
      } catch (error) {
        console.error("Failed to load lessons:", error);
      } finally {
        if (mounted) setHasFetched(true);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredSummaries = summaries.filter((s) =>
    s.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedQuestionTypeEntries = QUESTION_TYPE_OPTIONS.filter(
    (option) => questionTypeCounts[option.id].enabled
  ).map((option) => ({
    type: option.id,
    count: questionTypeCounts[option.id].count,
  }));
  const totalSelectedQuestionItems = selectedQuestionTypeEntries.reduce((sum, entry) => sum + entry.count, 0);
  const parsedQuestionsResult = useMemo(() => parseGeneratedQuestions(questionsResult), [questionsResult]);
  const availableQuestionsResultTypeFilters = useMemo(
    () => ["all", ...Array.from(new Set(parsedQuestionsResult.questions.map((question) => question.type)))],
    [parsedQuestionsResult.questions]
  );
  const filteredQuestionsResult = useMemo(() => {
    if (questionsResultTypeFilter === "all") return parsedQuestionsResult.questions;
    return parsedQuestionsResult.questions.filter((question) => question.type === questionsResultTypeFilter);
  }, [parsedQuestionsResult.questions, questionsResultTypeFilter]);

  const handleView = (summary: LessonSummary) => {
    setIsCopied(false);
    setIsQuestionSettingsStep(false);
    setSelectedSummary(summary);
    setIsModalOpen(true);
  };

  const handleDownload = (summary: LessonSummary) => {
    downloadSummaryPdf(summary.content);
    showToast("Downloading PDF...", "success");
  };
  const handleSaveQuestionsAsPdf = () => {
    downloadSummaryPdf(questionsResult, {
      fileNamePrefix: "teachify-questions",
      title: "Generated Questions",
      subtitle: `Difficulty: ${questionDifficulty}`,
    });
  };
  const handleSaveGeneratedQuestionsToQuizzes = () => {
    const trimmedTitle = questionsQuizTitle.trim();
    if (!trimmedTitle) {
      showToast("Please enter a quiz title before saving.", "error");
      return;
    }
    if (parsedQuestionsResult.questions.length === 0) {
      showToast("No parsed questions found to save.", "error");
      return;
    }

    addGeneratedQuizToStore({
      title: trimmedTitle,
      difficulty: questionDifficulty,
      questions: parsedQuestionsResult.questions.map((question) => ({
        ...question,
        points: Math.max(1, Number(question.points ?? 1) || 1),
      })),
    });
    showToast(`Saved "${trimmedTitle}" to My Quizzes.`, "success");
  };

  const handleDeleteRequest = (summary: LessonSummary) => {
    setSummaryToDelete(summary);
  };

  const handleConfirmDelete = async () => {
    if (!summaryToDelete) return;
    const token = getStoredToken();
    if (!token) {
      showToast("Session expired. Please log in again.", "error");
      return;
    }

    setIsDeleting(true);
    try {
      const { response, data } = await apiDeleteSummary(token, summaryToDelete.id);
      if (!response.ok) {
        showToast(getApiErrorMessage(response, data, "Failed to delete lesson."), "error");
        return;
      }

      setSummaries((prev) => prev.filter((item) => item.id !== summaryToDelete.id));
      if (typeof window !== "undefined") {
        const next = summaries.filter((item) => item.id !== summaryToDelete.id);
        window.localStorage.setItem(LESSONS_CACHE_KEY, JSON.stringify(next));
      }
      if (selectedSummary?.id === summaryToDelete.id) {
        setIsModalOpen(false);
        setSelectedSummary(null);
      }
      showToast("Lesson deleted.", "success");
      setSummaryToDelete(null);
    } catch {
      showToast("Failed to delete lesson.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      showToast("Copied to clipboard!", "success");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast("Failed to copy.", "error");
    }
  };

  const handleGenerateQuestionsFromLesson = async () => {
    const content = selectedSummary?.content?.trim() ?? "";
    if (!content) return;
    if (selectedQuestionTypeEntries.length === 0) {
      showToast("Select at least one question type.", "error");
      return;
    }
    setIsQuestionsLoading(true);
    const abortController = new AbortController();
    activeQuestionGenerationAbortControllerRef.current = abortController;
    try {
      const generatedQuestions = await generateQuestionsFromSummary(content, {
        itemCount: totalSelectedQuestionItems,
        difficulty: questionDifficulty,
        questionTypes: selectedQuestionTypeEntries.map((entry) => entry.type),
        questionTypeCounts: Object.fromEntries(
          selectedQuestionTypeEntries.map((entry) => [entry.type, entry.count])
        ),
      }, abortController.signal);
      setQuestionsResult(generatedQuestions);
      setQuestionsResultTypeFilter("all");
      setQuestionsQuizTitle((prev) => prev.trim() || selectedSummary?.topic?.trim() || "Generated Quiz");
      setIsQuestionSettingsStep(false);
      setIsModalOpen(false);
      setIsQuestionsModalOpen(true);
      showToast("Questions generated from lesson!", "success");
    } catch (error) {
      const isAbortError =
        (error instanceof DOMException && error.name === "AbortError") ||
        (error instanceof Error && error.name === "AbortError");
      if (isAbortError) {
        showToast("Question generation canceled.", "success");
      } else {
        const message = error instanceof Error ? error.message : "Failed to generate questions.";
        showToast(message, "error");
      }
    } finally {
      if (activeQuestionGenerationAbortControllerRef.current === abortController) {
        activeQuestionGenerationAbortControllerRef.current = null;
      }
      setIsQuestionsLoading(false);
    }
  };

  const handleCancelQuestionGeneration = () => {
    activeQuestionGenerationAbortControllerRef.current?.abort();
  };

  const toggleQuestionType = (typeId: QuestionType) => {
    setQuestionTypeCounts((prev) => {
      const current = prev[typeId];
      if (current.enabled) {
        return {
          ...prev,
          [typeId]: { ...current, enabled: false },
        };
      }

      const otherTotal = Object.entries(prev)
        .filter(([key, value]) => key !== typeId && value.enabled)
        .reduce((sum, [, value]) => sum + value.count, 0);
      const allowedForType = Math.max(1, questionSettingsMaxItems - otherTotal);
      return {
        ...prev,
        [typeId]: {
          enabled: true,
          count: Math.min(Math.max(1, current.count), allowedForType),
        },
      };
    });
  };

  useEffect(() => {
    return () => {
      activeQuestionGenerationAbortControllerRef.current?.abort();
    };
  }, []);

  const adjustQuestionTypeCount = (typeId: QuestionType, delta: number) => {
    setQuestionTypeCounts((prev) => {
      const current = prev[typeId];
      if (!current.enabled) return prev;
      const otherTotal = Object.entries(prev)
        .filter(([key, value]) => key !== typeId && value.enabled)
        .reduce((sum, [, value]) => sum + value.count, 0);
      const allowedForType = Math.max(1, questionSettingsMaxItems - otherTotal);
      const nextCount = Math.max(1, Math.min(allowedForType, current.count + delta));
      return {
        ...prev,
        [typeId]: { ...current, count: nextCount },
      };
    });
  };

  const setQuestionTypeCount = (typeId: QuestionType, rawValue: string) => {
    const parsedValue = Number.parseInt(rawValue.trim() === "" ? "1" : rawValue, 10);
    if (Number.isNaN(parsedValue)) return null;
    let nextCountForType: number | null = null;

    setQuestionTypeCounts((prev) => {
      const current = prev[typeId];
      if (!current.enabled) return prev;
      const otherTotal = Object.entries(prev)
        .filter(([key, value]) => key !== typeId && value.enabled)
        .reduce((sum, [, value]) => sum + value.count, 0);
      const allowedForType = Math.max(1, questionSettingsMaxItems - otherTotal);
      const nextCount = Math.max(1, Math.min(allowedForType, parsedValue));
      nextCountForType = nextCount;
      return {
        ...prev,
        [typeId]: { ...current, count: nextCount },
      };
    });

    return nextCountForType;
  };

  return (
    <section className="w-full pb-10">
      <div className="flex flex-col gap-7">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-[12px] font-black uppercase tracking-[0.09em] text-slate-500">Dashboard / Lessons</p>
            <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-slate-900">My AI Lessons</h2>
            <p className="mt-2 text-[15px] font-bold text-slate-600">Review, search, and manage your generated summaries.</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[330px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-[14px] font-bold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
              />
            </div>
            <Link
              href="/teacher/generate"
              className="inline-flex h-[46px] items-center justify-center rounded-xl border-2 border-cyan-700 bg-cyan-600 px-6 text-[12px] font-black uppercase tracking-[0.08em] text-white shadow-[3px_3px_0_#155e75] transition hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-[5px_5px_0_#155e75]"
            >
              + Create Summary
            </Link>
          </div>
        </header>

        {filteredSummaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredSummaries.map((summary) => (
              <LessonCard
                key={summary.id}
                summary={summary}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDeleteRequest}
              />
            ))}

            <Link
              href="/teacher/generate"
              className="group flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-cyan-300 bg-cyan-50/40 p-7 transition-all hover:border-cyan-500 hover:bg-white hover:shadow-md"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300 bg-white text-cyan-700 transition-transform group-hover:scale-105 group-hover:border-cyan-500 group-hover:text-cyan-800">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <p className="m-0 text-[15px] font-black text-slate-800">Create New Lesson</p>
              <p className="mt-1 text-[13px] font-bold text-slate-500">Generate another summary</p>
            </Link>
          </div>
        ) : (
          <div className="rounded-[36px] border-2 border-[#0f172a]/10 bg-white p-4 md:p-7">
            <div className="relative overflow-hidden rounded-[28px] border-2 border-cyan-200 bg-gradient-to-br from-[#f0f9ff] via-[#ecfeff] to-[#f8fafc] p-8 md:p-12">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/35 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-indigo-300/25 blur-2xl" />

              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <span className="inline-flex items-center rounded-full border border-cyan-300 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-cyan-800">
                  lesson workspace
                </span>
                <h3 className="mt-4 m-0 text-[30px] leading-[1.05] font-black tracking-[-0.03em] text-slate-900">
                  {searchQuery ? "No matching lessons found" : "Create your first AI lesson"}
                </h3>
                <p className="mt-3 mb-0 max-w-xl text-[15px] font-semibold leading-relaxed text-slate-600">
                  {searchQuery
                    ? `No lesson title currently matches "${searchQuery}". Try a different keyword.`
                    : !hasFetched
                      ? "Syncing your lessons in the background..."
                      : "Generate a summary from your topic, then review, download, and manage it here."}
                </p>

                {!searchQuery ? (
                  <>
                    <div className="mt-7 grid w-full gap-3 text-left md:grid-cols-3">
                      {[
                        "Open AI Summary tab",
                        "Type your lesson topic",
                        "Generate and save lesson",
                      ].map((step, index) => (
                        <div
                          key={step}
                          className="rounded-2xl border border-cyan-200 bg-white/85 px-4 py-3"
                        >
                          <p className="m-0 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-700">
                            Step {index + 1}
                          </p>
                          <p className="mt-1 mb-0 text-[14px] font-extrabold text-slate-800">{step}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                      <Link
                        href="/teacher/generate"
                        className="inline-flex min-w-[190px] items-center justify-center rounded-xl border-2 border-cyan-700 bg-cyan-700 px-8 py-3 text-[13px] font-black uppercase tracking-wider text-white transition hover:-translate-y-1 hover:bg-cyan-800 hover:shadow-lg"
                      >
                        Create First Lesson
                      </Link>
                      <Link
                        href="/teacher/quizzes"
                        className="inline-flex min-w-[190px] items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-8 py-3 text-[13px] font-black uppercase tracking-wider text-slate-900 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-1 hover:bg-slate-100 hover:shadow-[5px_5px_0_#0f172a]"
                      >
                        View My Quizzes
                      </Link>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/teacher/generate"
                    className="mt-7 inline-flex min-w-[190px] items-center justify-center rounded-xl border-2 border-cyan-700 bg-cyan-700 px-8 py-3 text-[13px] font-black uppercase tracking-wider text-white transition hover:-translate-y-1 hover:bg-cyan-800 hover:shadow-lg"
                  >
                    Create New Lesson
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for viewing the full lesson */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsQuestionSettingsStep(false);
        }}
        title={
          isQuestionSettingsStep
            ? (isQuestionsLoading ? "Generating Questions" : "Question Settings")
            : (selectedSummary?.topic ?? "AI Lesson")
        }
        footer={
          isQuestionSettingsStep ? (
            isQuestionsLoading ? null : (
            <>
              <button
                type="button"
                onClick={() => setIsQuestionSettingsStep(false)}
                disabled={isQuestionsLoading}
                className="rounded-lg border-2 border-slate-900 bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleGenerateQuestionsFromLesson}
                disabled={isQuestionsLoading || totalSelectedQuestionItems <= 0}
                className="rounded-lg border-2 border-slate-900 bg-emerald-100 px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-900 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isQuestionsLoading ? "Generating..." : "Generate Questions"}
              </button>
            </>
            )
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuestionsQuizTitle((prev) => prev.trim() || selectedSummary?.topic?.trim() || "Generated Quiz");
                  setIsQuestionSettingsStep(true);
                }}
                disabled={isQuestionsLoading || !(selectedSummary?.content ?? "").trim()}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-100 px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate Questions
              </button>
              <DocumentModalActions
                isCopied={isCopied}
                onCopy={() => handleCopyToClipboard(selectedSummary?.content ?? "")}
                onExportPdf={() => selectedSummary && handleDownload(selectedSummary)}
              />
            </div>
          )
        }
      >
        {isQuestionSettingsStep ? (
          isQuestionsLoading ? (
            <QuestionGenerationProgress onCancel={handleCancelQuestionGeneration} />
          ) : (
          <div className="grid gap-4">
            <div className="grid gap-1">
              <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
                Quiz Title
              </label>
              <input
                type="text"
                value={questionsQuizTitle}
                onChange={(event) => setQuestionsQuizTitle(event.target.value)}
                placeholder="Enter quiz title"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
                Total Selected Items
              </p>
              <p className="mt-1 text-[14px] font-black text-slate-900">
                {totalSelectedQuestionItems} / {questionSettingsMaxItems} allowed
              </p>
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setQuestionDifficulty(level)}
                    className={`rounded-lg border px-3 py-2 text-[12px] font-black uppercase tracking-[0.06em] transition ${
                      questionDifficulty === level
                        ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
                Question Types
                <span className="ml-2 text-[10px] font-bold normal-case tracking-normal text-slate-400">
                  (you can select multiple)
                </span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {QUESTION_TYPE_OPTIONS.map((option) => {
                  const typeState = questionTypeCounts[option.id];
                  const isActive = typeState.enabled;
                  const otherTotal = Object.entries(questionTypeCounts)
                    .filter(([key, value]) => key !== option.id && value.enabled)
                    .reduce((sum, [, value]) => sum + value.count, 0);
                  const allowedForType = Math.max(1, questionSettingsMaxItems - otherTotal);
                  return (
                    <div
                      key={option.id}
                      onClick={() => toggleQuestionType(option.id)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 transition ${
                        isActive
                          ? "border-emerald-500 bg-emerald-100"
                          : "border-slate-300 bg-white hover:border-slate-400"
                      }`}
                    >
                      <span className={`text-[12px] font-black ${isActive ? "text-emerald-900" : "text-slate-600"}`}>
                        {option.label}
                      </span>
                      {isActive ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              adjustQuestionTypeCount(option.id, -1);
                            }}
                            disabled={typeState.count <= 1}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-emerald-300 bg-white text-emerald-700"
                          >
                            -
                          </button>
                          <input
                            key={`${option.id}-${typeState.count}`}
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={allowedForType}
                            onClick={(event) => event.stopPropagation()}
                            defaultValue={typeState.count}
                            onBlur={(event) => {
                              event.stopPropagation();
                              const rawValue = event.target.value;
                              const normalizedCount = setQuestionTypeCount(option.id, rawValue);
                              if (normalizedCount === null) {
                                event.currentTarget.value = String(typeState.count);
                                return;
                              }
                              if (Number.parseInt(rawValue || "0", 10) > allowedForType) {
                                showToast(`Maximum allowed for ${option.label} is ${allowedForType}.`, "error");
                              }
                              event.currentTarget.value = String(normalizedCount);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                (event.currentTarget as HTMLInputElement).blur();
                              }
                            }}
                            className="h-6 w-14 rounded-md border border-emerald-300 bg-white px-1 text-center text-[13px] font-black text-emerald-900 outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              adjustQuestionTypeCount(option.id, 1);
                            }}
                            disabled={typeState.count >= allowedForType || totalSelectedQuestionItems >= questionSettingsMaxItems}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-emerald-300 bg-white text-emerald-700 disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          )
        ) : (
          <GeneratedDocumentViewer content={selectedSummary?.content ?? ""} />
        )}
      </Modal>

      <Modal
        isOpen={isQuestionsModalOpen}
        onClose={() => {
          setIsQuestionsModalOpen(false);
          setQuestionsQuizTitle("");
        }}
        title={parsedQuestionsResult.title || selectedSummary?.topic || "Generated Questions"}
        footer={
          <>
            <button
              type="button"
              onClick={handleSaveGeneratedQuestionsToQuizzes}
              disabled={!questionsQuizTitle.trim() || parsedQuestionsResult.questions.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-100 px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save to My Quizzes
            </button>
            <DocumentModalActions
              onExportPdf={handleSaveQuestionsAsPdf}
              exportLabel="Export PDF"
            />
          </>
        }
      >
        {parsedQuestionsResult.questions.length > 0 ? (
          <div className="grid gap-4">
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Difficulty: {questionDifficulty} | {filteredQuestionsResult.length} of {parsedQuestionsResult.questions.length} Questions
            </p>

            <div className="flex flex-wrap gap-2">
              {availableQuestionsResultTypeFilters.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setQuestionsResultTypeFilter(type)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] transition ${
                    questionsResultTypeFilter === type
                      ? "border-emerald-600 bg-emerald-100 text-emerald-900"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {type === "all" ? "All" : formatQuestionTypeLabel(type)}
                </button>
              ))}
            </div>

            {filteredQuestionsResult.map((question, idx) => (
              <QuestionPreviewCard
                key={`${idx}-${question.question}`}
                question={question}
                questionNumber={idx + 1}
                variant="modal"
              />
            ))}
          </div>
        ) : (
          <GeneratedDocumentViewer content={questionsResult} />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={summaryToDelete !== null}
        onClose={() => setSummaryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this lesson?"
        message={`This action cannot be undone. "${summaryToDelete?.topic ?? "This lesson"}" will be permanently removed.`}
        confirmLabel="Yes, Delete Lesson"
        isLoading={isDeleting}
        variant="danger"
      />
    </section>
  );
}
