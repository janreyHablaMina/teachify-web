"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { PLAN_CATALOG, normalizePlanTier } from "@/components/teacher/dashboard/plan";
import { UsageStats } from "@/components/teacher/generate/usage-stats";
import { ModeSwitcher } from "@/components/teacher/generate/mode-switcher";
import { FileUploadWorkspace } from "@/components/teacher/generate/file-upload-workspace";
import { LoadingOverlay } from "@/components/teacher/generate/loading-overlay";
import type { GeneratePayload, GeneratedQuiz } from "@/components/teacher/generate/types";
import type { TeacherPlanUser } from "@/components/teacher/dashboard/types";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import { apiStoreSummary, apiGetSummaries } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { generateQuizFromFile, generateQuestionsFromSummary, generateSummary } from "@/lib/teacher/generate-service";
import { downloadSummaryPdf } from "@/lib/pdf/download-summary-pdf";
import { addGeneratedQuizToStore } from "@/lib/teacher/quiz-store";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast/toast-provider";
import { AIEngineHeader } from "@/components/teacher/generate/ai-engine-header";
import { HistorySidebar, type HistorySummaryItem } from "@/components/teacher/generate/history-sidebar";
import { GeneratedDocumentViewer } from "@/components/teacher/generate/generated-document-viewer";
import { DocumentModalActions } from "@/components/teacher/shared/document-modal-actions";

const RECENT_GENERATED_QUIZZES_KEY = "teachify_recent_generated_quizzes_v1";

type RecentGeneratedQuiz = {
  id: number;
  createdAt: string;
  quiz: GeneratedQuiz;
};

const QUESTION_TYPE_ORDER: Record<string, number> = {
  multiple_choice: 0,
  true_false: 1,
  enumeration: 2,
  matching: 3,
  identification: 4,
  fill_in_the_blanks: 5,
  short_answer: 6,
  essay: 7,
};

function normalizeChoiceText(choice: string) {
  let value = choice.trim();
  const choicePrefixPattern = /^[A-Za-z]\s*[\)\.\-:]\s*/;
  while (choicePrefixPattern.test(value)) {
    value = value.replace(choicePrefixPattern, "").trim();
  }
  return value;
}

function formatChoiceLabel(questionType: string, choice: string, index: number) {
  const normalized = normalizeChoiceText(choice);
  if (questionType === "multiple_choice") {
    return `${String.fromCharCode(65 + index)}. ${normalized}`;
  }
  return normalized;
}

function formatQuestionTypeLabel(type: string) {
  return type.replace(/_/g, " ");
}

