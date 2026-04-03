"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { ArrowRight, Sparkles } from "lucide-react";
import { PLAN_CATALOG, normalizePlanTier } from "@/components/teacher/dashboard/plan";
import { UsageStats } from "@/components/teacher/generate/usage-stats";
import { ModeSwitcher } from "@/components/teacher/generate/mode-switcher";
import { FileUploadWorkspace } from "@/components/teacher/generate/file-upload-workspace";
import { LoadingOverlay } from "@/components/teacher/generate/loading-overlay";
import type { GeneratePayload, GeneratedQuiz } from "@/components/teacher/generate/types";
import type { TeacherPlanUser } from "@/components/teacher/dashboard/types";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import { apiConsumeGenerationUsage, apiStoreSummary, apiGetSummaries } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { generateQuizFromFile, generateSummary } from "@/lib/teacher/generate-service";
import { downloadSummaryPdf } from "@/lib/pdf/download-summary-pdf";
import { addGeneratedQuizToStore } from "@/lib/teacher/quiz-store";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast/toast-provider";
import { HistorySidebar, type HistorySummaryItem } from "@/components/teacher/generate/history-sidebar";
import { GeneratedDocumentViewer } from "@/components/teacher/generate/generated-document-viewer";
import { DocumentModalActions } from "@/components/teacher/shared/document-modal-actions";
import { QuestionPreviewCard } from "@/components/teacher/quizzes/question-preview-card";
import {
  formatChoiceLabel,
  formatQuestionTypeLabel,
  normalizeChoiceText,
  orderQuestionsByType,
  parseEnumerationItems,
} from "@/lib/quiz/question-utils";

const RECENT_GENERATED_QUIZZES_KEY = "teachify_recent_generated_quizzes_v1";

type RecentGeneratedQuiz = {
  id: number;
  createdAt: string;
  quiz: GeneratedQuiz;
};

