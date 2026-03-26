"use client";

import { DashboardHeader } from "@/components/teacher/dashboard/dashboard-header";
import { MetricsGrid } from "@/components/teacher/dashboard/metrics-grid";
import { normalizePlanTier, PLAN_CATALOG } from "@/components/teacher/dashboard/plan";
import { PlanBanner } from "@/components/teacher/dashboard/plan-banner";
import { PlanFeaturesPanel } from "@/components/teacher/dashboard/plan-features-panel";
import { RecentQuizzesPanel } from "@/components/teacher/dashboard/recent-quizzes-panel";
import { UnlockProPanel } from "@/components/teacher/dashboard/unlock-pro-panel";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import type { ClassroomSummary, QuizSummary, TeacherPlanUser } from "@/components/teacher/dashboard/types";
import { useEffect, useMemo, useState } from "react";
import { getStoredTeacherQuizzes, subscribeTeacherQuizzes } from "@/lib/teacher/quiz-store";
import { subscribeTeacherClassrooms } from "@/lib/teacher/classroom-store";

import { apiGetClassrooms } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";

const DEFAULT_PLAN_USER: TeacherPlanUser = {
  plan: "trial",
  plan_tier: "trial",
  quiz_generation_limit: 3,
  quizzes_used: 0,
  max_questions_per_quiz: 10,
};

export default function TeacherDashboardPage() {
  const session = useTeacherSession();

  const [quizzes, setQuizzes] = useState<QuizSummary[]>(() => getStoredTeacherQuizzes());
  const [classrooms, setClassrooms] = useState<ClassroomSummary[]>([]);

  useEffect(() => {
    const unsubQuizzes = subscribeTeacherQuizzes(() => setQuizzes(getStoredTeacherQuizzes()));

    // Classrooms
    const fetchClassrooms = async () => {
      try {
        const token = getStoredToken();
        const { response, data } = await apiGetClassrooms<ClassroomSummary[]>(token ?? undefined);
        if (response.ok) {
          setClassrooms(data);
        }
      } catch {
        // Fallback or silent error for dashboard metrics
      }
    };

    fetchClassrooms();
    const unsubCls = subscribeTeacherClassrooms(() => fetchClassrooms());

    return () => {
      unsubQuizzes();
      unsubCls();
    };
  }, []);

  const planUser: TeacherPlanUser = useMemo(
    () => ({
      ...DEFAULT_PLAN_USER,
      ...(session?.plan ? { plan: session.plan } : {}),
      ...(session?.planTier ? { plan_tier: session.planTier } : {}),
      ...(typeof session?.quizGenerationLimit === "number"
        ? { quiz_generation_limit: session.quizGenerationLimit }
        : {}),
      ...(typeof session?.quizzesUsed === "number"
        ? { quizzes_used: session.quizzesUsed }
        : {}),
      ...(typeof session?.maxQuestionsPerQuiz === "number"
        ? { max_questions_per_quiz: session.maxQuestionsPerQuiz }
        : {}),
    }),
    [session]
  );

  const userName = session?.name && session.name !== "Educator" ? session.name : "";
  const userEmail = session?.email ?? "";

  const planTier = normalizePlanTier(planUser.plan_tier ?? planUser.plan);
  const planMeta = PLAN_CATALOG[planTier];
  const limit = planUser.quiz_generation_limit ?? 3;

  const used = useMemo(() => {
    if (planTier === "basic" || planTier === "pro" || planTier === "school") {
      const now = new Date();
      return quizzes.filter((q) => {
        const d = new Date(q.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length;
    }
    return quizzes.length;
  }, [quizzes, planTier]);

  const maxQuestions = planUser.max_questions_per_quiz ?? planMeta.maxQuestions;
  const remaining = useMemo(() => Math.max(0, limit - used), [limit, used]);
  const progressPercent = useMemo(() => {
    if (limit <= 0) return 0;
    return Math.min(100, Math.max(0, (used / limit) * 100));
  }, [limit, used]);

  const recentQuizzes = quizzes.slice(0, 5);
  const activeClasses = classrooms.filter((c) => c.is_active).length;
  const planTierLabel = planTier === "trial" ? "FREE" : planTier.toUpperCase();

  return (
    <section className="flex min-h-full w-full flex-col gap-[22px]">
      <DashboardHeader planTier={planTier} planMeta={planMeta} userName={userName} userEmail={userEmail} />

      {(planTier === "trial" || planTier === "basic") && (
        <PlanBanner
          planMeta={planMeta}
          remaining={remaining}
          limit={limit}
          used={used}
          progressPercent={progressPercent}
        />
      )}

      <MetricsGrid
        activeClasses={activeClasses}
        used={used}
        progressPercent={progressPercent}
        planTierLabel={planTierLabel}
        planTier={planTier}
        limit={limit}
        maxQuestions={maxQuestions}
      />

      <section className="grid grid-cols-1 gap-4 min-[1160px]:grid-cols-2">
        <PlanFeaturesPanel planMeta={planMeta} planTier={planTier} />
        <RecentQuizzesPanel quizzes={recentQuizzes} />
      </section>

      {(planTier === "trial" || planTier === "basic") ? <UnlockProPanel /> : null}
    </section>
  );
}
