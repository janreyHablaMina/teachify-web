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
import { apiMe } from "@/lib/api/client";
import { parseTeacherProfile } from "@/lib/auth/profile";
import { getStoredToken } from "@/lib/auth/session";
import { generateQuizFromFile, generateQuestionsFromSummary, generateSummary } from "@/lib/teacher/generate-service";
import { downloadSummaryPdf } from "@/lib/pdf/download-summary-pdf";
import { addGeneratedQuizToStore } from "@/lib/teacher/quiz-store";
import { Modal } from "@/components/ui/modal";
import { Check, Copy, FileText, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast/toast-provider";

export default function TeacherGeneratePage() {
  const { showToast } = useToast();
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
  const [planUser, setPlanUser] = useState<TeacherPlanUser>({
    plan: "trial",
    plan_tier: "trial",
    quiz_generation_limit: 3,
    quizzes_used: 0,
    max_questions_per_quiz: 10,
  });

  useEffect(() => {
    let mounted = true;

    async function loadPlan() {
      try {
        const token = getStoredToken();
        const { response, data } = await apiMe(token ?? undefined);
        if (!response.ok || !mounted) return;

        const parsedProfile = parseTeacherProfile(data);
        setPlanUser((prev) => ({
          ...prev,
          plan: parsedProfile.plan,
          plan_tier: parsedProfile.planTier,
          ...(typeof parsedProfile.quizGenerationLimit === "number"
            ? { quiz_generation_limit: parsedProfile.quizGenerationLimit }
            : {}),
          ...(typeof parsedProfile.quizzesUsed === "number"
            ? { quizzes_used: parsedProfile.quizzesUsed }
            : {}),
          ...(typeof parsedProfile.maxQuestionsPerQuiz === "number"
            ? { max_questions_per_quiz: parsedProfile.maxQuestionsPerQuiz }
            : {}),
        }));
      } catch {
        // Keep default UI values if profile fetch fails.
      }
    }

    loadPlan();

    return () => {
      mounted = false;
    };
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
      setSummaryResult(generatedSummary);
      setIsSummaryModalOpen(true);
      setQuestionsResult("");
      setQuestionsError("");
      setIsQuestionsModalOpen(false);
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
        <article className="rounded-[18px] border border-slate-900/10 bg-white p-10 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-slate-900 bg-yellow-200 shadow-[4px_4px_0_#0f172a]">
            <span className="text-3xl font-black text-slate-900">AI</span>
          </div>
          <h3 className="text-[24px] font-black text-[#0f172a]">AI Chat Summary</h3>
          <p className="mt-2 text-[15px] font-bold text-slate-500">Ask AI to summarize complex topics or compare different models.</p>
          <div className="mt-8">
            <textarea
              className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 p-6 text-[15px] font-bold outline-none transition focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              placeholder="e.g. Summarize the life of Jose Rizal for 5th graders..."
              rows={4}
              value={summaryPrompt}
              onChange={(event) => setSummaryPrompt(event.target.value)}
            />
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isSummaryLoading || !summaryPrompt.trim()}
              className="mt-6 w-full rounded-[10px] border-2 border-slate-900 bg-[#99f6e4] py-4 text-[14px] font-black uppercase tracking-wider text-slate-900 shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1 hover:bg-[#5eead4] disabled:transform-none disabled:opacity-50 disabled:shadow-none"
            >
              {isSummaryLoading ? "Generating Summary..." : "Generate Summary"}
            </button>

            {summaryError ? (
              <p className="mt-4 rounded-lg border-2 border-red-900 bg-rose-100 px-4 py-3 text-left text-[13px] font-bold text-red-800">
                {summaryError}
              </p>
            ) : null}

            {summaryResult ? (
              <div className="mt-5 rounded-2xl border-2 border-slate-900 bg-white p-5 text-left shadow-[4px_4px_0_#0f172a]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[1.5px] border-slate-900 bg-blue-50 text-blue-500 shadow-[2px_2px_0_#0f172a]">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="m-0 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Result ready</p>
                      <h5 className="m-0 text-[15px] font-black text-[#0f172a]">AI Summary</h5>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSummaryModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-[#f0fdfa] px-4 py-2 text-[12px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-teal-100 hover:-translate-y-0.5"
                    >
                      View Summary
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSummaryAsPdf}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-[12px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-slate-50 hover:-translate-y-0.5"
                    >
                      Export PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateQuestionsFromSummary}
                      disabled={isQuestionsLoading}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-[#fef08a] px-4 py-2 text-[12px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-yellow-200 disabled:opacity-60 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isQuestionsLoading ? "Thinking..." : "Get Questions"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {questionsError ? (
              <p className="mt-4 rounded-lg border-2 border-red-900 bg-rose-100 px-4 py-3 text-left text-[13px] font-bold text-red-800">
                {questionsError}
              </p>
            ) : null}

            {questionsResult ? (
              <div className="mt-5 rounded-2xl border-2 border-slate-900 bg-white p-5 text-left shadow-[4px_4px_0_#0f172a]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[1.5px] border-slate-900 bg-yellow-50 text-amber-500 shadow-[2px_2px_0_#0f172a]">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <p className="m-0 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Assessment ready</p>
                      <h5 className="m-0 text-[15px] font-black text-[#0f172a]">AI Generated Quiz</h5>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQuestionsModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-[#f0fdfa] px-4 py-2 text-[12px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-teal-100 hover:-translate-y-0.5"
                  >
                    View Quiz
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </article>
      )}

      <LoadingOverlay isLoading={isLoading} />

      {/* Summary Modal */}
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        title="AI Generation Summary"
        footer={
          <button
            onClick={() => handleCopyToClipboard(summaryResult)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-slate-50"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            {isCopied ? "Copied!" : "Copy Content"}
          </button>
        }
      >
        {summaryResult}
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
        {questionsResult}
      </Modal>
    </section>
  );
}
