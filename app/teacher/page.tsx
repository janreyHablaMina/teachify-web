"use client";

import { DashboardHeader } from "@/components/teacher/dashboard/dashboard-header";
import { normalizePlanTier, PLAN_CATALOG } from "@/components/teacher/dashboard/plan";
import { PlanBanner } from "@/components/teacher/dashboard/plan-banner";
import { QuickActionsPanel } from "@/components/teacher/dashboard/quick-actions-panel";
import { RecentActivityFeed } from "@/components/teacher/dashboard/recent-activity-feed";
import { AiSuggestionCard } from "@/components/teacher/dashboard/ai-suggestion-card";
import { RecentLessonsPanel } from "@/components/teacher/dashboard/recent-lessons-panel";
import { PlanFeaturesPanel } from "@/components/teacher/dashboard/plan-features-panel";
import { RecentQuizzesPanel } from "@/components/teacher/dashboard/recent-quizzes-panel";
import { UnlockProPanel } from "@/components/teacher/dashboard/unlock-pro-panel";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import type { ClassroomSummary, QuizSummary, LessonSummary, TeacherPlanUser } from "@/components/teacher/dashboard/types";
import { useEffect, useMemo, useState } from "react";
import { apiGetClassrooms, apiGetQuizzes, apiGetSummaries } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { getTeacherDisplayName } from "@/lib/teacher/display-name";

const DEFAULT_PLAN_USER: TeacherPlanUser = {
  plan: "trial",
  plan_tier: "trial",
  quiz_generation_limit: 3,
  quizzes_used: 0,
  max_questions_per_quiz: 10,
};

export default function TeacherDashboardPage() {
  const session = useTeacherSession();

  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getStoredToken();
        const [quizRes, lessonRes, classRes] = await Promise.all([
          apiGetQuizzes<QuizSummary[]>(token ?? undefined),
          apiGetSummaries<LessonSummary[]>(token ?? undefined),
          apiGetClassrooms<ClassroomSummary[]>(token ?? undefined),
        ]);

        if (quizRes.response.ok) {
          setQuizzes(quizRes.data);
        }
        if (lessonRes.response.ok) {
          setLessons(lessonRes.data);
        }
        if (classRes.response.ok) {
          setClassrooms(classRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const userName = getTeacherDisplayName(session);
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
  const recentLessons = lessons.slice(0, 5);
  const totalClasses = classrooms.length;
  const activeClasses = classrooms.filter((c) => c.is_active).length;
  const planTierLabel = planTier === "trial" ? "FREE" : planTier.toUpperCase();

  return (
    <section className="flex min-h-full w-full flex-col gap-8 pb-10">
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

      <QuickActionsPanel planTier={planTier} />

      <section className="grid grid-cols-1 gap-6 min-[1200px]:grid-cols-2">
        {isLoading ? (
          <div className="h-[300px] animate-pulse rounded-[32px] bg-slate-100" />
        ) : (
          <RecentQuizzesPanel quizzes={recentQuizzes} />
        )}
        
        {isLoading ? (
          <div className="h-[300px] animate-pulse rounded-[32px] bg-slate-100" />
        ) : (
          <RecentLessonsPanel lessons={recentLessons} />
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 min-[1100px]:grid-cols-3">
        <div className="min-[1100px]:col-span-2">
           <RecentActivityFeed remaining={remaining} used={used} limit={limit} />
        </div>
        <AiSuggestionCard />
      </section>

      <section className="grid grid-cols-1 gap-6 min-[1160px]:grid-cols-2">
        <PlanFeaturesPanel planMeta={planMeta} planTier={planTier} />
        {(planTier === "trial" || planTier === "basic") ? <UnlockProPanel /> : null}
      </section>
    </section>
  );
}
