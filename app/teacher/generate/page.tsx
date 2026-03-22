"use client";

import { useEffect, useMemo, useState } from "react";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { PLAN_CATALOG, normalizePlanTier } from "@/components/teacher/dashboard/plan";
import { UsageStats } from "@/components/teacher/generate/usage-stats";
import { ModeSwitcher } from "@/components/teacher/generate/mode-switcher";
import { FileUploadWorkspace } from "@/components/teacher/generate/file-upload-workspace";
import { LoadingOverlay } from "@/components/teacher/generate/loading-overlay";
import type { GeneratePayload, GeneratedQuiz } from "@/components/teacher/generate/types";
import type { TeacherPlanUser } from "@/components/teacher/dashboard/types";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import { apiMe, apiStoreSummary, apiGetSummaries } from "@/lib/api/client";
import { parseTeacherProfile } from "@/lib/auth/profile";
import { getStoredToken } from "@/lib/auth/session";
import { generateQuizFromFile, generateQuestionsFromSummary, generateSummary } from "@/lib/teacher/generate-service";
import { downloadSummaryPdf } from "@/lib/pdf/download-summary-pdf";
import { addGeneratedQuizToStore } from "@/lib/teacher/quiz-store";
import { Modal } from "@/components/ui/modal";
import { Check, Copy, FileText, HelpCircle, BookOpen, ArrowRight, Clock, Download } from "lucide-react";
import { useToast } from "@/components/ui/toast/toast-provider";
import { AIEngineHeader } from "@/components/teacher/generate/ai-engine-header";
import { HistorySidebar } from "@/components/teacher/generate/history-sidebar";
import { GeneratedDocumentViewer } from "@/components/teacher/generate/generated-document-viewer";

export default function TeacherGeneratePage() {
  const { showToast } = useToast();
  const session = useTeacherSession();
  const [mode, setMode] = useState<"chat" | "file">("file");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
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
  const [summaries, setSummaries] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Derive plan from global session to avoid "Free Plan" flash
  const planUser: TeacherPlanUser = useMemo(() => ({
    plan: session?.plan ?? "trial",
    plan_tier: session?.planTier ?? "trial",
    quiz_generation_limit: session?.quizGenerationLimit ?? 3,
    quizzes_used: session?.quizzesUsed ?? 0,
    max_questions_per_quiz: session?.maxQuestionsPerQuiz ?? 10,
  }), [session]);

  const loadHistory = async () => {
    try {
      const token = getStoredToken();
      if (!token) return;
      setIsHistoryLoading(true);
      const { response, data } = await apiGetSummaries(token);
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

  const handleGenerate = async (data: GeneratePayload) => {
    setIsLoading(true);
    setFileGenerateError("");

    try {
      const quiz = await generateQuizFromFile(data, maxQuestions);
      setGeneratedQuiz(quiz);
      addGeneratedQuizToStore(quiz);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate quiz from file.";
      setFileGenerateError(message);
      setGeneratedQuiz(null);
    } finally {
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
            <article className="mt-8 rounded-[18px] border-2 border-dashed border-slate-900/35 bg-teal-50 p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="m-0 text-[22px] font-black text-[#0f172a]">{generatedQuiz.title}</h4>
                  <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.08em] text-slate-600">
                    Difficulty: {generatedQuiz.difficulty} | {generatedQuiz.questions.length} Questions
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {generatedQuiz.questions.map((question, idx) => (
                  <article key={`${idx}-${question.question}`} className="rounded-xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a]">
                    <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
                      Q{idx + 1} - {question.type.replace("_", " ")}
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-[#0f172a]">{question.question}</p>
                    {Array.isArray(question.choices) && question.choices.length > 0 ? (
                      <ul className="mt-3 list-disc pl-5 text-[14px] font-semibold text-slate-700">
                        {question.choices.map((choice, choiceIndex) => (
                          <li key={`${idx}-${choiceIndex}`}>{choice}</li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="mt-3 text-[13px] font-black text-teal-700">Answer: {question.answer}</p>
                    {question.explanation ? (
                      <p className="mt-1 text-[13px] font-semibold text-slate-600">{question.explanation}</p>
                    ) : null}
                  </article>
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

      <LoadingOverlay isLoading={isLoading} />

      {/* Summary Modal */}
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        title="AI Generation Summary"
        footer={
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCopyToClipboard(summaryResult)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-slate-50"
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
              {isCopied ? "Copied!" : "Copy Content"}
            </button>
            <button
               onClick={() => handleSaveSummaryAsPdf()}
               className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-[#fef08a] px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-yellow-200"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
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
          <button
            onClick={() => handleCopyToClipboard(questionsResult)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-slate-50"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            {isCopied ? "Copied!" : "Copy Questions"}
          </button>
        }
      >
        <GeneratedDocumentViewer content={questionsResult} />
      </Modal>
    </section>
  );
}
