"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { PLAN_CATALOG, normalizePlanTier } from "@/components/teacher/dashboard/plan";
import { UsageStats } from "@/components/teacher/generate/usage-stats";
import { ModeSwitcher } from "@/components/teacher/generate/mode-switcher";
import { FileUploadWorkspace } from "@/components/teacher/generate/file-upload-workspace";
import { LoadingOverlay } from "@/components/teacher/generate/loading-overlay";
import type { GeneratePayload, GeneratedQuiz } from "@/components/teacher/generate/types";
import type { TeacherPlanUser } from "@/components/teacher/dashboard/types";
import { apiMe, apiStoreSummary, apiGetSummaries } from "@/lib/api/client";
import { parseTeacherProfile } from "@/lib/auth/profile";
import { getStoredToken } from "@/lib/auth/session";
import { generateQuizFromFile, generateQuestionsFromSummary, generateSummary } from "@/lib/teacher/generate-service";
import { downloadSummaryPdf } from "@/lib/pdf/download-summary-pdf";
import { addGeneratedQuizToStore } from "@/lib/teacher/quiz-store";
import { Modal } from "@/components/ui/modal";
import { Check, Copy, FileText, HelpCircle, BookOpen, ArrowRight, Clock, Download, Sparkles } from "lucide-react";
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
  const [summaryTopic, setSummaryTopic] = useState("");
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [planUser, setPlanUser] = useState<TeacherPlanUser>({
    plan: "trial",
    plan_tier: "trial",
    quiz_generation_limit: 3,
    quizzes_used: 0,
    max_questions_per_quiz: 10,
  });

  const loadHistory = async () => {
    try {
      const token = getStoredToken();
      if (!token) return;
      setIsHistoryLoading(true);
      const { response, data } = await apiGetSummaries(token);
      if (response.ok) {
        if (data.length > 0 && summaries.length > 0 && data[0].id !== summaries[0].id) {
           setLastAddedId(data[0].id);
           setTimeout(() => setLastAddedId(null), 3000); // Remove highlight after 3s
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
    loadHistory();

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
             {/* Redesigned AI Header */}
             <div className="border-b-2 border-slate-900 bg-indigo-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4 text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white text-indigo-500 shadow-[3px_3px_0_#0f172a]">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-black text-[#0f172a]">Teachify AI</h3>
                    <p className="text-[13px] font-bold text-slate-500">Enhanced synthesis & curriculum design assistant.</p>
                  </div>
               </div>
             </div>

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
          <aside className="flex flex-col gap-6">
            <div className="rounded-[18px] border-2 border-slate-900 bg-slate-50 p-6 shadow-[6px_6px_0_#94a3b8]">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border-[1.5px] border-slate-900 bg-indigo-50 text-indigo-500 shadow-[2px_2px_0_#0f172a]">
                        <Clock size={18} />
                      </div>
                      <h4 className="m-0 text-[16px] font-black text-[#0f172a]">Recent History</h4>
                   </div>
                   <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">{summaries.length} total</span>
                </div>

                <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                  {isHistoryLoading ? (
                    <div className="py-10 text-center">
                       <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mx-auto" />
                    </div>
                  ) : summaries.length > 0 ? (
                    summaries.slice(0, 8).map((s, index) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSummaryResult(s.content);
                          setSummaryPrompt(s.topic);
                          setIsSummaryModalOpen(true);
                        }}
                        className={`flex items-center gap-3 w-full rounded-xl border-[1.5px] border-slate-900 bg-white p-3 text-left transition hover:bg-white hover:translate-x-1 hover:shadow-[4px_4px_0_#4f46e5] group ${
                          index === 0 && s.id === lastAddedId 
                            ? "animate-in fade-in zoom-in-95 slide-in-from-right-8 duration-700 ring-[3px] ring-indigo-500/20 bg-indigo-50/30 border-indigo-600 scale-[1.02]" 
                            : ""
                        }`}
                      >
                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-slate-900 bg-white text-indigo-500 transition group-hover:bg-indigo-500 group-hover:text-white">
                           <BookOpen size={18} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h5 className="truncate text-[13px] font-black text-[#0f172a]">{s.topic}</h5>
                            <p className="text-[11px] font-bold text-slate-400">
                               {new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                            </p>
                         </div>
                         <ArrowRight size={14} className="text-slate-300 transition group-hover:text-indigo-500 group-hover:translate-x-1" />
                      </button>
                    ))
                  ) : (
                    <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                       <p className="text-[12px] font-bold text-slate-400">No history yet.</p>
                    </div>
                  )}
                </div>

                {summaries.length > 8 && (
                   <a
                    href="/teacher/lessons"
                    className="mt-4 block w-full text-center py-3 rounded-xl border-2 border-slate-900 bg-white text-[12px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-slate-50"
                   >
                     Show All Lessons
                   </a>
                )}
            </div>
          </aside>
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
        <div className="leading-normal text-slate-700 font-medium [&>h1]:mb-0 [&>h2]:mb-0 [&>h3]:mb-0 [&>h1+p]:mt-[-20px] [&>h2+p]:mt-[-20px] [&>h3+p]:mt-[-20px]">
          <ReactMarkdown
             components={{
               h1: ({node, ...props}: any) => <h1 className="text-[20px] font-black text-slate-900 mt-4 mb-[-20px] underline decoration-[#fef08a] decoration-4 underline-offset-4" {...props}/>,
               h2: ({node, ...props}: any) => <h2 className="text-[18px] font-black text-slate-900 mt-4 mb-[-20px]" {...props}/>,
               h3: ({node, ...props}: any) => <h3 className="text-[16px] font-black text-slate-900 mt-4 mb-[-20px]" {...props}/>,
               strong: ({node, ...props}: any) => <strong className="font-black text-slate-900" {...props}/>,
               ul: ({node, ...props}: any) => <ul className="list-disc pl-5 mb-3" {...props}/>,
               p: ({node, children, ...props}: any) => {
                 if (!children || (Array.isArray(children) && children.length === 0)) return null;
                 return <p className="mb-3 mt-0" {...props}>{children}</p>;
               },
             }}
          >
            {summaryResult}
          </ReactMarkdown>
        </div>
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