function parseEnumerationItems(answer: string) {
  return answer
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function orderQuestions(quiz: GeneratedQuiz): GeneratedQuiz["questions"] {
  return quiz.questions
    .map((question, index) => ({ question, index }))
    .sort((a, b) => {
      const aOrder = QUESTION_TYPE_ORDER[a.question.type] ?? 999;
      const bOrder = QUESTION_TYPE_ORDER[b.question.type] ?? 999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.index - b.index;
    })
    .map((entry) => entry.question);
}

export default function TeacherGeneratePage() {
  const { showToast } = useToast();
  const session = useTeacherSession();
  const activeGenerationAbortControllerRef = useRef<AbortController | null>(null);
  const [mode, setMode] = useState<"chat" | "file">("file");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [quizToPreview, setQuizToPreview] = useState<GeneratedQuiz | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [questionTypeFilter, setQuestionTypeFilter] = useState("all");
  const [recentGeneratedQuizzes, setRecentGeneratedQuizzes] = useState<RecentGeneratedQuiz[]>([]);
  const [fileGenerateError, setFileGenerateError] = useState("");
  const [summaryPrompt, setSummaryPrompt] = useState("");
  const [summaryResult, setSummaryResult] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [questionsResult, setQuestionsResult] = useState("");
  const [questionsError, setQuestionsError] = useState("");
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
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

  const loadHistory = async () => {
    try {
      const token = getStoredToken();
      if (!token) return;
      setIsHistoryLoading(true);
      const { response, data } = await apiGetSummaries<HistorySummaryItem[]>(token);
      if (response.ok) {
        if (data.length > 0 && summaries.length > 0 && data[0].id !== summaries[0].id) {
           setLastAddedId(data[0].id);
           setTimeout(() => setLastAddedId(null), 3000);
        }
        setSummaries(data);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

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
  const limit = planUser.quiz_generation_limit ?? (planTier === "trial" ? 3 : 0);
  const used = planUser.quizzes_used ?? 0;
  const remaining = Math.max(0, limit - used);
  const progress = useMemo(() => {
    if (limit <= 0) return 0;
    return Math.min(100, Math.max(0, (used / limit) * 100));
  }, [limit, used]);
  const limitLabel = planTier === "trial" ? "Total Limit" : "Monthly Limit";
  const maxQuestions = planUser.max_questions_per_quiz ?? planMeta.maxQuestions;
  const orderedQuizPreviewQuestions = useMemo(
    () => (quizToPreview ? orderQuestions(quizToPreview) : []),
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

  const openQuizPreview = (quiz: GeneratedQuiz) => {
    setQuizToPreview(quiz);
    setQuestionTypeFilter("all");
    setIsQuizModalOpen(true);
  };

  const handleCancelGeneration = () => {
    activeGenerationAbortControllerRef.current?.abort();
  };

  const handleGenerate = async (data: GeneratePayload) => {
    setIsLoading(true);
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
    } catch (error) {
      const isAbortError =
        (error instanceof DOMException && error.name === "AbortError") ||
        (error instanceof Error && error.name === "AbortError");
      if (isAbortError) {
        showToast("Generation canceled.", "success");
        return;
      }
      const message = error instanceof Error ? error.message : "Failed to generate quiz from file.";
      setFileGenerateError(message);
      setGeneratedQuiz(null);
      setIsQuizModalOpen(false);
    } finally {
      if (activeGenerationAbortControllerRef.current === abortController) {
        activeGenerationAbortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!summaryPrompt.trim()) return;

    setSummaryError("");
    setIsSummaryLoading(true);

    try {
      const generatedSummary = await generateSummary(summaryPrompt);
      const cleanedSummary = generatedSummary
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\n\n(?=#)/g, '\n')
        .replace(/^(#+.*)\n\n/gm, '$1\n');
        
      setSummaryResult(cleanedSummary);
      
      // Auto-save to backend
      try {
        const token = getStoredToken();
        if (token) {
          const finalTopic = summaryTopic.trim() || summaryPrompt.substring(0, 50);
          await apiStoreSummary(token, { topic: finalTopic, content: cleanedSummary });
          loadHistory(); // Refresh history list
          showToast("Lesson generated and saved to history!", "success");
        }
      } catch (saveError) {
        console.error("Failed to auto-save summary:", saveError);
      }
      setQuestionsResult("");
      setQuestionsError("");
      setIsQuestionsModalOpen(false);
      setSummaryPrompt(""); // Clear input
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
    const orderedQuestions = orderQuestions(quiz);
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

  const handleGenerateQuestionsFromSummary = async () => {
    if (!summaryResult.trim()) return;
    setQuestionsError("");
    setIsQuestionsLoading(true);

    try {
      const generatedQuestions = await generateQuestionsFromSummary(summaryResult);
      setQuestionsResult(generatedQuestions);
      setIsQuestionsModalOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate questions.";
      setQuestionsError(message);
    } finally {
      setIsQuestionsLoading(false);
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
          <article className="rounded-[18px] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#94a3b8] overflow-hidden">
             <AIEngineHeader />

             <div className="p-8 text-left space-y-6">
              <div>
                <label className="block text-[12px] font-black uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                  Lesson Topic
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-6 py-3.5 text-[15px] font-bold outline-none transition focus:bg-white focus:ring-4 focus:ring-teal-500/10 shadow-inner"
                  placeholder="e.g. Life of Snow White"
                  value={summaryTopic}
                  onChange={(event) => setSummaryTopic(event.target.value)}
                />
              </div>

              <div>
                <label className="block text-[12px] font-black uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                  AI Instructions
                </label>
                <textarea
                  className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 p-6 text-[15px] font-bold outline-none transition focus:bg-white focus:ring-4 focus:ring-teal-500/10 shadow-inner"
                  placeholder="e.g. Summarize the life of Snow White for 5th graders..."
                  rows={4}
                  value={summaryPrompt}
                  onChange={(event) => setSummaryPrompt(event.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isSummaryLoading || !summaryPrompt.trim()}
                className="mt-2 w-full rounded-xl border-2 border-slate-900 bg-[#99f6e4] py-4 text-[14px] font-black uppercase tracking-wider text-slate-900 shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1 hover:bg-[#5eead4] disabled:transform-none disabled:opacity-50 disabled:shadow-none active:translate-y-0"
              >
                {isSummaryLoading ? "Generating Summary..." : "Generate Summary"}
              </button>

              {summaryError ? (
                <p className="mt-4 rounded-lg border-2 border-red-900 bg-rose-100 px-4 py-3 text-left text-[13px] font-bold text-red-800">
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
              setSummaryPrompt(s.topic);
              setIsSummaryModalOpen(true);
            }}
          />
        </div>
      )}

      <LoadingOverlay isLoading={isLoading} onCancel={handleCancelGeneration} />

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
              <article key={`${idx}-${question.question}`} className="rounded-xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a]">
                <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
                  Q{idx + 1} - {formatQuestionTypeLabel(question.type)}
                </p>
                <p className="mt-2 text-[15px] font-bold text-[#0f172a]">{question.question}</p>
                {Array.isArray(question.choices) && question.choices.length > 0 ? (
                  <ul className="mt-3 list-disc pl-5 text-[14px] font-semibold text-slate-700">
                    {question.choices.map((choice, choiceIndex) => (
                      <li key={`${idx}-${choiceIndex}`}>
                        {formatChoiceLabel(question.type, choice, choiceIndex)}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {question.type === "enumeration" ? (
                  <div className="mt-3">
                    <p className="m-0 text-[13px] font-black text-teal-700">Answer:</p>
                    <ul className="mt-1 list-disc pl-5 text-[14px] font-semibold text-teal-700">
                      {parseEnumerationItems(question.answer).map((item, itemIndex) => (
                        <li key={`${idx}-enum-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-3 text-[13px] font-black text-teal-700">Answer: {question.answer}</p>
                )}
                {question.explanation ? (
                  <p className="mt-1 text-[13px] font-semibold text-slate-600">{question.explanation}</p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
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