export default function TeacherGeneratePage() {
  const { showToast } = useToast();
  const session = useTeacherSession();
  const activeGenerationAbortControllerRef = useRef<AbortController | null>(null);
  const [mode, setMode] = useState<"chat" | "file">("file");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [quizToPreview, setQuizToPreview] = useState<GeneratedQuiz | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [questionTypeFilter, setQuestionTypeFilter] = useState("all");
  const [recentGeneratedQuizzes, setRecentGeneratedQuizzes] = useState<RecentGeneratedQuiz[]>([]);
  const [fileGenerateError, setFileGenerateError] = useState("");
  const [summaryResult, setSummaryResult] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [questionsResult, setQuestionsResult] = useState("");
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [summaryTitle, setSummaryTitle] = useState("");
  const [summaryTopic, setSummaryTopic] = useState("");
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);
  const [summaries, setSummaries] = useState<HistorySummaryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Derive plan from global session to avoid "Free Plan" flash
  const planUser: TeacherPlanUser = useMemo(() => ({
    plan: session?.plan ?? "trial",
    plan_tier: session?.planTier ?? "trial",
    quiz_generation_limit: session?.quizGenerationLimit ?? 3,
    quizzes_used: session?.quizzesUsed ?? 0,
    max_questions_per_quiz: session?.maxQuestionsPerQuiz,
  }), [session]);

  const loadHistory = useCallback(async () => {
    try {
      const token = getStoredToken();
      if (!token) return;
      setIsHistoryLoading(true);
      const { response, data } = await apiGetSummaries<HistorySummaryItem[]>(token);
      if (response.ok) {
        setSummaries((previous) => {
          if (data.length > 0 && previous.length > 0 && data[0].id !== previous[0].id) {
            setLastAddedId(data[0].id);
            setTimeout(() => setLastAddedId(null), 3000);
          }
          return data;
        });
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(RECENT_GENERATED_QUIZZES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as RecentGeneratedQuiz[];
      if (!Array.isArray(parsed)) return;
      const sanitized = parsed
        .filter(
          (entry) =>
            typeof entry?.id === "number" &&
            typeof entry?.createdAt === "string" &&
            typeof entry?.quiz?.title === "string" &&
            Array.isArray(entry?.quiz?.questions)
        )
        .slice(0, 6);
      setRecentGeneratedQuizzes(sanitized);
    } catch {
      setRecentGeneratedQuizzes([]);
    }
  }, []);

  const planTier = normalizePlanTier(planUser.plan_tier ?? planUser.plan);
  const planMeta = PLAN_CATALOG[planTier];
  const planTierLabel = planTier === "trial" ? "FREE" : planTier.toUpperCase();
  const limit = planUser.quiz_generation_limit ?? planMeta.quizLimit;
  const initialUsed = planUser.quizzes_used ?? 0;
  const [liveUsed, setLiveUsed] = useState(initialUsed);
  const used = liveUsed;
  const remaining = Math.max(0, limit - used);
  const hasNoGenerationsLeft = remaining <= 0;
  const noGenerationsLeftMessage = `You have used all ${limit} generation token${limit === 1 ? "" : "s"}. Upgrade your plan to continue generating.`;
  const progress = useMemo(() => {
    if (limit <= 0) return 0;
    return Math.min(100, Math.max(0, (used / limit) * 100));
  }, [limit, used]);
  const limitLabel = planTier === "trial" ? "Total Limit" : "Monthly Limit";
  const maxQuestions = planUser.max_questions_per_quiz ?? planMeta.maxQuestions;
  const orderedQuizPreviewQuestions = useMemo(
    () => (quizToPreview ? orderQuestionsByType(quizToPreview.questions) : []),
    [quizToPreview]
  );
  const availableQuestionTypeFilters = useMemo(
    () => ["all", ...Array.from(new Set(orderedQuizPreviewQuestions.map((q) => q.type)))],
    [orderedQuizPreviewQuestions]
  );
  const filteredQuizPreviewQuestions = useMemo(() => {
    if (questionTypeFilter === "all") return orderedQuizPreviewQuestions;
    return orderedQuizPreviewQuestions.filter((question) => question.type === questionTypeFilter);
  }, [orderedQuizPreviewQuestions, questionTypeFilter]);
  const recentGeneratedPreview = useMemo(() => recentGeneratedQuizzes.slice(0, 3), [recentGeneratedQuizzes]);

  useEffect(() => {
    setLiveUsed(initialUsed);
  }, [initialUsed]);

  const consumeGenerationOnServer = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      showToast("Session expired. Please log in again.", "error");
      return;
    }

    const { response, data } = await apiConsumeGenerationUsage(token);
    const nextUsedRaw = data?.quizzes_used;
    const nextUsed =
      typeof nextUsedRaw === "number"
        ? nextUsedRaw
        : typeof nextUsedRaw === "string"
          ? Number(nextUsedRaw)
          : NaN;

    if (!response.ok) {
      if (Number.isFinite(nextUsed)) {
        setLiveUsed(Math.max(0, nextUsed));
      }
      if (response.status === 403) {
        setIsUpgradeModalOpen(true);
      }
      showToast(
        typeof data?.message === "string"
          ? data.message
          : "Failed to sync usage with server.",
        "error"
      );
      return;
    }

    if (Number.isFinite(nextUsed)) {
      setLiveUsed(Math.max(0, nextUsed));
      return;
    }

    setLiveUsed((prev) => (limit > 0 ? Math.min(limit, prev + 1) : prev + 1));
  }, [limit, showToast]);

  const openQuizPreview = (quiz: GeneratedQuiz) => {
    setQuizToPreview(quiz);
    setQuestionTypeFilter("all");
    setIsQuizModalOpen(true);
  };

  const handleCancelGeneration = () => {
    activeGenerationAbortControllerRef.current?.abort();
  };

  const handleGenerate = async (data: GeneratePayload) => {
    if (hasNoGenerationsLeft) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    setIsGenerationComplete(false);
    setFileGenerateError("");
    setIsQuizModalOpen(false);
    const abortController = new AbortController();
    activeGenerationAbortControllerRef.current = abortController;

    try {
      const quiz = await generateQuizFromFile(data, maxQuestions, abortController.signal);
      setGeneratedQuiz(quiz);
      setQuizToPreview(quiz);
      const storedQuiz = addGeneratedQuizToStore(quiz);
      setRecentGeneratedQuizzes((prev) => {
        const next = [{ id: storedQuiz.id, createdAt: storedQuiz.created_at, quiz }, ...prev]
          .filter((entry, index, list) => list.findIndex((candidate) => candidate.id === entry.id) === index)
          .slice(0, 6);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(RECENT_GENERATED_QUIZZES_KEY, JSON.stringify(next));
        }
        return next;
      });
      showToast(`Assessment created successfully! ${quiz.questions.length} questions generated.`, "success");
      await consumeGenerationOnServer();
      setIsGenerationComplete(true);
    } catch (error) {
      const isAbortError =
        (error instanceof DOMException && error.name === "AbortError") ||
        (error instanceof Error && error.name === "AbortError");
      if (isAbortError) {
        setIsLoading(false);
        setIsGenerationComplete(false);
        showToast("Generation canceled.", "success");
        return;
      }
      const message = error instanceof Error ? error.message : "Failed to generate quiz from file.";
      setFileGenerateError(message);
      setGeneratedQuiz(null);
      setIsQuizModalOpen(false);
      setIsLoading(false);
      setIsGenerationComplete(false);
    } finally {
      if (activeGenerationAbortControllerRef.current === abortController) {
        activeGenerationAbortControllerRef.current = null;
      }
    }
  };

  const handleGenerateSummary = async () => {
    const trimmedTopic = summaryTopic.trim();

    if (!trimmedTopic) return;
    if (hasNoGenerationsLeft) {
      setIsUpgradeModalOpen(true);
      return;
    }

    const prompt = `Generate a detailed lesson summary for the topic: ${trimmedTopic}`;

    setSummaryError("");
    setIsSummaryLoading(true);

    try {
      const generatedSummary = await generateSummary(prompt);
      const cleanedSummary = generatedSummary
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\n\n(?=#)/g, '\n')
        .replace(/^(#+.*)\n\n/gm, '$1\n');
        
      setSummaryResult(cleanedSummary);
      setIsSummaryModalOpen(true);
      await consumeGenerationOnServer();
      
      // Auto-save to backend
      try {
        const token = getStoredToken();
        if (token) {
          const finalTopic = summaryTitle.trim() || summaryTopic.trim() || "Untitled lesson";
          await apiStoreSummary(token, { topic: finalTopic, content: cleanedSummary });
          loadHistory(); // Refresh history list
          showToast("Lesson generated and saved to history!", "success");
        }
      } catch (saveError) {
        console.error("Failed to auto-save summary:", saveError);
      }
      setQuestionsResult("");
      setIsQuestionsModalOpen(false);
      setSummaryTitle(""); // Clear title
      setSummaryTopic(""); // Clear topic
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate summary.";
      setSummaryError(message);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleSaveSummaryAsPdf = () => {
    downloadSummaryPdf(summaryResult);
  };

  const serializeQuizContent = (quiz: GeneratedQuiz) => {
    const orderedQuestions = orderQuestionsByType(quiz.questions);
    const lines: string[] = [
      `Difficulty: ${quiz.difficulty}`,
      `Total Questions: ${orderedQuestions.length}`,
      "",
    ];

    orderedQuestions.forEach((question, idx) => {
      lines.push(`Q${idx + 1} - ${question.type.replace(/_/g, " ")}`);
      lines.push(question.question);
      if (Array.isArray(question.choices) && question.choices.length > 0) {
        if (question.type === "true_false") {
          question.choices.forEach((choice) => {
            lines.push(`- ${normalizeChoiceText(choice)}`);
          });
        } else {
          question.choices.forEach((choice, choiceIndex) => {
            lines.push(formatChoiceLabel(question.type, choice, choiceIndex));
          });
        }
      }
      if (question.type === "enumeration") {
        const items = parseEnumerationItems(question.answer);
        lines.push("Answer:");
        items.forEach((item) => lines.push(`- ${item}`));
      } else {
        lines.push(`Answer: ${question.answer}`);
      }
      if (question.explanation) {
        lines.push(`Explanation: ${question.explanation}`);
      }
      lines.push("");
      lines.push("------------------------------------------------------------");
      lines.push("");
    });

    return lines.join("\n").trim();
  };

  const handleSaveQuizAsPdf = () => {
    if (!quizToPreview) return;
    downloadSummaryPdf(serializeQuizContent(quizToPreview), {
      fileNamePrefix: "teachify-quiz",
      title: quizToPreview.title,
      subtitle: `Generated ${new Date().toLocaleString()}`,
    });
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

  useEffect(() => {
    return () => {
      activeGenerationAbortControllerRef.current?.abort();
    };
  }, []);

  return (
    <section className="w-full">
      <TeacherHeader
        planLabel={planMeta.label}
        planTier={planTierLabel}
        priceLabel={planMeta.priceLabel}
      />

      <UsageStats
        remaining={remaining}
        limit={limit}
        progress={progress}
        planLabel={planMeta.label}
        limitLabel={limitLabel}
      />

      <ModeSwitcher mode={mode} setMode={setMode} />

      {mode === "file" ? (
        <>
          <FileUploadWorkspace
            onGenerate={handleGenerate}
            isLoading={isLoading}
            planTier={planTier}
            generationsRemaining={remaining}
            onNoGenerationsLeft={() => setIsUpgradeModalOpen(true)}
          />

          {fileGenerateError ? (
            <p className="mt-4 rounded-lg border-2 border-red-900 bg-rose-100 px-4 py-3 text-left text-[13px] font-bold text-red-800">
              {fileGenerateError}
            </p>
          ) : null}

          {generatedQuiz ? (
            <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="m-0 text-[20px] font-black text-[#0f172a]">{generatedQuiz.title}</h4>
                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    Difficulty: {generatedQuiz.difficulty} | {generatedQuiz.questions.length} Questions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openQuizPreview(generatedQuiz)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  View Questions
                </button>
              </div>
              <p className="m-0 text-[13px] font-semibold text-slate-600">
                Questions are ready. Click <span className="font-black">View Questions</span> to open the full set.
              </p>
            </article>
          ) : null}

          {recentGeneratedQuizzes.length > 0 ? (
            <article className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h5 className="m-0 text-[13px] font-black uppercase tracking-[0.08em] text-slate-500">Recent Generated</h5>
                <Link
                  href="/teacher/quizzes"
                  className="text-[11px] font-black uppercase tracking-[0.08em] text-emerald-700 hover:text-emerald-800"
                >
                  See all
                </Link>
              </div>
              <div className="mt-3 grid gap-2">
                {recentGeneratedPreview.map((entry) => (
                  <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                    <div>
                      <p className="m-0 text-[14px] font-black text-slate-900">{entry.quiz.title}</p>
                      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
                        {entry.quiz.questions.length} Questions
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openQuizPreview(entry.quiz)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.06em] text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <article className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_24px_45px_-18px_rgba(15,23,42,0.2)]">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-6 p-6 sm:p-8">
              <header className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">AI Summary Studio</p>
                  <h3 className="mt-2 text-[28px] font-black leading-tight tracking-[-0.03em] text-[#0f172a]">
                    Build a lesson-ready summary
                  </h3>
                  <p className="mt-2 max-w-2xl text-[14px] font-semibold text-slate-500">
                    Share a topic and generate a classroom-friendly summary in seconds.
                  </p>
                </div>
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
                  <Sparkles size={20} strokeWidth={2.5} />
                </div>
              </header>

              <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
                <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={summaryTitle}
                    onChange={(event) => setSummaryTitle(event.target.value)}
                    placeholder="Example: Grade 3 Multiplication"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] font-bold text-[#0f172a] outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-300"
                  />
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-2.5 transition-colors focus-within:border-emerald-300">
                  <div className="pt-2 pl-1 text-emerald-600">
                    <Sparkles size={18} strokeWidth={2.5} />
                  </div>
                  <textarea
                    className="min-h-[112px] w-full resize-none bg-transparent px-1 py-1 text-[19px] font-black leading-tight text-[#0f172a] outline-none placeholder:text-slate-300"
                    placeholder="Example: Photosynthesis for Grade 6 students"
                    rows={3}
                    value={summaryTopic}
                    onChange={(event) => setSummaryTopic(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        if (!isSummaryLoading && summaryTopic.trim()) {
                          void handleGenerateSummary();
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={isSummaryLoading || !summaryTopic.trim()}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-900 bg-[#0f172a] px-5 text-[12px] font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-800 sm:w-auto disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSummaryLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Summary</span>
                      <ArrowRight size={16} strokeWidth={2.75} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {summaryError ? (
                <p className="m-0 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[12px]">!</span>
                  {summaryError}
                </p>
              ) : null}
            </div>
          </article>

          {/* Right Column: Recent Summaries */}
          <HistorySidebar
            summaries={summaries}
            lastAddedId={lastAddedId}
            isHistoryLoading={isHistoryLoading}
            onSummaryClick={(s) => {
              setSummaryResult(s.content);
              setIsSummaryModalOpen(true);
            }}
          />
        </div>
      )}

      {isLoading ? (
        <LoadingOverlay
          isComplete={isGenerationComplete}
          onComplete={() => {
            setIsLoading(false);
            setIsGenerationComplete(false);
          }}
          onCancel={handleCancelGeneration}
        />
      ) : null}

      {/* Generated Quiz Modal */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        title={quizToPreview?.title ?? "Generated Quiz"}
        footer={
          <DocumentModalActions
            onExportPdf={handleSaveQuizAsPdf}
          />
        }
      >
        {quizToPreview ? (
          <div className="grid gap-4">
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Difficulty: {quizToPreview.difficulty} | {filteredQuizPreviewQuestions.length} of {orderedQuizPreviewQuestions.length} Questions
            </p>

            <div className="flex flex-wrap gap-2">
              {availableQuestionTypeFilters.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setQuestionTypeFilter(type)}
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

            {filteredQuizPreviewQuestions.map((question, idx) => (
              <QuestionPreviewCard
                key={`${idx}-${question.question}`}
                question={question}
                questionNumber={idx + 1}
                variant="modal"
              />
            ))}
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Generation Limit Reached"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(false)}
              className="rounded-lg border-2 border-slate-900 bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-100"
            >
              Maybe Later
            </button>
            <Link
              href="/teacher"
              onClick={() => setIsUpgradeModalOpen(false)}
              className="rounded-lg border-2 border-slate-900 bg-yellow-200 px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-900 no-underline transition hover:bg-yellow-300"
            >
              Upgrade Plan
            </Link>
          </>
        }
      >
        <div className="space-y-3">
          <p className="m-0 text-[14px] font-bold text-slate-700">{noGenerationsLeftMessage}</p>
          <p className="m-0 text-[13px] font-semibold text-slate-600">
            Upgrade your subscription to unlock more generations and keep creating lessons and quizzes.
          </p>
        </div>
      </Modal>

      {/* Summary Modal */}
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        title="AI Generation Summary"
        footer={
          <DocumentModalActions
            isCopied={isCopied}
            onCopy={() => handleCopyToClipboard(summaryResult)}
            onExportPdf={handleSaveSummaryAsPdf}
          />
        }
      >
        <GeneratedDocumentViewer content={summaryResult} />
      </Modal>

      {/* Questions Modal */}
      <Modal
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        title="Generated Questions"
        footer={
          <DocumentModalActions
            isCopied={isCopied}
            onCopy={() => handleCopyToClipboard(questionsResult)}
            copyLabel="Copy Questions"
          />
        }
      >
        <GeneratedDocumentViewer content={questionsResult} />
      </Modal>
    </section>
  );
}
