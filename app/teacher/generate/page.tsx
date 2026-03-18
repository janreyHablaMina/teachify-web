"use client";

import { useEffect, useMemo, useState } from "react";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { PLAN_CATALOG, normalizePlanTier } from "@/components/teacher/dashboard/plan";
import { UsageStats } from "@/components/teacher/generate/usage-stats";
import { ModeSwitcher } from "@/components/teacher/generate/mode-switcher";
import { FileUploadWorkspace } from "@/components/teacher/generate/file-upload-workspace";
import { LoadingOverlay } from "@/components/teacher/generate/loading-overlay";
import type { TeacherPlanUser } from "@/components/teacher/dashboard/types";
import { apiMe } from "@/lib/api/client";
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
            />
            <button className="mt-6 w-full rounded-[10px] border-2 border-slate-900 bg-[#99f6e4] py-4 text-[14px] font-black uppercase tracking-wider text-slate-900 shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1 hover:bg-[#5eead4]">
              Generate Summary
            </button>
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
