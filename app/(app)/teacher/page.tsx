"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { normalizePlanTier, PLAN_CATALOG, type PlanTier } from "@/lib/plans";
import styles from "./teacher.module.css";

type TeacherPlanUser = {
  plan?: string;
  plan_tier?: string;
  quiz_generation_limit?: number;
  quizzes_used?: number;
  max_questions_per_quiz?: number;
};

type QuizSummary = {
  id: number;
  title: string;
  created_at: string;
};

export default function TeacherDashboardPage() {
  const [planUser, setPlanUser] = useState<TeacherPlanUser | null>(null);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [user, quizzesRes] = await Promise.all([getUser(), api.get("/api/quizzes")]);
        if (!isMounted || !user) return;

        setPlanUser({
          plan: user.plan,
          plan_tier: user.plan_tier,
          quiz_generation_limit: user.quiz_generation_limit,
          quizzes_used: user.quizzes_used,
          max_questions_per_quiz: user.max_questions_per_quiz,
        });
        setQuizzes(quizzesRes.data ?? []);
      } catch {
      }
    }

    loadDashboardData();

    function refreshOnFocus() {
      loadDashboardData();
    }
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, []);

  const planTier: PlanTier = normalizePlanTier(planUser?.plan_tier ?? planUser?.plan);
  const planMeta = PLAN_CATALOG[planTier];
  const limit = planUser?.quiz_generation_limit ?? 3;
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
  const maxQuestions = planUser?.max_questions_per_quiz ?? planMeta.maxQuestions;
  const remaining = useMemo(() => Math.max(0, limit - used), [limit, used]);
  const progressPercent = useMemo(() => {
    if (limit <= 0) return 0;
    return Math.min(100, Math.max(0, (used / limit) * 100));
  }, [limit, used]);
  const recentQuizzes = quizzes.slice(0, 5);

  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Dashboard / Overview</p>
          <h2>{planMeta.label} Dashboard</h2>
          <p className={styles.subtitle}>
            {planTier.toUpperCase()} - {planMeta.priceLabel}: access your current plan features and usage in one place.
          </p>
        </div>
      </header>

      {(planTier === "trial" || planTier === "basic") && (
        <section className={styles.trialBanner}>
          <div className={styles.bannerMain}>
            <p className={styles.bannerKicker}>Plan Banner</p>
            <h3>{planMeta.label} - {remaining} quizzes remaining</h3>
            <p className={styles.bannerSubtext}>Generate your first quiz now</p>
            <div className={styles.progressWrap}>
              <p>Trial Usage</p>
              <div className={styles.progressTrack} role="progressbar" aria-valuemin={0} aria-valuemax={limit} aria-valuenow={used}>
                <span className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
              </div>
              <small>{remaining} of {limit} remaining</small>
            </div>
          </div>
          <div className={styles.bannerActions}>
            <Link href="/teacher/generate" className={styles.generateBtn}>Generate Quiz</Link>
            <button type="button" className={styles.upgradeBtn}>Upgrade Plan</button>
          </div>
        </section>
      )}

      <section className={styles.metricGrid}>
        <article className={styles.metricCard}>
          <p>Quizzes Remaining</p>
          <strong>{remaining}</strong>
        </article>
        <article className={styles.metricCard}>
          <p>Quizzes Used</p>
          <strong>{used}</strong>
        </article>
        <article className={styles.metricCard}>
          <p>Max Questions</p>
          <strong>{maxQuestions}</strong>
        </article>
        <article className={styles.metricCard}>
          <p>Plan</p>
          <strong>{planTier.toUpperCase()}</strong>
        </article>
      </section>
      <p className={styles.limitReminder}>
        Current plan includes: {planMeta.quizLimitLabel}, up to {maxQuestions} questions per quiz.
      </p>

      <section className={`${styles.layoutGrid} ${recentQuizzes.length === 0 ? styles.layoutGridSingle : ""}`}>
        {recentQuizzes.length > 0 ? (
          <article className={styles.panel}>
            <div className={styles.panelHead}>
              <h4>Current Plan Features</h4>
            </div>
            <div className={styles.featureList}>
              {planMeta.features.slice(0, 6).map((feature) => (
                <div key={feature} className={styles.featureItem}>{feature}</div>
              ))}
            </div>
            <p className={styles.insightHint}>Upgrade to Pro to unlock Classrooms, Student Analytics, and Assignments.</p>
            <button type="button" className={styles.upgradeBtn}>Upgrade Plan</button>
          </article>
        ) : null}

        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>My Recent Quizzes</h4>
          </div>
          {recentQuizzes.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven&apos;t created any quizzes yet.</p>
              <span>Start by generating your first quiz.</span>
              <Link href="/teacher/generate" className={styles.generateBtn}>Generate Quiz</Link>
            </div>
          ) : (
            <div className={styles.quizList}>
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className={styles.quizItemRow}>
                  <p className={styles.quizItem}>{quiz.title}</p>
                  <div className={styles.quizActions}>
                    <Link href={`/teacher/quizzes/${quiz.id}`} className={styles.quizActionBtn}>View</Link>
                    <span className={styles.quizActionDate}>{new Date(quiz.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Unlock Pro Features</h4>
        </div>
        <div className={styles.proFeatureGrid}>
          <div className={styles.proFeature}>Classrooms</div>
          <div className={styles.proFeature}>Student Analytics</div>
          <div className={styles.proFeature}>Assignments</div>
        </div>
        <p className={styles.proHint}>
          Pro and School unlock classroom tools, analytics, assignments, and advanced teacher workflows.
        </p>
      </section>
    </section>
  );
}
