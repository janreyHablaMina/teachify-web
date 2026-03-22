import type { PlanTier } from "./types";

type MetricsGridProps = {
  activeClasses: number;
  used: number;
  progressPercent: number;
  planTierLabel: string;
  planTier: PlanTier;
  limit: number;
  maxQuestions: number;
};

function MetricCard({ 
  label, 
  value, 
  subtext, 
  colorClass, 
  subtextColor = "text-emerald-500" 
}: { 
  label: string; 
  value: string | number; 
  subtext?: string; 
  colorClass: string;
  subtextColor?: string;
}) {
  return (
    <article className={`rounded-2xl border border-slate-900/5 bg-white px-5 py-[22px] shadow-[0_12px_20px_-8px_rgba(0,0,0,0.08)] border-t-[5px] ${colorClass} transition-transform hover:-translate-y-1`}>
      <p className="m-0 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <strong className="mt-2 block text-[28px] font-bold tracking-tight text-slate-900 leading-none">{value}</strong>
      {subtext && (
        <p className={`mt-3 m-0 text-[11px] font-medium ${subtextColor} flex items-center gap-1`}>
          {subtext}
        </p>
      )}
    </article>
  );
}

export function MetricsGrid({ activeClasses, used, progressPercent, planTierLabel, planTier, limit, maxQuestions }: MetricsGridProps) {
  if (planTier === "trial") {
    const remaining = Math.max(0, limit - used);
    return (
      <section className="grid grid-cols-1 gap-5 min-[680px]:grid-cols-2 min-[1160px]:grid-cols-4">
        <MetricCard 
          label="Generations Left" 
          value={`${remaining} / ${limit}`} 
          subtext="Generations refill monthly" 
          colorClass="border-t-teal-400" 
        />
        <MetricCard 
          label="Question Limit" 
          value={`Up to ${maxQuestions}`} 
          subtext="Standard for Free plan" 
          colorClass="border-t-amber-400" 
        />
        <MetricCard 
          label="Question Type" 
          value="Multiple Choice" 
          subtext="Standard selection" 
          colorClass="border-t-rose-400" 
        />
        <MetricCard 
          label="Export Format" 
          value="Basic PDF" 
          subtext="Ready to print" 
          colorClass="border-t-violet-400" 
        />
      </section>
    );
  }

  if (planTier === "basic") {
    const remaining = Math.max(0, limit - used);
    return (
      <section className="grid grid-cols-1 gap-5 min-[680px]:grid-cols-2 min-[1160px]:grid-cols-4">
        <MetricCard 
          label="Generations Left" 
          value={`${remaining} / ${limit}`} 
          subtext="+2 generations this month" 
          colorClass="border-t-teal-400" 
        />
        <MetricCard 
          label="Question Limit" 
          value={`Up to ${maxQuestions}`} 
          subtext="Enhanced for Basic plan" 
          colorClass="border-t-amber-400" 
        />
        <MetricCard 
          label="Doc to Quiz" 
          value="Enabled" 
          subtext="AI analysis active" 
          colorClass="border-t-rose-400" 
        />
        <MetricCard 
          label="Plan Tier" 
          value={planTierLabel} 
          subtext="Active membership" 
          colorClass="border-t-violet-400" 
        />
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-5 min-[680px]:grid-cols-2 min-[1160px]:grid-cols-4">
      <MetricCard 
        label="Active Classes" 
        value={activeClasses} 
        subtext="+12 this month" 
        colorClass="border-t-teal-400" 
      />
      <MetricCard 
        label="Completed Quizzes" 
        value={used} 
        subtext="+3.2% vs yesterday" 
        colorClass="border-t-amber-400" 
      />
      <MetricCard 
        label="Overall Progress" 
        value={`${Math.round(progressPercent)}%`} 
        subtext="115% of goal" 
        colorClass="border-t-rose-400" 
      />
      <MetricCard 
        label="Plan Tier" 
        value={planTierLabel} 
        subtext="System optimal" 
        colorClass="border-t-violet-400" 
      />
    </section>
  );
}
