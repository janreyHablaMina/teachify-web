"use client";

import { QuizzesMetrics } from "@/components/admin/quizzes/quizzes-metrics";
import { PopularSubjects } from "@/components/admin/quizzes/popular-subjects";
import { QuizTrendChart } from "@/components/admin/quizzes/quiz-trend-chart";

export default function QuizAnalyticsPage() {
  return (
    <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="m-0 text-[13px] font-bold uppercase tracking-[0.1em] text-slate-500">Admin / Quiz Analytics</p>
            <h2 className="mt-1 text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Understand platform usage</h2>
          </div>
        </header>

        {/* Top Metrics */}
        <QuizzesMetrics />

        {/* Insights Section */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.2fr]">
          <PopularSubjects />
          <QuizTrendChart />
        </div>
      </div>
    </main>
  );
}
