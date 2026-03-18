"use client";

import { useEffect, useMemo, useState } from "react";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { PLAN_CATALOG, normalizePlanTier } from "@/components/teacher/dashboard/plan";
import { UsageStats } from "@/components/teacher/generate/usage-stats";
import { ModeSwitcher } from "@/components/teacher/generate/mode-switcher";
import { FileUploadWorkspace } from "@/components/teacher/generate/file-upload-workspace";
import { LoadingOverlay } from "@/components/teacher/generate/loading-overlay";
import type { TeacherPlanUser } from "@/components/teacher/dashboard/types";
import { apiGenerateSummary, apiMe, getApiErrorMessage } from "@/lib/api/client";
import { parseTeacherProfile } from "@/lib/auth/profile";
import { getStoredToken } from "@/lib/auth/session";

type GeneratePayload = {
  title: string;
  file: File;
  types: string[];
};

export default function TeacherGeneratePage() {
  const [mode, setMode] = useState<"chat" | "file">("file");
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [summaryPrompt, setSummaryPrompt] = useState("");
  const [summaryResult, setSummaryResult] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [questionsResult, setQuestionsResult] = useState("");
  const [questionsError, setQuestionsError] = useState("");
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
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

  const handleGenerate = (data: GeneratePayload) => {
    void data;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 4000);
  };

  const handleGenerateSummary = async () => {
    if (!summaryPrompt.trim()) return;

    setSummaryError("");
    setIsSummaryLoading(true);

    try {
      const { response, data } = await apiGenerateSummary({ prompt: summaryPrompt.trim() });
      if (!response.ok) {
        throw new Error(getApiErrorMessage(response, data, "Failed to generate summary."));
      }

      const generatedSummary = typeof data.summary === "string" ? data.summary.trim() : "";
      if (!generatedSummary) {
        throw new Error("No summary was generated. Please try again.");
      }

      setSummaryResult(generatedSummary);
      setQuestionsResult("");
      setQuestionsError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate summary.";
      setSummaryError(message);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleSaveSummaryAsPdf = () => {
    if (!summaryResult.trim()) return;
    const encoder = new TextEncoder();
    const byteLength = (value: string) => encoder.encode(value).length;
    const escapePdfText = (value: string) =>
      value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const sanitize = (value: string) =>
      value.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
    const wrapLine = (line: string, maxChars: number) => {
      const words = sanitize(line).split(" ").filter(Boolean);
      if (words.length === 0) return [""];
      const lines: string[] = [];
      let current = "";
      for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        if (next.length <= maxChars) {
          current = next;
          continue;
        }
        if (current) lines.push(current);
        current = word;
      }
      if (current) lines.push(current);
      return lines;
    };

    const rawLines = summaryResult.split(/\r?\n/);
    const bodyLines = rawLines.flatMap((line) => (line.trim() ? wrapLine(line, 88) : [""]));
    const allLines = [`AI Summary - ${new Date().toLocaleString()}`, "", ...bodyLines];
    const linesPerPage = 46;
    const pages: string[][] = [];
    for (let i = 0; i < allLines.length; i += linesPerPage) {
      pages.push(allLines.slice(i, i + linesPerPage));
    }

    const pageCount = Math.max(1, pages.length);
    const pageObjectIds = Array.from({ length: pageCount }, (_, i) => 3 + i);
    const contentObjectIds = Array.from({ length: pageCount }, (_, i) => 3 + pageCount + i);
    const fontObjectId = 3 + pageCount * 2;

    const objects = new Map<number, string>();
    objects.set(1, "<< /Type /Catalog /Pages 2 0 R >>");
    objects.set(
      2,
      `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`
    );

    for (let i = 0; i < pageCount; i += 1) {
      const pageId = pageObjectIds[i];
      const contentId = contentObjectIds[i];
      const pageLines = pages[i] ?? [""];
      const textOps = [
        "BT",
        "/F1 12 Tf",
        "16 TL",
        "50 760 Td",
      ];
      for (const line of pageLines) {
        textOps.push(`(${escapePdfText(line)}) Tj`);
        textOps.push("T*");
      }
      textOps.push("ET");
      const stream = textOps.join("\n");
      const contentBody = `<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`;
      objects.set(contentId, contentBody);

      const pageBody = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentId} 0 R >>`;
      objects.set(pageId, pageBody);
    }

    objects.set(fontObjectId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

    const maxObjectId = fontObjectId;
    let pdf = "%PDF-1.4\n";
    const offsets: number[] = Array(maxObjectId + 1).fill(0);

    for (let id = 1; id <= maxObjectId; id += 1) {
      const body = objects.get(id) ?? "";
      offsets[id] = byteLength(pdf);
      pdf += `${id} 0 obj\n${body}\nendobj\n`;
    }

    const xrefOffset = byteLength(pdf);
    pdf += `xref\n0 ${maxObjectId + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (let id = 1; id <= maxObjectId; id += 1) {
      pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${maxObjectId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([encoder.encode(pdf)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teachify-summary-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleGenerateQuestionsFromSummary = async () => {
    if (!summaryResult.trim()) return;
    setQuestionsError("");
    setIsQuestionsLoading(true);

    try {
      const { response, data } = await apiGenerateSummary({
        prompt: summaryResult,
        task: "questions",
      });

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response, data, "Failed to generate questions."));
      }

      const generatedQuestions = typeof data.summary === "string" ? data.summary.trim() : "";
      if (!generatedQuestions) {
        throw new Error("No questions were generated. Please try again.");
      }

      setQuestionsResult(generatedQuestions);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate questions.";
      setQuestionsError(message);
    } finally {
      setIsQuestionsLoading(false);
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
        <FileUploadWorkspace
          onGenerate={handleGenerate}
          isLoading={isLoading}
          planTier={planTier}
        />
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
              <div className="mt-5 rounded-xl border-2 border-slate-900 bg-white p-5 text-left shadow-[4px_4px_0_#0f172a]">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Generated Summary</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleSaveSummaryAsPdf}
                      className="rounded-md border-2 border-slate-900 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.06em] text-slate-900 transition hover:bg-slate-50"
                    >
                      Save as PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateQuestionsFromSummary}
                      disabled={isQuestionsLoading}
                      className="rounded-md border-2 border-slate-900 bg-[#fef08a] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.06em] text-slate-900 transition hover:bg-yellow-200 disabled:opacity-60"
                    >
                      {isQuestionsLoading ? "Generating..." : "Generate Questions"}
                    </button>
                  </div>
                </div>
                <p className="m-0 whitespace-pre-wrap text-[14px] font-semibold leading-[1.7] text-[#0f172a]">{summaryResult}</p>
              </div>
            ) : null}

            {questionsError ? (
              <p className="mt-4 rounded-lg border-2 border-red-900 bg-rose-100 px-4 py-3 text-left text-[13px] font-bold text-red-800">
                {questionsError}
              </p>
            ) : null}

            {questionsResult ? (
              <div className="mt-5 rounded-xl border-2 border-slate-900 bg-white p-5 text-left shadow-[4px_4px_0_#0f172a]">
                <p className="m-0 mb-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Generated Questions</p>
                <p className="m-0 whitespace-pre-wrap text-[14px] font-semibold leading-[1.7] text-[#0f172a]">{questionsResult}</p>
              </div>
            ) : null}
          </div>
        </article>
      )}

      {showResult && (
        <article className="mt-8 rounded-[18px] border-2 border-dashed border-slate-900/35 bg-teal-50 p-8">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-xl font-black text-slate-900">OK</span>
            <h4 className="mt-4 text-[22px] font-black text-[#0f172a]">Quiz Successfully Generated!</h4>
            <p className="mt-2 text-[14px] font-bold text-[#0f172a]/70">Your quiz &quot;Midterm Review&quot; is ready with 15 questions.</p>
            <div className="mt-8 flex gap-4">
              <button className="rounded-[10px] border-2 border-slate-900 bg-white px-8 py-3 text-[13px] font-black uppercase tracking-wider text-slate-900 shadow-[4px_4px_0_#0f172a] transition hover:bg-slate-50">
                View Quiz
              </button>
              <button onClick={() => setShowResult(false)} className="rounded-[10px] border-2 border-slate-900 bg-[#99f6e4] px-8 py-3 text-[13px] font-black uppercase tracking-wider text-slate-900 transition hover:-translate-y-1 hover:bg-[#5eead4]">
                Dismiss
              </button>
            </div>
          </div>
        </article>
      )}

      <LoadingOverlay isLoading={isLoading} />
    </section>
  );
}
