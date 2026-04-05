import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { DASHBOARD_BTN_BASE } from "./plan";

export function UnlockProPanel() {
  const features = ["Classrooms", "Student Analytics", "Assignments"];

  return (
    <section className="flex flex-col gap-4 rounded-[18px] border border-violet-200 bg-[linear-gradient(135deg,#faf5ff_0%,#f5f3ff_45%,#ffffff_100%)] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="m-0 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            Upgrade
          </p>
          <h4 className="m-0 mt-1 text-[20px] font-black tracking-[-0.02em] text-slate-900">Unlock Pro Features</h4>
        </div>
        <Link
          href="/teacher/upgrade"
          className={`${DASHBOARD_BTN_BASE.replace("shadow-[4px_4px_0_#0f172a]", "shadow-sm")} bg-[#ede9fe] no-underline`}
        >
          <Crown className="mr-1.5 h-4 w-4" />
          Upgrade Plan
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <span key={feature} className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-violet-800">
            {feature}
          </span>
        ))}
      </div>
      <p className="m-0 text-[12px] font-bold leading-[1.5] text-slate-600">
        Pro and School unlock classroom tools, analytics, assignments, and advanced teacher workflows.
      </p>
    </section>
  );
}
