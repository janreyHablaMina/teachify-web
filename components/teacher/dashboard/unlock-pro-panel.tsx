import Link from "next/link";
import { Crown, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { DASHBOARD_BTN_BASE } from "./plan";

export function UnlockProPanel() {
  const benefits = [
    "Manage Unlimited Classes",
    "Track Student Performance",
    "Advanced AI Quiz Options",
    "Seamless Assignments"
  ];

  return (
    <section className="relative overflow-hidden rounded-[24px] border-[1.5px] border-indigo-900 bg-white p-6 shadow-[2px_2px_0_#4f46e5]">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-50/50 blur-3xl" />
      
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-[2px_2px_0_#1e1b4b]">
              <Crown className="h-5 w-5" />
            </span>
            <p className="m-0 text-[12px] font-black uppercase tracking-[0.15em] text-indigo-600">Upgrade Available</p>
          </div>
          <h4 className="m-0 text-[26px] font-black tracking-tight text-slate-900">Unlock Classroom Features</h4>
          <p className="max-w-md text-[15px] font-bold leading-relaxed text-slate-600">
            Take your teaching to the next level. Create classes, track students, and analyze performance with our Pro toolset.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/teacher/upgrade"
            className={`${DASHBOARD_BTN_BASE} h-14 min-w-[200px] gap-2 bg-indigo-600 text-white shadow-[4px_4px_0_#1e1b4b] transition hover:bg-indigo-700 active:translate-x-1 active:translate-y-1 active:shadow-none no-underline border-indigo-900`}
          >
            Upgrade Plan
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-center text-[11px] font-bold text-slate-400">Cancel or change anytime.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 border-t-2 border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <span className="text-[13px] font-black tracking-tight text-slate-700">{benefit}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
