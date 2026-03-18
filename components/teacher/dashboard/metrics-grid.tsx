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

export function MetricsGrid({ activeClasses, used, progressPercent, planTierLabel, planTier, limit, maxQuestions }: MetricsGridProps) {
  if (planTier === "trial") {
    const remaining = Math.max(0, limit - used);
    return (
      <section className="grid grid-cols-1 gap-[14px] min-[680px]:grid-cols-2 min-[1160px]:grid-cols-4">
        <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Generations Left</p>
          <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">{remaining} / {limit}</strong>
        </article>
        <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Question Limit</p>
          <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">Up to {maxQuestions}</strong>
        </article>
        <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Question Type</p>
          <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">Multiple Choice</strong>
        </article>
        <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Export</p>
          <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">Basic PDF</strong>
        </article>
      </section>
    );
  }

  if (planTier === "basic") {
    const remaining = Math.max(0, limit - used);
    return (
      <section className="grid grid-cols-1 gap-[14px] min-[680px]:grid-cols-2 min-[1160px]:grid-cols-4">
        <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Generations Left</p>
          <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">{remaining} / {limit}</strong>
        </article>
        <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Question Limit</p>
          <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">Up to {maxQuestions}</strong>
        </article>
        <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Doc to Quiz</p>
          <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">Enabled</strong>
        </article>
        <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Plan Tier</p>
          <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">{planTierLabel}</strong>
        </article>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-[14px] min-[680px]:grid-cols-2 min-[1160px]:grid-cols-4">
      <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
        <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Active Classes</p>
        <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">{activeClasses}</strong>
      </article>
      <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
        <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Completed Quizzes</p>
        <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">{used}</strong>
      </article>
      <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
        <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Overall Progress</p>
        <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">{Math.round(progressPercent)}%</strong>
      </article>
      <article className="rounded-2xl border border-slate-900/10 bg-white px-4 py-[18px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
        <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Plan Tier</p>
        <strong className="mt-[7px] block text-[30px] font-black leading-none text-slate-900">{planTierLabel}</strong>
      </article>
    </section>
  );
}
